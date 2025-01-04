// MapScreen.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number | null;
  longitude: number | null;
}

interface MapScreenProps {
  onLocationSelect: (coords: string) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ onLocationSelect }) => {
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

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    marginBottom: 16,
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

export default MapScreen;