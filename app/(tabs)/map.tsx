import { Alert, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { API_URL } from '@/constants/constants';


interface LocationData {
  _id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  houseDetails: string;
  place: string;
  locality: string;
  district: string;
  mobileNo: string;
  aadhaarNo: string;
  rationId: string;
  photo: string;
  mappedHouse: string;
  verified: boolean;
  __v: number;
  username?: string;
  password?: string;
}

interface FormattedLocation {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  houseDetails: string;
}

function Map() {
  const [locations, setLocations] = useState<FormattedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/user/map`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          .filter((item: LocationData) => item?.mappedHouse)
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
                id: item._id,
                coordinate: {
                  latitude,
                  longitude,
                },
                title: `House ${index + 1}`,
                description: `${item.name}'s House`,
                houseDetails: item.houseDetails || 'No house details available',
              };
            } catch (err) {
              console.error(`Error processing item ${index}:`, err);
              return null;
            }
          })
          .filter((location): location is FormattedLocation => location !== null);

        setLocations(formattedLocations);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        Alert.alert('Error', 'Something went wrong while fetching data');
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

  if (loading) {
    return (
      <View >
        <Text>Loading map data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View >
        <Text>Error: {error}</Text>
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
        {locations.map((marker: FormattedLocation) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            anchor={{ x: 2, y: 2 }} // Adjust the anchor point for positioning
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('@/assets/images/custom-marker.png')}
                style={{ width: 10, height: 10, resizeMode: 'contain' }} // Resize the image here
              />
              <View style={styles.markerTextContainer}>
                <Text style={styles.markerText}>{marker.houseDetails}</Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  
  );
  
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0', // Neutral background to highlight the map
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    map: {
      ...StyleSheet.absoluteFillObject, // Ensures the map fills the screen
    },
    markerTextContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
      borderRadius: 8,
      padding: 4,
      borderWidth: 1,
      borderColor: '#d4d4d4', // Light border for better visibility
    },
    markerText: {
      color: 'blue', // Dark red text color
      fontSize: 15, // Slightly smaller font size for better fit
      fontWeight: 'bold', // Bold for emphasis
      textAlign: 'center', // Center align the text
    },
  });
      
      

export default Map;
