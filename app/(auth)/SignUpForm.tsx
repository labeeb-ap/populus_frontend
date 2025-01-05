// SignUpForm.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import MapScreen from './MapScreen';

interface FormData {
  name: string;
  dateOfBirth: string;
  gender: string;
  isKeralite: string;
  houseDetails: string;
  place: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  photo: string;
  mappedHouse: string;
}

interface SignUpFormProps {
  mappedHouse: string;
  setMappedHouse: React.Dispatch<React.SetStateAction<string>>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ mappedHouse, setMappedHouse }) => {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: '',
    gender: '',
    isKeralite: '',
    houseDetails: '',
    place: '',
    locality: '',
    district: '',
    mobileNo: '',
    aadhaarNo: '',
    rationId: '',
    photo: '',
    mappedHouse: mappedHouse
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      mappedHouse
    }));
  }, [mappedHouse]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.198.138:4000/user/resident_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      Alert.alert('Success', 'Form submitted successfully!');
      router.push('/success');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form. Please try again.');
      console.error('Submission error:', error);
    }
  };

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      const locationString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
      setMappedHouse(locationString);
      setFormData(prev => ({
        ...prev,
        mappedHouse: locationString
      }));
    }
  };

  const handleLocationSelect = (location: string) => {
    setMappedHouse(location);
    setFormData(prev => ({
      ...prev,
      mappedHouse: location
    }));
    setShowMap(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChangeText={(value) => handleInputChange('dateOfBirth', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(value) => handleInputChange('gender', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Keralite / Non Keralite"
        value={formData.isKeralite}
        onChangeText={(value) => handleInputChange('isKeralite', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="House No/Name"
        value={formData.houseDetails}
        onChangeText={(value) => handleInputChange('houseDetails', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Place"
        value={formData.place}
        onChangeText={(value) => handleInputChange('place', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Locality"
        value={formData.locality}
        onChangeText={(value) => handleInputChange('locality', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="District"
        value={formData.district}
        onChangeText={(value) => handleInputChange('district', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Mobile No"
        value={formData.mobileNo}
        onChangeText={(value) => handleInputChange('mobileNo', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Aadhaar No"
        value={formData.aadhaarNo}
        onChangeText={(value) => handleInputChange('aadhaarNo', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Ration ID"
        value={formData.rationId}
        onChangeText={(value) => handleInputChange('rationId', value)}
      />
      <TextInput 
        style={styles.input} 
        placeholder="Upload photo"
        value={formData.photo}
        onChangeText={(value) => handleInputChange('photo', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Map your house"
        value={mappedHouse}
        editable={false}
      />
      
      {showMap ? (
        <MapScreen onLocationSelect={handleLocationSelect} />
      ) : (
        <View style={styles.buttonRow}>
          <View style={styles.smallButtonContainer}>
            <Button title="Current Location" onPress={handleGetCurrentLocation} color="#003366" />
          </View>
          <View style={styles.smallButtonContainer}>
            <Button title="Choose Location" onPress={() => setShowMap(true)} color="#003366" />
          </View>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSubmit} color="#003366" />
      </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  smallButtonContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginVertical: 16,
  },
});

export default SignUpForm;