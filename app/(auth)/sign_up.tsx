// App.tsx or sign_up.tsx
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import SignUpForm from './SignUpForm';

export default function SignUp() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mappedHouse, setMappedHouse] = useState<string>('');

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        setMappedHouse(`Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
      }
    }

    getCurrentLocation();
  }, []);

  return <SignUpForm mappedHouse={mappedHouse} setMappedHouse={setMappedHouse} />;
}
