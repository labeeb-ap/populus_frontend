import { Alert, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { API_URL } from '@/constants/constants';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Map: undefined;
  HouseDetails: {
    houseDetails: string;
    wardNumber: string;
    rationId: string;
  };
};

interface LocationData {
  houseDetails: string;
  rationId: string;
  wardNumber: string;
  mappedHouse: string;
}

interface FormattedLocation {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  houseDetails: string;
  wardNumber: string;
  rationId: string;
}

// Color palette for ward numbers (15 distinct colors)
const WARD_COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
  '#00FFFF', '#FFA500', '#A52A2A', '#800080', '#008000',
  '#000080', '#808000', '#800000', '#008080', '#000000'
];

function Map() {
  const [locations, setLocations] = useState<FormattedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert("User token not found. Please log in again.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/user/map`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const dataArray = Array.isArray(responseData) ? responseData : responseData.data;

        if (!Array.isArray(dataArray)) {
          throw new Error('Invalid data format received');
        }

        const formattedLocations: FormattedLocation[] = dataArray
          .filter((item: LocationData) => item?.mappedHouse && item.mappedHouse.includes('Latitude'))
          .map((item: LocationData, index: number) => {
            try {
              const latMatch = item.mappedHouse.match(/Latitude:\s*([-\d.]+)/);
              const longMatch = item.mappedHouse.match(/Longitude:\s*([-\d.]+)/);

              if (!latMatch || !longMatch) {
                throw new Error(`Invalid coordinate format for item ${index}`);
              }

              const latitude = parseFloat(latMatch[1]);
              const longitude = parseFloat(longMatch[1]);

              if (isNaN(latitude) || isNaN(longitude)) {
                throw new Error(`Invalid coordinates for item ${index}`);
              }

              return {
                id: `${index}_${item.houseDetails}`,
                coordinate: { latitude, longitude },
                houseDetails: item.houseDetails || 'No details',
                wardNumber: item.wardNumber || '0',
                rationId: item.rationId || 'Not available'
              };
            } catch (err) {
              console.error(`Error processing item ${index}:`, err);
              return null;
            }
          })
          .filter(Boolean) as FormattedLocation[];

        setLocations(formattedLocations);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        Alert.alert('Error', 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialRegion = {
    latitude: 10.9063822,
    longitude: 76.4362431,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const handleMarkerPress = (houseDetails: string, wardNumber: string, rationId: string) => {
    navigation.navigate('HouseDetails', { 
      houseDetails, 
      wardNumber, 
      rationId 
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="hybrid"
      >
        {locations.map((marker) => {
          const wardIndex = parseInt(marker.wardNumber) - 1;
          const wardColor = WARD_COLORS[wardIndex >= 0 && wardIndex < WARD_COLORS.length ? wardIndex : 0];
          
          return (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
             
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require('@/assets/images/custom-marker.png')}
                  style={styles.markerIcon}
                />
                <View style={[styles.markerNumberContainer, { backgroundColor: wardColor }]}>
                  <Text style={styles.markerNumberText}>
                    {marker.houseDetails}
                  </Text>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  markerNumberContainer: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  markerNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

export default Map;