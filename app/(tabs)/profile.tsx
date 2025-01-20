import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 

// Define interface to match the schema
interface UserProfile {
  name: string;
  dateOfBirth: string;
  gender: string;
  houseDetails: string;
  place: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  photo: string | null;
  mappedHouse: string;
  username: string;
}

    


const Profile = () => {
   

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    dateOfBirth: '',
    gender: '',
    houseDetails: '',
    place: '',
    locality: '',
    district: '',
    mobileNo: '',
    aadhaarNo: '',
    rationId: '',
    photo: null,
    mappedHouse: '',
    username: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>({...userProfile});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});

  // Create axios instance with interceptor for token
  const api = axios.create({
    baseURL: API_URL,
  });

  // Add request interceptor to add token to all requests
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      } catch (error) {
        console.error('Error getting token:', error);
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle token expiration
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Handle token expiration - redirect to login
        await AsyncStorage.removeItem('userToken');
        // You'll need to implement navigation to login screen
        // navigation.replace('Login');
        Alert.alert('Session Expired', 'Please login again');
      }
      return Promise.reject(error);
    }
  );

  const validateProfile = () => {
    const newErrors: Partial<Record<keyof UserProfile, string>> = {};
    if (!editedProfile.name?.trim()) newErrors.name = 'Name is required';
    if (!editedProfile.mobileNo?.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(editedProfile.mobileNo)) {
      newErrors.mobileNo = 'Invalid mobile number';
    }
    if (!editedProfile.houseDetails?.trim()) newErrors.houseDetails = 'House details are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get('/user/profile');

      setUserProfile(response.data);
      setEditedProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch profile data. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

// Add this function for logout
const router = useRouter();
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    // Navigate to the login screen or reset navigation stack
    Alert.alert('Logged Out', 'You have successfully logged out.');
    router.replace('/sign_in');
  } catch (error) {
    console.error('Error logging out:', error);
    Alert.alert('Error', 'Failed to log out. Please try again.');
  }
};

  const handleSave = async () => {
    if (!validateProfile()) {
      Alert.alert('Validation Error', 'Please check all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/user/profile', editedProfile);
      setUserProfile(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageLoading(true);
        const formData = new FormData();

        const localUri = result.assets[0].uri;
        const filename = localUri.split('/').pop() || 'profile-photo.jpg';
        
        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('photo', {
          uri: localUri,
          type,
          name: filename,
        });

        const response = await api.post(
          '/user/profile/photo',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      
        setUserProfile({ ...userProfile, photo: response.data.photo });
        setEditedProfile({ ...editedProfile, photo: response.data.photo });
      }
    } catch (error) {
      console.error('Error updating profile photo:', error);
      Alert.alert('Error', 'Failed to update profile photo');
    } finally {
      setImageLoading(false);
    }
  };

  const NonEditableField = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.nonEditableField}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
    </View>
  );

  const EditableField = ({ 
    label, 
    value, 
    onChangeText, 
    editable = true, 
    error 
  }: { 
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    editable?: boolean; 
    error?: string 
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing && editable ? (
        <>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={onChangeText}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      )}
    </View>
  );

  if (loading && !isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          {imageLoading ? (
            <View style={[styles.profileImage, styles.imageLoading]}>
              <ActivityIndicator color="white" />
            </View>
          ) : (
            <Image
              source={
                userProfile.photo
                  ? { uri: userProfile.photo }
                  : require('@/assets/images/prfile.png')
              }
              style={styles.profileImage}
            />
          )}
          {isEditing && (
            <TouchableOpacity 
              style={styles.imageEditButton}
              onPress={handleImagePick}
            >
              <MaterialIcons name="edit" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
        {/* Logout Icon */}
        <TouchableOpacity 
          style={styles.logoutIcon}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={28} color="#FF6347" />
        </TouchableOpacity>

      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity
            style={[styles.editButton, loading && styles.editButtonDisabled]}
            onPress={() => {
              if (loading) return;
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={loading}
          >
            {loading && isEditing ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <EditableField
          label="Full Name"
          value={editedProfile.name}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, name: text })
          }
          error={errors.name}
        />

        <EditableField
          label="Date of Birth"
          value={editedProfile.dateOfBirth}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, dateOfBirth: text })
          }
        />

        <EditableField
          label="Gender"
          value={editedProfile.gender}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, gender: text })
          }
        />

        <EditableField
          label="House Details"
          value={editedProfile.houseDetails}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, houseDetails: text })
          }
          error={errors.houseDetails}
        />

        <EditableField
          label="Place"
          value={editedProfile.place}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, place: text })
          }
        />

        <EditableField
          label="Locality"
          value={editedProfile.locality}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, locality: text })
          }
        />

        <EditableField
          label="District"
          value={editedProfile.district}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, district: text })
          }
        />

        <EditableField
          label="Mobile Number"
          value={editedProfile.mobileNo}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, mobileNo: text })
          }
          error={errors.mobileNo}
        />

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Government IDs
        </Text>

        <NonEditableField label="Aadhaar Number" value={userProfile.aadhaarNo} />
        <NonEditableField label="Ration ID" value={userProfile.rationId} />
        
        {userProfile.mappedHouse && (
          <NonEditableField label="Mapped House" value={userProfile.mappedHouse} />
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;

// Add these styles at the end of your Profile component file

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    backgroundColor: '#11486b',
    paddingTop: 45,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  imageEditButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#2c6288',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageLoading: {
    backgroundColor: '#2c6288',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11486b',          
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  logoutIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  editButton: {
    backgroundColor: '#11486b',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  editButtonDisabled: {
    backgroundColor: '#9ab3c3',
    opacity: 0.8,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#516a79',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#dde5eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#11486b',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#FF5A5A',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF5A5A',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  valueContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#dde5eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  valueText: {
    fontSize: 16,
    color: '#11486b',
    fontWeight: '500',
  },
  nonEditableField: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#e5e9ed',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#11486b',
    fontSize: 17,
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: '#e5e9ed',
    marginVertical: 25,
    width: '100%',
    opacity: 0.8,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11486b',
    marginBottom: 15,
    letterSpacing: 0.3,
  }
});                             