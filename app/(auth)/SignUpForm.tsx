import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import MapScreen from './MapScreen';
import { API_URL } from '@/constants/constants';
import styles from './Styles/SignUpForm';

interface FormData {
  name: string;
  email: string;
  dateOfBirth: Date | null;
  gender: string;
  job: string;
  address: string;
  houseDetails: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  photo: string;
  mappedHouse: string;
  username: string;
  password: string;
  confirmPassword:string;
  isOwnerHome: string; 
  selfGovType: 'Panchayath'|'Municipality'| undefined;
  localBody: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const KERALA_DISTRICTS = [
  'Palakkad', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Malappuram', 'Kozhikode',
  'Wayanad', 'Kannur', 'Kasaragod'
];

const SELF_GOVERNMENT_TYPES = ['Panchayath', 'Municipality'];

const PALAKKAD_LOCAL_BODIES : {
  Panchayath: string[];
    Municipality: string[];
    }={
  Panchayath: [
    'AGALI', 'AKATHETHARA', 'ALANALLUR', 'ALATHUR', 'AMBALAPARA',
    'ANAKKARA', 'ANANGANADI', 'AYILUR', 'CHALAVARA', 'CHALISSERI',
    'COYALAMMANAM', 'ELAPPULLY', 'ELEVANCHERY', 'ERIMAYUR', 'ERUTHEMPATHY',
    'KADAMPAZHIPURAM', 'KANHIRAPUZHA', 'KANNADI', 'KANNAMBRA', 'KAPPUR',
    'KARAKURUSSI', 'KARIMPUZHA', 'KAVASSERI', 'KERALASSERY', 'KIZHAKKANCHERY',
    'KODUMBA', 'KODUVAYUR', 'KOLLENGODE', 'KONGAD', 'KOPPAM',
    'KOTTOPPADAM', 'KOTTAYI', 'KOZHINJAMPARA', 'KARIMBA', 'KULUKKALLUR',
    'KUMARAMPUTHUR', 'KUTHANUR', 'LAKKIDI PERUR', 'MALAMPUZHA', 'MANKARA',
    'MANNUR', 'MARUTHARODE', 'MATHUR', 'MUTHUTHALA', 'MELARCODE',
    'MUNDUR', 'MUTHALAMADA', 'NAGALASSERI', 'NALLEPPILLY', 'NELLAYA',
    'NELLIAMPATHY', 'NEMMARA', 'ONGALLUR', 'PALLASSANA', 'POOKKOTTUKAVU',
    'PARUTHUR', 'PARALI', 'PATTITHARA', 'PATTANCHERY', 'PERUMATTY',
    'PERUNGOTTUKURUSSI', 'PERUVEMBA', 'PIRAYIRI', 'POLPULLY', 'PUDUCODE',
    'PUDUNAGARAM', 'PUDUPPARIYARM', 'PUDUR', 'PUDUSSERI', 'SHOLAYUR',
    'SREEKRISHNAPURAM', 'TARUR', 'THACHAMPARA', 'THACHANATTUKARA',
    'THENKURUSSI', 'THENKARA', 'THIRUMITTACODE', 'THIRUVEGAPURA',
    'TRIKKADIRI', 'THRITHALA', 'VADAKKANCHERY', 'VADAKARAPATHY',
    'VADAVANNUR', 'VALLAPUZHA', 'VANDAZHY'
  ],
  Municipality: [
    'PALAKKAD', 'CHITTUR-TATTAMANGALAM', 'MANNARKKAD', 'CHERPULASSERY',
    'OTTPPALAM', 'SHORANUR', 'PATTAMBI'
  ]
};

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isUsernameChecking, setIsUsernameChecking] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    dateOfBirth: null,
    gender: '',
    job: '',
    address: '',
    houseDetails: '',
    district: 'Palakkad',
    selfGovType: undefined,
    localBody: '',
    mobileNo: '',
    aadhaarNo: '',
    rationId: '',
    photo: '',
    mappedHouse: '',
    username: '',
    password: '',
    confirmPassword: '',
    isOwnerHome: '',
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
      case 'isOwnerHome':
          return !value ? 'Please specify if this is the ration card owner\'s home' : '';
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
          case 'job':
            return !value ? 'Please select your occupation' : '';
          case 'address':
            return !value ? 'Address is required' : '';
          case 'confirmPassword':
            return value !== formData.password ? 'Passwords do not match' : '';  
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
      'email',
      'dateOfBirth',
      'gender',
      'job',
      'address',
      'houseDetails',
      'selfGovType',
      'localBody',
      'district',
      'mobileNo',
      'aadhaarNo',
      'rationId',
      'username',
      'password',
      'confirmPassword',
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
  const JOB_OPTIONS = [
    'Doctor',
    'Engineer',
    'Teacher',
    'Lawyer',
    'Software Developer',
    'Accountant',
    'Nurse',
    'Business Owner',
    'Electrician',
    'Plumber',
    'Mechanic',
    'Driver',
    'Farmer',
    'Artist',
    'Chef',
    'Scientist',
    'Police Officer',
    'Soldier',
    'Photographer',
    'Student',
    'Unemployed',
  ];
  
  const isStepValid = () => {
    if (currentStep === 1) {
      return (
        formData.name &&
        formData.email &&
        formData.dateOfBirth &&
        formData.gender &&
        formData.job &&
        formData.address &&
        formData.houseDetails &&
        formData.district &&
        formData.mobileNo &&
        formData.aadhaarNo &&
        formData.rationId &&
        formData.selfGovType&&
        formData.localBody&&
        !errors.name &&
        !errors.email &&
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
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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


          <View style={styles.inputGroup}>
              <Text style={styles.label}>Occupation</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.job}
                  onValueChange={value => handleInputChange('job', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Occupation" value="" />
                  {JOB_OPTIONS.map(job => (
                    <Picker.Item key={job} label={job} value={job} />
                  ))}
                </Picker>
              </View>
              {errors.job && <Text style={styles.errorText}>{errors.job}</Text>}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your full address"
                value={formData.address}
                onChangeText={value => handleInputChange('address', value)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#666"
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
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

            {formData.district === 'Palakkad' && (
    <>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.selfGovType}
          onValueChange={value => {
            handleInputChange('selfGovType', value);
            handleInputChange('localBody', ''); // Reset local body when gov type changes
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Self Government Type" value="" />
          {SELF_GOVERNMENT_TYPES.map(type => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>

      {formData.selfGovType && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.localBody}
            onValueChange={value => handleInputChange('localBody', value)}
            style={styles.picker}
          >
            <Picker.Item label="Select Local Body" value="" />
            {PALAKKAD_LOCAL_BODIES[formData.selfGovType]?.map(body => (
              <Picker.Item key={body} label={body} value={body} />
            ))}
          </Picker>
        </View>
      )}
    </>
  )}
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

              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={formData.confirmPassword}
                secureTextEntry
                onChangeText={value => handleInputChange('confirmPassword', value)}
                placeholderTextColor="#666"
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>


          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photo Upload</Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>

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


export default SignUpForm;