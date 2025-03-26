import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, TextInput, TouchableOpacity, ActivityIndicator, Linking, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { WeatherContext } from '@/app/(tabs)/_layout';
// Enhanced Kerala districts with regional characteristics
const KERALA_DISTRICTS = [
  { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, elevation: 3, region: 'Coastal' },
  { name: 'Kollam', lat: 8.8932, lon: 76.6141, elevation: 3, region: 'Coastal' },
  { name: 'Pathanamthitta', lat: 9.2648, lon: 76.7870, elevation: 18, region: 'Midland' },
  { name: 'Alappuzha', lat: 9.4981, lon: 76.3388, elevation: 1, region: 'Coastal' },
  { name: 'Kottayam', lat: 9.5916, lon: 76.5222, elevation: 3, region: 'Midland' },
  { name: 'Idukki', lat: 9.9189, lon: 77.1025, elevation: 1197, region: 'Highland' },
  { name: 'Ernakulam', lat: 9.9816, lon: 76.2999, elevation: 4, region: 'Coastal' },
  { name: 'Thrissur', lat: 10.5276, lon: 76.2144, elevation: 2.83, region: 'Midland' },
  { name: 'Palakkad', lat: 10.7867, lon: 76.6548, elevation: 84, region: 'Highland' },
  { name: 'Malappuram', lat: 11.0510, lon: 76.0711, elevation: 40, region: 'Coastal' },
  { name: 'Kozhikode', lat: 11.2588, lon: 75.7804, elevation: 1, region: 'Coastal' },
  { name: 'Wayanad', lat: 11.6854, lon: 76.1320, elevation: 780, region: 'Highland' },
  { name: 'Kannur', lat: 11.8745, lon: 75.3704, elevation: 2, region: 'Coastal' },
  { name: 'Kasaragod', lat: 12.4996, lon: 74.9869, elevation: 19, region: 'Coastal' }
];

// Enhanced weather thresholds specific to Kerala's climate
const THRESHOLDS = {
  temperature: { 
    extreme_high: 38, // Common in Palakkad
    high: 35,
    low: 20,
    extreme_low: 16 // Common in Munnar
  },
  humidity: { 
    high: 85,
    very_high: 90 // Common during monsoon
  },
  windSpeed: { 
    high: 30,
    storm: 50 // During cyclones/monsoons
  },
  rainfall: {
    light: 2.5,
    moderate: 7.5,
    heavy: 15,
    very_heavy: 30
  },
  uv_index: {
    moderate: 5,
    high: 7,
    very_high: 10
  }
};

//Enhanced weather codes with Kerala-specific conditions
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️', keralaNote: 'Typical summer day' },
  1: { description: 'Mainly clear', icon: '🌤️', keralaNote: 'Pleasant weather' },
  2: { description: 'Partly cloudy', icon: '⛅', keralaNote: 'Common in highlands' },
  3: { description: 'Overcast', icon: '☁️', keralaNote: 'Pre-monsoon condition' },
  45: { description: 'Foggy', icon: '🌫️', keralaNote: 'Common in hill stations' },
  51: { description: 'Light drizzle', icon: '🌦️', keralaNote: 'Pre-monsoon showers' },
  61: { description: 'Light rain', icon: '🌧️', keralaNote: 'Common during monsoon' },
  63: { description: 'Moderate rain', icon: '🌧️', keralaNote: 'Active monsoon' },
  65: { description: 'Heavy rain', icon: '⛈️', keralaNote: 'Strong monsoon' },
  80: { description: 'Rain showers', icon: '🌦️', keralaNote: 'Local thundershowers' },
  95: { description: 'Thunderstorm', icon: '⛈️', keralaNote: 'Summer thunderstorm' },
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  // const { weatherData, setWeatherData } = useContext(WeatherContext);


  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationName, setLocationName] = useState('');


  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim().length > 0) {
      const filtered = KERALA_DISTRICTS.filter(district =>
        district.name.toLowerCase().includes(text.toLowerCase()) ||
        district.region.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectDistrict = (district) => {
    setSearchQuery(district.name);
    setSuggestions([]);
    fetchWeatherData(district.lat, district.lon, district.name);
  };

  const checkLocationServices = async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to get weather updates for your current location.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings',
              onPress: () => Linking.openSettings()
            }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') return true;

      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      return newStatus === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      const servicesEnabled = await checkLocationServices();
      if (!servicesEnabled) return;

      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        setErrorMessage('Location permission is required for current weather.');
        return;
      }

      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Changed to high accuracy
      });

      setLocation(location.coords);
      
      // Get location name using reverse geocoding
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const locationString = [
            address.street,
            address.district,
            address.subregion,
            address.city,
            address.region
          ].filter(Boolean).join(', ');
          setLocationName(locationString);
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        setLocationName('Current Location');
      }

      await fetchWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      setErrorMessage('Unable to fetch current location. Please try searching for a location instead.');
      console.error('Get current location error:', error);
    }
  };

  const fetchWeatherData = async (lat, lon, districtName) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,cloud_cover,pressure_msl,uv_index&daily=precipitation_probability_max&timezone=Asia/Kolkata`
      );

      if (!response.ok) throw new Error('Weather service unavailable');

      const data = await response.json();
      if (!data.current) throw new Error('No weather data available');

      // Process the weather data
      const processedData = {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windspeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        precipitation: data.current.precipitation,
        cloudCover: data.current.cloud_cover,
        pressure: data.current.pressure_msl,
        uvIndex: data.current.uv_index,
        rainProbability: data.daily?.precipitation_probability_max[0] || 0,
        location: districtName || locationName || 'Current Location',
        coordinates: {
          latitude: lat,
          longitude: lon
        }
      };

      // Update both local state and shared context
      setWeatherData(processedData);
      checkAndShowAlerts(processedData);
    } catch (error) {
      setErrorMessage('Failed to fetch weather data. Please try again later.');
      console.error('Weather data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };


  const checkAndShowAlerts = (data) => {
    const alerts = [];
    const { temperature, humidity, windspeed, uvIndex } = data;

    if (temperature > THRESHOLDS.temperature.extreme_high) {
      alerts.push('🌡️ Extreme heat alert! Stay hydrated and avoid outdoor activities.');
    }

    if (humidity > THRESHOLDS.humidity.very_high) {
      alerts.push('💧 Very high humidity! Take necessary precautions.');
    }

    if (windspeed > THRESHOLDS.windSpeed.storm) {
      alerts.push('💨 Strong winds detected. Please be cautious outdoors.');
    }

    if (uvIndex > THRESHOLDS.uv_index.high) {
      alerts.push('☀️ High UV index! Use sun protection.');
    }

    if (alerts.length > 0) {
      Alert.alert('Weather Alerts', alerts.join('\n\n'));
    }
  };


  // Use effect to load data initially
  useEffect(() => {
    // If we already have weather data in context, use that
    if (weatherData) {
      setLoading(false);
      // Optionally, you might still want to refresh the data
      // fetchWeatherData(weatherData.coordinates.latitude, weatherData.coordinates.longitude);
    } else {
      // Otherwise, get current location and fetch data
      getCurrentLocation();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Keep the existing UI components but modify the weather display */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Kerala districts..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={getCurrentLocation}
        >
          <Text style={styles.buttonText}>📍</Text>
        </TouchableOpacity>
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((district) => (
            <TouchableOpacity
              key={district.name}
              style={styles.suggestionItem}
              onPress={() => selectDistrict(district)}
            >
              <Text style={styles.suggestionText}>
                {district.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF5733" />
          </View>
        ) : (
          weatherData && (
            <>
              <View style={styles.currentWeather}>
                <Text style={styles.location}>{weatherData.location}</Text>
                {weatherData.coordinates && (
                  <Text style={styles.coordinates}>
                    {weatherData.coordinates.latitude.toFixed(4)}°N, {weatherData.coordinates.longitude.toFixed(4)}°E
                  </Text>
                )}
                <Text style={styles.temperature}>
                  {Math.round(weatherData.temperature)}°C
                </Text>
                <Text style={styles.weatherIcon}>
                  {WEATHER_CODES[weatherData.weatherCode]?.icon || '❓'}
                </Text>
                <Text style={styles.weatherCondition}>
                  {WEATHER_CODES[weatherData.weatherCode]?.description || 'Unknown'}
                </Text>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>Humidity</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.humidity)}%
                  </Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>Wind Speed</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.windspeed)} km/h
                  </Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>UV Index</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.uvIndex)}
                  </Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>Cloud Cover</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.cloudCover)}%
                  </Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>Pressure</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.pressure)} hPa
                  </Text>
                </View>
                <View style={styles.detailBox}>
                  <Text style={styles.detailTitle}>Rain Chance</Text>
                  <Text style={styles.detailValue}>
                    {Math.round(weatherData.rainProbability)}%
                  </Text>
                </View>
              </View>
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};


// Previous code remains the same until the styles object...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: '#4299E1',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
  },
  buttonText: {
    fontSize: 20,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#2D3748',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FED7D7',
    borderRadius: 12,
    marginBottom: 10,
  },
  errorText: {
    color: '#C53030',
    textAlign: 'center',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  currentWeather: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  location: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
    textAlign: 'center',
  },
  regionText: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#4299E1',
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 72,
    marginVertical: 8,
  },
  weatherCondition: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  keralaNote: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
    paddingBottom: 20,
  },
  detailBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  }
});

export default Weather;

function checkAndShowAlerts(processedData: { temperature: any; humidity: any; windspeed: any; weatherCode: any; precipitation: any; cloudCover: any; pressure: any; uvIndex: any; rainProbability: any; location: any; coordinates: { latitude: any; longitude: any; }; }) {
  throw new Error('Function not implemented.');
}
