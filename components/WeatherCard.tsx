import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { WeatherContext } from '@/app/(tabs)/_layout'; // Adjust path as neededa

// Define TypeScript interface for weather data
interface WeatherData {
  temperature: number;
  humidity: number;
  windspeed: number;
  weatherCode?: number;
  precipitation?: number;
  uvIndex: number;
  rainProbability?: number;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
}

// Weather code mapping for icons
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: 'weather-sunny' },
  1: { description: 'Mainly clear', icon: 'weather-partly-cloudy' },
  2: { description: 'Partly cloudy', icon: 'weather-partly-cloudy' },
  3: { description: 'Overcast', icon: 'weather-cloudy' },
  45: { description: 'Foggy', icon: 'weather-fog' },
  51: { description: 'Light drizzle', icon: 'weather-rainy' },
  61: { description: 'Light rain', icon: 'weather-pouring' },
  63: { description: 'Moderate rain', icon: 'weather-pouring' },
  65: { description: 'Heavy rain', icon: 'weather-pouring' },
  80: { description: 'Rain showers', icon: 'weather-partly-rainy' },
  95: { description: 'Thunderstorm', icon: 'weather-lightning-rainy' },
};

// Weather thresholds
const THRESHOLDS = {
  temperature: { 
    extreme_high: 38,
    high: 35,
    low: 20,
    extreme_low: 16
  },
  humidity: { 
    high: 85,
    very_high: 90
  },
  windSpeed: { 
    high: 30,
    storm: 50
  },
  uv_index: {
    moderate: 5,
    high: 7,
    very_high: 10
  }
};

const WeatherCard = () => {
  const navigation = useNavigation();
  const weatherContext = useContext(WeatherContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertShown, setAlertShown] = useState(false);
  
  // Add a fallback in case context is undefined
  const { weatherData, setWeatherData } = weatherContext || {};

  // Utility function to check for weather alerts
  const checkAndShowAlerts = (data: WeatherData) => {
    if (alertShown) return;
    const alerts = [];
    const { temperature, humidity, windspeed, uvIndex } = data;

    if (temperature > THRESHOLDS.temperature.extreme_high) {
      alerts.push('🌡️ Extreme heat alert! Stay hydrated and avoid outdoor activities.');
    } else if (temperature < THRESHOLDS.temperature.extreme_low) {
      alerts.push('🥶 Extremely cold conditions. Wear warm clothing.');
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
      Alert.alert(
        'Weather Alerts', 
        alerts.join('\n\n'), 
        [{ 
          text: 'OK', 
          onPress: () => {
            setAlertShown(true);
            console.log('Alerts acknowledged');
          }
        }]
      );
    }
  };

  const fetchWeatherData = async () => {
    // Skip if context is not properly initialized
    if (!setWeatherData) {
      setError('Weather context not initialized');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required');
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      // Get location name
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      let locationName = 'Current Location';
      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        locationName = [
          address.city || address.subregion,
          address.region
        ].filter(Boolean).join(', ');
      }

      // Fetch weather data from API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,uv_index&daily=precipitation_probability_max&timezone=auto`
      );

      if (!response.ok) throw new Error('Weather service unavailable');

      const data = await response.json();
      
      // Process and store weather data
      const processedData: WeatherData = {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windspeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        precipitation: data.current.precipitation,
        uvIndex: data.current.uv_index,
        rainProbability: data.daily?.precipitation_probability_max[0] || 0,
        location: locationName,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      };

      // Update context with new weather data
      setWeatherData(processedData);
      
      // Check for weather alerts
      checkAndShowAlerts(processedData);
      
    } catch (error) {
      console.error('Weather data fetch error:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if context is properly set up
    if (!weatherContext) {
      setError('Weather context not available');
      setLoading(false);
      return;
    }
    
    // Fetch weather data when component mounts if it's not already available
    if (!weatherData) {
      fetchWeatherData();
    } else {
      // If weather data exists, check for alerts
      checkAndShowAlerts(weatherData);
      setLoading(false);
    }

    // Reset alert shown status periodically
    const alertResetTimer = setTimeout(() => {
      setAlertShown(false);
    }, 3600000); // Reset every hour

    return () => clearTimeout(alertResetTimer);
  }, [weatherData, weatherContext]);

  const handlePress = () => {
    navigation.navigate('Weather');
  };

  // Helper function to get weather icon
  const getWeatherIcon = (code) => {
    return WEATHER_CODES[code]?.icon || 'weather-partly-cloudy';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2C3E50" />
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : weatherData ? (
        <View style={styles.cardContent}>
          <View style={styles.mainInfo}>
            <View style={styles.leftSection}>
              <Text style={styles.temperature}>{Math.round(weatherData.temperature)}°</Text>
              <Text style={styles.location}>{weatherData.location}</Text>
            </View>
            
            <View style={styles.rightSection}>
              <MaterialCommunityIcons 
                name={getWeatherIcon(weatherData.weatherCode)}
                size={38} 
                color="#2C3E50" 
              />
              <Text style={styles.weatherCondition}>
                {WEATHER_CODES[weatherData.weatherCode]?.description || 'Unknown'}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="water-percent" size={16} color="#546E7A" />
              <Text style={styles.detailText}>{Math.round(weatherData.humidity)}%</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-windy" size={16} color="#546E7A" />
              <Text style={styles.detailText}>{Math.round(weatherData.windspeed)} km/h</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-rainy" size={16} color="#546E7A" />
              <Text style={styles.detailText}>{Math.round(weatherData.rainProbability)}%</Text>
            </View>
          </View>
          
          {weatherData.uvIndex > THRESHOLDS.uv_index.moderate && (
            <View style={[
              styles.alertBanner, 
              weatherData.uvIndex > THRESHOLDS.uv_index.high 
                ? styles.highAlert 
                : styles.moderateAlert
            ]}>
              <MaterialCommunityIcons 
                name="alert-circle-outline" 
                size={14} 
                color={weatherData.uvIndex > THRESHOLDS.uv_index.high ? "#D32F2F" : "#F57C00"} 
              />
              <Text style={[
                styles.alertText,
                weatherData.uvIndex > THRESHOLDS.uv_index.high 
                  ? styles.highAlertText 
                  : styles.moderateAlertText
              ]}>
                {weatherData.uvIndex > THRESHOLDS.uv_index.high ? 'High' : 'Moderate'} UV Index
              </Text>
            </View>
          )}
        </View>
      ) : (
        <Text style={styles.fallbackText}>Weather data unavailable</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    color: '#546E7A',
    marginTop: 10,
    fontWeight: '500',
    fontSize: 14,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  cardContent: {
    padding: 20,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2C3E50',
    letterSpacing: -1,
  },
  location: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 4,
    fontWeight: '500',
  },
  weatherCondition: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 6,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '500',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
    justifyContent: 'center',
  },
  moderateAlert: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
  },
  highAlert: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  alertText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moderateAlertText: {
    color: '#F57C00',
  },
  highAlertText: {
    color: '#D32F2F',
  },
  fallbackText: {
    padding: 24,
    textAlign: 'center',
    color: '#546E7A',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default WeatherCard;