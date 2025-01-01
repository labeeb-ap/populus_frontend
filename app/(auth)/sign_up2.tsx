import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Ration ID" />
      <TextInput style={styles.input} placeholder="Upload photo" />
      <TextInput
        style={styles.input}
        placeholder="Map your house"
        value={mappedHouse} // Display the latitude and longitude
        editable={false} // Make the field non-editable
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => router.push('/success')}
          color="#003366"
        />
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
