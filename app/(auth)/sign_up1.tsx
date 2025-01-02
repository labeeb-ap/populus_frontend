import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp1 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    keraliteStatus: '',
    houseNumber: '',
    place: '',
    locality: '',
    district: '',
    mobileNumber: '',
    aadhaarNumber: '',
  });

  // Explicitly typing the input change handler
  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/resident_signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Resident information saved successfully.');
        router.push('/sign_up2');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Something went wrong.');
      }
    } catch (error) {
      // Ensure error is treated as an object with a message property
      if (error instanceof Error) {
        console.error('Fetch error:', error.message); // Log error message
        Alert.alert('Error', error.message || 'Network error.');
      } else {
        console.error('Unknown error:', error); // Handle unexpected error shapes
        Alert.alert('Error', 'An unknown error occurred.');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChangeText={(text) => handleInputChange('dateOfBirth', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(text) => handleInputChange('gender', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Keralite / Non Keralite"
        value={formData.keraliteStatus}
        onChangeText={(text) => handleInputChange('keraliteStatus', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="House No/Name"
        value={formData.houseNumber}
        onChangeText={(text) => handleInputChange('houseNumber', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Place"
        value={formData.place}
        onChangeText={(text) => handleInputChange('place', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Locality"
        value={formData.locality}
        onChangeText={(text) => handleInputChange('locality', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        value={formData.district}
        onChangeText={(text) => handleInputChange('district', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile No"
        value={formData.mobileNumber}
        onChangeText={(text) => handleInputChange('mobileNumber', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Aadhaar No"
        value={formData.aadhaarNumber}
        onChangeText={(text) => handleInputChange('aadhaarNumber', text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={handleSubmit} color="#003366" />
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
  buttonContainer: {
    marginVertical: 16,
  },
});

export default SignUp1;
