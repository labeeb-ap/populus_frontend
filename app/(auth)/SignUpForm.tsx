import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, Button, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MapScreen from './MapScreen';
import { API_URL } from '@/constants/constants';
import * as ImagePicker from 'expo-image-picker';
const UPLOAD_PRESET = 'react_native_preset';
import axios from 'axios';
interface FormData {
  name: string;
  dateOfBirth: Date | null;
  gender: string;
  email: string; // New email field
  income: string; // New income field
  houseDetails: string;
  wardNumber: string; // New ward number field
  place: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  photo: string;
  mappedHouse: string;
  username: string;
  password: string;
  isOwnerHome: string; 
}

interface ValidationErrors {
  [key: string]: string;
}

const KERALA_DISTRICTS = [
  'Palakkad', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Malappuram', 'Kozhikode',
  'Wayanad', 'Kannur', 'Kasaragod'
];

const DISTRICT_PLACES: { [key: string]: { [key: string]: string[] } } = {
  'Palakkad': {
    'Palakkad Town': ['Olavakkode', 'Stadium Puthur', 'Chandranagar'],
    'Ottapalam': ['Vandazhi', 'Lakkidi', 'Shornur'],
  },
  // Add other districts
};

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: null,
    gender: '',
    email: '', // New email field initialized
    income: '', // New income field initialized
    houseDetails: '',
    wardNumber: '', // New ward number field initialized
    place: '',
    locality: '',
    district: 'Palakkad',
    mobileNo: '',
    aadhaarNo: '',
    rationId: '',
    photo: '',
    mappedHouse: '',
    username: '',
    password: '',
    isOwnerHome: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
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
      setImage(result.assets[0].uri);
      uploadToCloudinary(result.assets[0].uri);
    }
  };
  
  const uploadToCloudinary = async (uri: string) => {
    try {
      // Create the FormData object for the image
      const imagedata = new FormData();
  
      // Extract the file name and type from the URI
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
  
      // Append the file data in the correct format for React Native
      imagedata.append('file', {
        uri,
        name: filename || 'upload.jpg',
        type,
      });
  
      // Append the upload preset
      imagedata.append('upload_preset', 'profilepic');
  
      // Make the request to Cloudinary
      const uploadResponse = await axios.post(
        'https://api.cloudinary.com/v1_1/dnwlvkrqs/image/upload',
        imagedata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      // Get the secure URL of the uploaded image
      const imageUrl = uploadResponse.data.secure_url;
      console.log('Uploaded:', imageUrl);
  
      // Update the formData with the uploaded image URL
      setFormData((prev) => ({
        ...prev,
        photo: imageUrl,
      }));
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      Alert.alert('Upload Failed', 'Could not upload the image. Please try again.');
    }
  };
      
  const validateField = (field: keyof FormData, value: any): string => {
    switch (field) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'dateOfBirth':
        return !value ? 'Date of Birth is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Enter a valid email address' : '';
      case 'income':
        return isNaN(Number(value)) ? 'Income must be a number' : '';
      case 'wardNumber':
        return !value ? 'Ward number is required' : '';
      case 'mobileNo':
        const mobileRegex = /^[2-9]\d{9}$/;
        return !mobileRegex.test(value) ? 'Enter valid 10-digit mobile number not starting with 0 or 1' : '';
      case 'aadhaarNo':
        const aadhaarRegex = /^\d{12}$/;
        return !aadhaarRegex.test(value) ? 'Enter valid 12-digit Aadhaar number' : '';
      case 'rationId':
        const rationRegex = /^\d{10}$/;
        return !rationRegex.test(value) ? 'Enter valid 10-digit Ration ID' : '';
      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        return !usernameRegex.test(value) ? 'Username can only contain letters, numbers, and underscores' : '';
      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return !passwordRegex.test(value) ? 'Password must be 8 characters with letters, numbers, and special characters' : '';
      case 'isOwnerHome':
          return !value ? 'Please specify if this is the ration card owner\'s home' : '';
      default:
        return '';
    }
  };

  const handleInputChange = async (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error,
    }));

    if (field === 'username' && value) {
      setIsUsernameChecking(true);
      try {
        const response = await fetch(`${API_URL}/user/check-username/${value}`);
        console.log(response);
        const data = await response.json();
        if (!data.available) {
          setErrors(prev => ({
            ...prev,
            username: 'Username already taken',
          }));
        }
      } catch (error) {
        console.error('Username check failed:', error);
      }
      setIsUsernameChecking(false);
    }
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    
    // Object.keys(formData).forEach((key) => {
    //   const fieldName = key as keyof FormData;
    //   const error = validateField(fieldName, formData[fieldName]);
    //   if (error) {
    //     newErrors[fieldName] = error;
    //   }
    // });
    const requiredFields: (keyof FormData)[] = [
      'name',
      'dateOfBirth',
      'gender',
      'email', // Added email as required
      'houseDetails',
      'wardNumber', // Added ward number as required
      'place',
      'locality',
      'district',
      'mobileNo',
      'aadhaarNo',
      'rationId',
      'username',
      'password',
      'mappedHouse'
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      } else {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.name &&
        formData.dateOfBirth &&
        formData.gender &&
        formData.email && // Added email validation
        formData.houseDetails &&
        formData.wardNumber && // Added ward number validation
        formData.place &&
        formData.locality &&
        formData.district &&
        formData.mobileNo &&
        formData.aadhaarNo &&
        formData.rationId &&
        !errors.name &&
        !errors.email && // Added email error check
        !errors.wardNumber && // Added ward number error check
        !errors.mobileNo &&
        !errors.aadhaarNo &&
        !errors.rationId
      );
    }
    return true;
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert('Error', 'Please fill all required fields correctly');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      const missingFields = Object.keys(errors).join(', ');
      Alert.alert('Validation Error', `Please check the following fields: ${missingFields}`);
      return;
    }

    try {
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0],
      };

      const response = await fetch(`${API_URL}/user/resident_signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      const data = await response.json();
      Alert.alert(
        'Success',
        'Registration completed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/success'),
          },
        ]
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Error',
        error instanceof Error 
          ? error.message 
          : 'Failed to submit form. Please try again.'
      );
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
    <View style={styles.container}>
      <Text style={styles.formTitle}>
        {currentStep === 1 ? 'Personal Information' : 'Account Setup'}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressIndicator, { width: `${(currentStep/2) * 100}%` }]} />
      </View>
      <Text style={styles.stepIndicator}>Step {currentStep} of 2</Text>

      {currentStep === 1 && (
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholderTextColor="#666"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.dateOfBirth
                  ? formData.dateOfBirth.toLocaleDateString()
                  : 'Select Date of Birth'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth || new Date()}
              mode="date"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) handleInputChange('dateOfBirth', date);
              }}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={value => handleInputChange('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>
          </View>

          {/* New Email field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* New Income field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Annual Income (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your annual income"
              value={formData.income}
              onChangeText={value => handleInputChange('income', value)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            {errors.income && <Text style={styles.errorText}>{errors.income}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>House Details</Text>
            <TextInput
              style={styles.input}
              placeholder="House No/Name"
              value={formData.houseDetails}
              onChangeText={value => handleInputChange('houseDetails', value)}
              placeholderTextColor="#666"
            />
          </View>

          {/* New Ward Number field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ward Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ward number"
              value={formData.wardNumber}
              onChangeText={value => handleInputChange('wardNumber', value)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            {errors.wardNumber && <Text style={styles.errorText}>{errors.wardNumber}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location Details</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.district}
                onValueChange={value => handleInputChange('district', value)}
                style={styles.picker}
              >
                {KERALA_DISTRICTS.map(district => (
                  <Picker.Item key={district} label={district} value={district} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.place}
                onValueChange={value => handleInputChange('place', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Place" value="" />
                {DISTRICT_PLACES[formData.district] &&
                  Object.keys(DISTRICT_PLACES[formData.district]).map(place => (
                    <Picker.Item key={place} label={place} value={place} />
                  ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.locality}
                onValueChange={value => handleInputChange('locality', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Locality" value="" />
                {DISTRICT_PLACES[formData.district]?.[formData.place]?.map(locality => (
                  <Picker.Item key={locality} label={locality} value={locality} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact & ID Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              value={formData.mobileNo}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={value => handleInputChange('mobileNo', value)}
              placeholderTextColor="#666"
            />
            {errors.mobileNo && <Text style={styles.errorText}>{errors.mobileNo}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Aadhaar Number"
              value={formData.aadhaarNo}
              keyboardType="numeric"
              maxLength={12}
              onChangeText={value => handleInputChange('aadhaarNo', value)}
              placeholderTextColor="#666"
            />
            {errors.aadhaarNo && <Text style={styles.errorText}>{errors.aadhaarNo}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Ration ID"
              value={formData.rationId}
              keyboardType="numeric"
              maxLength={10}
              onChangeText={value => handleInputChange('rationId', value)}
              placeholderTextColor="#666"
            />
            {errors.rationId && <Text style={styles.errorText}>{errors.rationId}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, !isStepValid() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!isStepValid()}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Credentials</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              placeholderTextColor="#666"
            />
            {isUsernameChecking && <Text style={styles.checkingText}>Checking username...</Text>}
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={formData.password}
              secureTextEntry
              onChangeText={value => handleInputChange('password', value)}
              placeholderTextColor="#666"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {formData.photo ? (
            <Image source={{ uri: formData.photo }} style={styles.imagePreview} />
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>
      )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Residence Verification</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.isOwnerHome}
                onValueChange={value => handleInputChange('isOwnerHome', value)}
                style={styles.picker}
              >
                <Picker.Item label="Is this the Ration Card Owner's Home?" value="" />
                <Picker.Item label="Yes" value="yes" />
                <Picker.Item label="No" value="no" />
              </Picker>
            </View>
            {errors.isOwnerHome && <Text style={styles.errorText}>{errors.isOwnerHome}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>House Location</Text>
            <View style={styles.mapContainer}>
              <MapScreen onLocationSelect={location => handleInputChange('mappedHouse', location)} />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonSecondary]} 
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.buttonTextSecondary}>Back</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.button,
                (!formData.username || !formData.password || !formData.isOwnerHome) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!formData.username || !formData.password || !formData.isOwnerHome}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </ScrollView>
);
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressIndicator: {
    height: '100%',
    backgroundColor: '#003366',
    borderRadius: 2,
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  picker: {
    height: 50,
  },
  dateInput: {
    justifyContent: 'center',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  uploadButton: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#003366',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#003366',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#003366',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
  },
  checkingText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
  },
});

export default SignUpForm;