import { View, Text, Animated, StyleSheet } from 'react-native';
import React, { useEffect, useRef, createContext, useState } from 'react';
import { Foundation, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "@/app/(tabs)/home";
import Profile from "@/app/(tabs)/profile";
import Map from "@/app/(tabs)/map";
import Survey from "@/app/(tabs)/survey";
import { useSurvey } from '../context/SurveyContext';
import Weather from './weatherscreen';


// Define navigation types
export type RootStackParamList = {
  TabNavigator: undefined;
  Weather: undefined;
};
// Create Weather Context
export const WeatherContext = createContext(null)

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { hasPendingSurveys } = useSurvey();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // State for weather data to be shared across components
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (hasPendingSurveys) {
      // Big bouncing animation sequence
      Animated.loop(
        Animated.sequence([
          // Bounce up
          Animated.timing(bounceAnim, {
            toValue: -15,
            duration: 300,
            useNativeDriver: true,
          }),
          // Bounce down with scale
          Animated.parallel([
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
          // Return to normal
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          // Pause before repeating
          Animated.delay(1000),
        ])
      ).start();
    } else {
      // Reset animations
      bounceAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [hasPendingSurveys]);

  const AnimatedNotification = () => (
    <Animated.View style={[
      styles.bigNotification,
      {
        transform: [
          { translateY: bounceAnim },
          { scale: scaleAnim }
        ]
      }
    ]}>
      <Text style={styles.notificationText}>!</Text>
    </Animated.View>
  );

  return (
    <WeatherContext.Provider value={{ weatherData, setWeatherData }}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const routeConfig = tabConfig.find(config => config.name === route.name);
          const IconComponent = routeConfig ? routeConfig.iconComponent : MaterialCommunityIcons;

          return {
            tabBarIcon: ({ focused }) => {
              const icon = focused ? routeConfig?.focusedIcon : routeConfig?.unfocusedIcon;
              
              return (
                <View style={styles.tabIconContainer}>
                  {focused ? (
                    <View style={styles.activeTabContainer}>
                      <View style={styles.activeTabIcon}>
                        <IconComponent name={icon as any} size={22} color="white" />
                        {route.name === 'Survey' && hasPendingSurveys && (
                          <AnimatedNotification />
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.inactiveTabIcon}>
                      <IconComponent name={icon as any} size={24} color="#555" />
                      {route.name === 'Survey' && hasPendingSurveys && (
                        <AnimatedNotification />
                      )}
                    </View>
                  )}
                </View>
              );
            },
            tabBarLabel: ({ focused }) => (
              <Text style={[
                styles.tabLabel,
                focused ? styles.tabLabelActive : styles.tabLabelInactive
              ]}>
                {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            ),
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabItem,
          };
        }}
      >
        {tabConfig.map(tab => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{ headerShown: false }}
          />
        ))}
      </Tab.Navigator>
    </WeatherContext.Provider>
  );
};

export default function TabLayout() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen 
        name="Weather" 
        component={Weather}
        options={{
          headerShown: true,
          title: 'Weather Details',
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#00538C',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  tabIconContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  activeTabContainer: {
    alignItems: 'center',
    width: '100%',
  },
  activeTabIcon: {
    backgroundColor: '#00538C',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'absolute',
    bottom: 20,
  },
  inactiveTabIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
  },
  tabLabelActive: {
    color: '#00538C',
    fontWeight: '600',
  },
  tabLabelInactive: {
    color: '#777',
  },
  tabBar: {
    backgroundColor: '#f5f5f5',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    paddingTop: 0,
  },
  bigNotification: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const tabConfig = [
  {
    name: "home",
    component: Home,
    focusedIcon: 'home',
    unfocusedIcon: 'home',
    iconComponent: Foundation
  },
  {
    name: "Map",
    component: Map,
    focusedIcon: 'home-map-marker',
    unfocusedIcon: 'home-map-marker',
    iconComponent: MaterialCommunityIcons
  },
  
  {
    name: "Survey",
    component: Survey,
    focusedIcon: 'google-analytics',
    unfocusedIcon: 'google-analytics',
    iconComponent: MaterialCommunityIcons
  },
  {
    name: "profile",
    component: Profile,
    focusedIcon: 'house-user',
    unfocusedIcon: 'house-user',
    iconComponent: FontAwesome6
  }
];
