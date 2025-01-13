import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MapScreen from './MapScreen';
import { API_URL } from '@/constants/constants';

interface FormData {
  name: string;
  dateOfBirth: Date | null;
  gender: string;
  houseDetails: string;
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
    houseDetails: '',
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
  });

  const validateField = (field: keyof FormData, value: any): string => {
    switch (field) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'dateOfBirth':
        return !value ? 'Date of Birth is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
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
      'houseDetails',
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
        formData.houseDetails &&
        formData.place &&
        formData.locality &&
        formData.district &&
        formData.mobileNo &&
        formData.aadhaarNo &&
        formData.rationId &&
        !errors.name &&
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
    <ScrollView contentContainerStyle={styles.container}>
      {currentStep === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {formData.dateOfBirth
                ? formData.dateOfBirth.toLocaleDateString()
                : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>

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

          <TextInput
            style={styles.input}
            placeholder="House No/Name"
            value={formData.houseDetails}
            onChangeText={value => handleInputChange('houseDetails', value)}
          />

          <Picker
            selectedValue={formData.district}
            onValueChange={value => handleInputChange('district', value)}
            style={styles.picker}
          >
            {KERALA_DISTRICTS.map(district => (
              <Picker.Item key={district} label={district} value={district} />
            ))}
          </Picker>

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

          <TextInput
            style={styles.input}
            placeholder="Enter your Mobile No"
            value={formData.mobileNo}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={value => handleInputChange('mobileNo', value)}
          />
          {errors.mobileNo && <Text style={styles.errorText}>{errors.mobileNo}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Enter your Aadhaar No"
            value={formData.aadhaarNo}
            keyboardType="numeric"
            maxLength={12}
            onChangeText={value => handleInputChange('aadhaarNo', value)}
          />
          {errors.aadhaarNo && <Text style={styles.errorText}>{errors.aadhaarNo}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Enter your Ration ID"
            value={formData.rationId}
            keyboardType="numeric"
            maxLength={10}
            onChangeText={value => handleInputChange('rationId', value)}
          />
          {errors.rationId && <Text style={styles.errorText}>{errors.rationId}</Text>}

          <Button
            title="Next"
            onPress={handleNext}
            disabled={!isStepValid()}
            color="#003366"
          />
        </>
      )}

      {currentStep === 2 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={value => handleInputChange('username', value)}
          />
          {isUsernameChecking && <Text style={styles.checkingText}>Checking username...</Text>}
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            value={formData.password}
            secureTextEntry
            onChangeText={value => handleInputChange('password', value)}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Upload photo"
            value={formData.photo}
            onChangeText={value => handleInputChange('photo', value)}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Select location on map"
            value={formData.mappedHouse}
            editable={false}
          />
          <MapScreen onLocationSelect={location => handleInputChange('mappedHouse', location)} />
          
          <View style={styles.buttonRow}>
            <Button title="Back" onPress={() => setCurrentStep(1)} color="#003366" />
            <Button
              title="Submit"
              onPress={handleSubmit}
              disabled={Object.keys(errors).length > 0}
              color="#003366"
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
  checkingText: {
    color: '#666',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
  },
});

export default SignUpForm;