import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  StyleSheet
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 
import DateTimePicker from '@react-native-community/datetimepicker';

// Define core profile data interface
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

// Props interface for Field component
interface FieldProps {
  label: string;
  value: string;
  icon: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  error?: string;
  keyboardType?: 'default' | 'phone-pad';
  isDate?: boolean;
  isGender?: boolean;
}

const Profile = () => {
  const router = useRouter();
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
  
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  
  // Form state
  const [editedProfile, setEditedProfile] = useState<UserProfile>({...userProfile});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [date, setDate] = useState(new Date());
  
  const genderOptions = ['Male', 'Female', 'Others'];

  // Create API client
  const api = axios.create({ baseURL: API_URL });
  
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('userToken');
        router.replace('/sign_in');
      }
      return Promise.reject(error);
    }
  );

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Request failed`);
      
      const data = await response.json();
      if (data) {
        const profileData = {
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
        };
        
        setUserProfile(profileData);
        setEditedProfile(profileData);
        
        // Parse date if available
        if (data.dateOfBirth) {
          try {
            const dateParts = data.dateOfBirth.split('/');
            if (dateParts.length === 3) {
              const dateObj = new Date(
                parseInt(dateParts[2]), 
                parseInt(dateParts[1]) - 1, 
                parseInt(dateParts[0])
              );
              
              if (!isNaN(dateObj.getTime())) setDate(dateObj);
            }
          } catch (error) {
            console.error('Error parsing date:', error);
          }
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    if (!editedProfile.name?.trim()) newErrors.name = 'Required';
    if (!editedProfile.mobileNo?.trim()) {
      newErrors.mobileNo = 'Required';
    } else if (!/^\d{10}$/.test(editedProfile.mobileNo)) {
      newErrors.mobileNo = 'Enter valid number';
    }
    if (!editedProfile.houseDetails?.trim()) newErrors.houseDetails = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile save
  const handleSave = async () => {
    if (!validateProfile()) return;

    try {
      setLoading(true);
      const profileToUpdate = { ...editedProfile };
      
      delete profileToUpdate.aadhaarNo;
      delete profileToUpdate.rationId;
      delete profileToUpdate.username;
      
      await api.put('/user/profile', profileToUpdate);
      setUserProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            router.replace('/sign_in');
          }
        }
      ]
    );
  };

  // Handle image upload
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to photos');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
  
    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(result.assets[0].uri);
        if (imageUrl) {
          setEditedProfile(prev => ({ ...prev, photo: imageUrl }));
        }
      } catch (error) {
        Alert.alert('Error', 'Photo upload failed');
      } finally {
        setImageUploading(false);
      }
    }
  };

  // Upload to Cloudinary
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
  
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dnwlvkrqs/image/upload',
        imagedata,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
  
      return response.data.secure_url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  // Date picker handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
      setEditedProfile({ ...editedProfile, dateOfBirth: formattedDate });
    }
  };

  // Gender selection handler
  const selectGender = (gender: string) => {
    setEditedProfile({ ...editedProfile, gender });
    setShowGenderModal(false);
  };

  // Field component
  const Field: React.FC<FieldProps> = ({ 
    label, 
    value, 
    icon, 
    onChangeText, 
    editable = true,
    error,
    keyboardType = 'default',
    isDate = false,
    isGender = false
  }) => {
    const isEditMode = isEditing && editable;
    
    return (
      <View style={styles.field}>
        <View style={styles.fieldHeader}>
          <MaterialIcons name={icon as any} size={20} color="#4A80F0" style={styles.fieldIcon} />
          <Text style={styles.fieldLabel}>{label}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        
        {isEditMode ? (
          <>
            {isDate ? (
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={value ? styles.inputText : styles.placeholder}>{value || 'Select date'}</Text>
                <MaterialIcons name="calendar-today" size={18} color="#4A80F0" />
              </TouchableOpacity>
            ) : isGender ? (
              <TouchableOpacity 
                style={styles.input}
                onPress={() => setShowGenderModal(true)}
              >
                <Text style={value ? styles.inputText : styles.placeholder}>{value || 'Select gender'}</Text>
                <MaterialIcons name="arrow-drop-down" size={22} color="#4A80F0" />
              </TouchableOpacity>
            ) : (
              <TextInput
                style={[styles.input, error && styles.inputError]}
                value={value}
                onChangeText={onChangeText}
                placeholder={`Enter ${label.toLowerCase()}`}
                keyboardType={keyboardType}
                placeholderTextColor="#9EA3B2"
                editable={editable}
              />
            )}
          </>
        ) : (
          <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
        )}
      </View>
    );
  };
  
  // Loading state
  if (loading && !isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A80F0" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => selectGender(option)}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                  {editedProfile.gender === option && (
                    <MaterialIcons name="check" size={22} color="#4A80F0" />
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
          </View>
        </Modal>

        {/* Header with profile image */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.pageTitle}>Profile</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={22} color="#4A80F0" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              {imageUploading ? (
                <ActivityIndicator size="large" color="#4A80F0" />
              ) : (
                <Image
                  source={
                    editedProfile.photo
                      ? { uri: editedProfile.photo }
                      : require('@/assets/images/profile.png') // Fixed typo in image path
                  }
                  style={styles.profileImage}
                />
              )}
              {isEditing && (
                <TouchableOpacity 
                  style={styles.editImageButton}
                  onPress={handleImageUpload}
                >
                  <MaterialIcons name="camera-alt" size={22} color="white" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.profileName}>{userProfile.name || 'User'}</Text>
          </View>
          
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <MaterialIcons name="edit" size={16} color="white" />
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false);
                  setEditedProfile({...userProfile});
                  setErrors({});
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Field
            label="Name"
            value={editedProfile.name}
            icon="person"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
            error={errors.name}
          />
          
          <Field
            label="Date of Birth"
            value={editedProfile.dateOfBirth}
            icon="cake"
            isDate={true}
          />
          
          <Field
            label="Gender"
            value={editedProfile.gender}
            icon="people"
            isGender={true}
          />
        </View>

        {/* Contact & Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Address</Text>
          
          <Field
            label="Mobile Number"
            value={editedProfile.mobileNo}
            icon="phone"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, mobileNo: text })}
            error={errors.mobileNo}
            keyboardType="phone-pad"
          />
          
          <Field
            label="House Details"
            value={editedProfile.houseDetails}
            icon="home"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, houseDetails: text })}
            error={errors.houseDetails}
          />
          
          <Field
            label="Place"
            value={editedProfile.place}
            icon="place"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, place: text })}
          />
          
          <Field
            label="Locality"
            value={editedProfile.locality}
            icon="location-city"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, locality: text })}
          />
          
          <Field
            label="District"
            value={editedProfile.district}
            icon="map"
            onChangeText={(text) => setEditedProfile({ ...editedProfile, district: text })}
          />
        </View>

        {/* IDs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Government IDs</Text>
          
          <Field
            label="Aadhaar Number" 
            value={userProfile.aadhaarNo || ''} 
            icon="card-membership"
            editable={false}
          />
          
          <Field
            label="Ration ID" 
            value={userProfile.rationId || ''} 
            icon="credit-card"
            editable={false}
          />
          
          {userProfile.mappedHouse && (
            <Field
              label="Mapped House" 
              value={userProfile.mappedHouse} 
              icon="home"
              editable={false}
            />
          )}
          
          <Field
            label="Username" 
            value={userProfile.username || ''} 
            icon="account-circle"
            editable={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A80F0',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A80F0',
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  editProfileButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A80F0',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  editProfileButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4A80F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#4A80F0',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FD',
    borderRadius: 10,
  },
  input: {
    backgroundColor: '#F8F9FD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholder: {
    fontSize: 16,
    color: '#9EA3B2',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF5A5A',
  },
  errorText: {
    color: '#FF5A5A',
    fontSize: 12,
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4FF',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Profile;