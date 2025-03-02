import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './Style/profile';

interface UserProfile {
  name: string;
  dateOfBirth: string;
  gender: string;
  houseDetails: string;
  place: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo?: string;
  rationId?: string;
  photo?: string | null;
  mappedHouse: string;
  username?: string;
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
  const [imageUploading, setImageUploading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfile, string>>>({});
  const router = useRouter();

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  

    

  // Gender selection state
  const [showGenderModal, setShowGenderModal] = useState(false);
  const genderOptions = ['Male', 'Female', 'Others'];

  // Create axios instance with interceptor for token
  const api = axios.create({
    baseURL: API_URL,
  });

  // Add request interceptor to add token to all requests
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("profile token",token);
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
        Alert.alert('Session Expired', 'Please login again');
        router.replace('/sign_in');
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
      // Direct fetch request with manually included token
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("response",response);
      if (!response.ok) {
        throw new Error(`Failed to fetch profile data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("data",data);
      if (data) {
        // When updating the state with the response data
        setUserProfile({
          name: data.name || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          houseDetails: data.houseDetails || '',
          place: data.place || '',
          locality: data.locality || '',
          district: data.district || '',
          mobileNo: data.mobileNo || '',
          aadhaarNo: data.aadhaarNo || '',
          rationId: data.rationId || '',
          photo: data.photo || null,
          mappedHouse: data.mappedHouse || '',
          username: data.username || '',
        });
        setEditedProfile({
          name: data.name || '',
          dateOfBirth: data.dateOfBirth || '',
          gender: data.gender || '',
          houseDetails: data.houseDetails || '',
          place: data.place || '',
          locality: data.locality || '',
          district: data.district || '',
          mobileNo: data.mobileNo || '',
          aadhaarNo: data.aadhaarNo || '',
          rationId: data.rationId || '',
          photo: data.photo || null,
          mappedHouse: data.mappedHouse || '',
          username: data.username || '',
        });
        
        // Set date if dateOfBirth exists
        if (data.dateOfBirth) {
          try {
            const dateParts = data.dateOfBirth.split('/');
            if (dateParts.length === 3) {
              // Assuming format is DD/MM/YYYY
              const dateObj = new Date(
                parseInt(dateParts[2]), 
                parseInt(dateParts[1]) - 1, 
                parseInt(dateParts[0])
              );
              
              if (!isNaN(dateObj.getTime())) {
                setDate(dateObj);
              }
            }
          } catch (error) {
            console.error('Error parsing date:', error);
          }
        }
      } else {
        throw new Error('Invalid profile data');
      }
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

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              router.replace('/sign_in');
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!validateProfile()) {
      Alert.alert('Validation Error', 'Please check all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Create a copy of editedProfile for sending to the API
      const profileToUpdate = { ...editedProfile };
      
      // Remove fields that shouldn't be updated as per the backend

      delete profileToUpdate.aadhaarNo;
      delete profileToUpdate.rationId;
      delete profileToUpdate.username;
      
      // Include the photo field if it exists
      if (editedProfile.photo) {
        profileToUpdate.photo = editedProfile.photo;
      }
      
      const response = await api.put('/user/profile', profileToUpdate);
      setUserProfile(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Your profile has been updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Camera roll permission is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  
    if (!result.canceled) {
      setImageUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(result.assets[0].uri);
        if (imageUrl) {
          setImage(imageUrl);
          setEditedProfile(prev => ({ ...prev, photo: imageUrl }));
        }
      } catch (error) {
        console.error('Error updating profile photo:', error);
        Alert.alert('Error', 'Failed to update profile photo.');
      } finally {
        setImageUploading(false);
      }
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    try {
      const imagedata = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
  
      imagedata.append('file', {
        uri,
        name: filename || 'upload.jpg',
        type,
      } as any);
  
      imagedata.append('upload_preset', 'post_images');
  
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dnwlvkrqs/image/upload',
        imagedata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      const imageUrl = uploadResponse.data.secure_url;
      return imageUrl;
      
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      Alert.alert('Upload Failed', 'Could not upload the image. Please try again.');
      return null;
    }
  };
 
  const NonEditableField = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.nonEditableField}>
        {icon && <MaterialIcons name={icon} size={20} color="#00538C" style={{ marginRight: 8 }} />}
        <Text style={styles.valueText}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );

 // Inside your component
const onDateChange = (event: any, selectedDate?: Date) => {
  setShowDatePicker(false); // Hide the date picker
  if (selectedDate) {
    setDate(selectedDate); // Update the date state
    // Format the date as DD/MM/YYYY
    const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
    setEditedProfile({ ...editedProfile, dateOfBirth: formattedDate }); // Update the profile state
  }
};


  // Handle gender selection
  const selectGender = (gender: string) => {
    setEditedProfile({ ...editedProfile, gender });
    setShowGenderModal(false);
  };

  const EditableField = ({ 
    label, 
    value, 
    onChangeText, 
    editable = true, 
    error,
    icon,
    keyboardType = 'default',
    isDate = false,
    isGender = false,
  }: { 
    label: string; 
    value: string; 
    onChangeText?: (text: string) => void; 
    editable?: boolean; 
    error?: string;
    icon?: string;
    keyboardType?: 'default' | 'number-pad' | 'email-address' | 'phone-pad';
    isDate?: boolean;
    isGender?: boolean;
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      {isEditing && editable ? (
        <>
          {isDate ? (
            <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="event" size={20} color="#00538C" style={{ marginRight: 8 }} />
            <Text style={styles.dateText}>{editedProfile.dateOfBirth || 'Select date'}</Text>
          </TouchableOpacity>
          ) : isGender ? (
            <TouchableOpacity 
              style={styles.genderSelector}
              onPress={() => setShowGenderModal(true)}
            >
              <MaterialIcons name="people" size={20} color="#00538C" style={{ marginRight: 8 }} />
              <Text style={styles.genderText}>{value || 'Select gender'}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#00538C" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ) : (
            <TextInput
              style={[styles.input, error && styles.inputError]}
              value={value}
              onChangeText={onChangeText}
              placeholder={`Enter ${label.toLowerCase()}`}
              keyboardType={keyboardType}
            />
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </>
      ) : (
        <View style={styles.valueContainer}>
          {icon && <MaterialIcons name={icon} size={20} color="#00538C" style={{ marginRight: 8 }} />}
          <Text style={styles.valueText}>{value || 'Not provided'}</Text>
        </View>
      )}
    </View>
  );

  if (loading && !isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00538C" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => selectGender(option)}
              >
                <Text style={[
                  styles.modalOptionText,
                  editedProfile.gender === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                {editedProfile.gender === option && (
                  <MaterialIcons name="check" size={20} color="#00538C" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { fontSize: 24, marginBottom: 0 }]}>My Profile</Text>
        
        {/* Logout Icon */}
        <TouchableOpacity 
          style={styles.logoutIcon}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={24} color="#00538C" />
        </TouchableOpacity>
      </View>

      <View style={[styles.content, { alignItems: 'center', paddingVertical: 24 }]}>
        <View style={styles.imageContainer}>
          {imageUploading ? (
            <View style={[styles.profileImage, styles.imageLoading]}>
              <ActivityIndicator color="#00538C" />
            </View>
          ) : (
            <Image
              source={
                userProfile.photo || image
                  ? { uri: image || userProfile.photo }
                  : require('@/assets/images/prfile.png')
              }
              style={styles.profileImage}
            />
          )}
          {isEditing && (
            <TouchableOpacity 
              style={styles.imageEditButton}
              onPress={handleImageUpload}
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.profileName}>
          {userProfile.name || 'User Name'}
        </Text>
        
        {!isEditing && (
          <TouchableOpacity
            style={[styles.editButton, { marginTop: 16 }]}
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.actionBar}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {isEditing && (
            <View style={{ flexDirection: 'column' }}>
              <TouchableOpacity
                style={[
                  styles.editButton, 
                  { backgroundColor: '#f5f7fa' }
                ]}
                onPress={() => {
                  setIsEditing(false);
                  setEditedProfile({...userProfile});
                  setErrors({});
                }}
              >
                <Text style={[styles.editButtonText, { color: '#00538C' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.editButton, loading && styles.editButtonDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.editButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <EditableField
          label="Full Name"
          value={editedProfile.name}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, name: text })
          }
          error={errors.name}
          icon="person"
        />

        <EditableField
          label="Date of Birth"
          value={editedProfile.dateOfBirth}
          icon="cake"
          isDate={true}
        />

        <EditableField
          label="Gender"
          value={editedProfile.gender}
          icon="people"
          isGender={true}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Contact & Address</Text>

        <EditableField
          label="Mobile Number"
          value={editedProfile.mobileNo}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, mobileNo: text })
          }
          error={errors.mobileNo}
          icon="phone"
          keyboardType="phone-pad"
        />

        <EditableField
          label="House Details"
          value={editedProfile.houseDetails}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, houseDetails: text })
          }
          error={errors.houseDetails}
          icon="home"
        />

        <EditableField
          label="Place"
          value={editedProfile.place}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, place: text })
          }
          icon="place"
        />

        <EditableField
          label="Locality"
          value={editedProfile.locality}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, locality: text })
          }
          icon="location-city"
        />

        <EditableField
          label="District"
          value={editedProfile.district}
          onChangeText={(text) =>
            setEditedProfile({ ...editedProfile, district: text })
          }
          icon="map"
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Government IDs</Text>

        <NonEditableField 
            label="Aadhaar Number" 
            value={userProfile.aadhaarNo || 'Not provided'} 
            icon="card-membership"
          />
          <NonEditableField 
            label="Ration ID" 
            value={userProfile.rationId || 'Not provided'} 
            icon="credit-card"
          />
        
        {userProfile.mappedHouse && (
          <NonEditableField 
            label="Mapped House" 
            value={userProfile.mappedHouse} 
            icon="home"
          />
        )}
        
        <NonEditableField 
          label="Username" 
          value={userProfile.username || 'Not provided'} 
          icon="account-circle"
        />
      </View>
    </ScrollView>
  );
};

export default Profile;