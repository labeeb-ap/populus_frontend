import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mappedHouse, setMappedHouse] = useState<string>(''); // State for "Map your house"

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Set the latitude and longitude for "Map your house"
      if (location) {
        const { latitude, longitude } = location.coords;
        setMappedHouse(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
    }

    getCurrentLocation();
  }, []);

  return <SignUp2 mappedHouse={mappedHouse} />;
}

const SignUp2 = ({ mappedHouse }: { mappedHouse: string }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    rationId: '',
    photo: '',
    mappedHouse,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/resident_signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        Alert.alert('Success', 'Registration completed successfully.');
        router.push('/success');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
        Alert.alert('Error', errorData.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ration ID"
        value={formData.rationId}
        onChangeText={(text) => handleChange('rationId', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Upload photo"
        value={formData.photo}
        onChangeText={(text) => handleChange('photo', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Map your house"
        value={formData.mappedHouse}
        editable={false} // Non-editable since it's auto-filled
      />
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
  buttonContainer: {
    marginVertical: 16,
  },
});
