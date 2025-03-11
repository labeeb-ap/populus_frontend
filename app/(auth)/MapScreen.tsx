import React, { useState, useEffect } from 'react';
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
    latitude: 10.9034047, // Default fallback location
    longitude: 76.4346481, // Default fallback location
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Fetch the user's current location when the component mounts
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, // Use high accuracy
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };

      setCurrentLocation(newLocation);
      setSelectedLocation(newLocation);

      // Format latitude and longitude to 15 decimal places
      const formattedLatitude = location.coords.latitude.toFixed(15);
      const formattedLongitude = location.coords.longitude.toFixed(15);

      onLocationSelect(`Latitude: ${formattedLatitude}, Longitude: ${formattedLongitude}`);
    };

    fetchCurrentLocation();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedLocation(coords);

    // Format latitude and longitude to 15 decimal places
    const formattedLatitude = coords.latitude.toFixed(15);
    const formattedLongitude = coords.longitude.toFixed(15);

    onLocationSelect(`Latitude: ${formattedLatitude}, Longitude: ${formattedLongitude}`);
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation} // Set initial region to current location
        region={currentLocation} // Keep the map centered on the current location
        onPress={handleMapPress}
        mapType="hybrid"
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude!,
              longitude: selectedLocation.longitude!,
            }}
            title="Selected Location"
            description={`${selectedLocation.latitude?.toFixed(15)}, ${selectedLocation.longitude?.toFixed(15)}`}
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          setCurrentLocation(newLocation);
          setSelectedLocation(newLocation);

          // Format latitude and longitude to 15 decimal places
          const formattedLatitude = location.coords.latitude.toFixed(15);
          const formattedLongitude = location.coords.longitude.toFixed(15);

          onLocationSelect(`Latitude: ${formattedLatitude}, Longitude: ${formattedLongitude}`);
        }}
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