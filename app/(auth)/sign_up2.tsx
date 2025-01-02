import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface LocationCoords {
  latitude: number | null;
  longitude: number | null;
}

const MapScreen = ({ onLocationSelect }: { onLocationSelect: (coords: string) => void }) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationCoords | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 10.9034047,
    longitude: 76.4346481,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const newLocation = {
      ...currentLocation,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(newLocation);
    setSelectedLocation(newLocation);
    onLocationSelect(`Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedLocation(coords);
    onLocationSelect(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        onPress={handleMapPress}
        mapType="hybrid"
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude!,
              longitude: selectedLocation.longitude!
            }}
            title="Selected Location"
            description={`${selectedLocation.latitude}, ${selectedLocation.longitude}`}
          />
        )}
      </MapView>
      <TouchableOpacity 
        style={styles.button}
        onPress={getCurrentLocation}
      >
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUp2 = ({ 
  mappedHouse, 
  setMappedHouse 
}: { 
  mappedHouse: string; 
  setMappedHouse: React.Dispatch<React.SetStateAction<string>> 
}) => {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    if (location) {
      setMappedHouse(`Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`);
    }
  };

  const handleLocationSelect = (location: string) => {
    setMappedHouse(location);
    setShowMap(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Ration ID" />
      <TextInput style={styles.input} placeholder="Upload photo" />
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
        <Button title="Sign Up" onPress={() => router.push('/success')} color="#003366" />
      </View>
    </ScrollView>
  );
};

export default function App() {
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

  return <SignUp2 mappedHouse={mappedHouse} setMappedHouse={setMappedHouse} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: 300,
    marginBottom: 16,
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
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});