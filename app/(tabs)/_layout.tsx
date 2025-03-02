import { View, Text } from 'react-native';
import React from 'react';
import { Foundation, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importing your screens
import Home from "@/app/(tabs)/home";
import Profile from "@/app/(tabs)/profile";
import Map from "@/app/(tabs)/map";
import Survey from "@/app/(tabs)/survey";

const Tab = createBottomTabNavigator();

// Tab configuration for each screen
const tabConfig = [
  {
    name: "Map",
    component: Map,
    focusedIcon: 'home-map-marker',
    unfocusedIcon: 'home-map-marker',
    iconComponent: MaterialCommunityIcons
  },
  {
    name: "home",
    component: Home,
    focusedIcon: 'home',
    unfocusedIcon: 'home',
    iconComponent: Foundation
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

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        // Find the config for the current route
        const routeConfig = tabConfig.find(config => config.name === route.name);
        const IconComponent = routeConfig ? routeConfig.iconComponent : MaterialCommunityIcons;

        return {
          tabBarIcon: ({ focused }) => {
            const icon = focused ? routeConfig?.focusedIcon : routeConfig?.unfocusedIcon;
            
            return (
              <View style={{
                height: 60,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 10,
              }}>
                {/* Active tab with elevated icon in blue circle */}
                {focused ? (
                  <View style={{
                    alignItems: 'center',
                    width: '100%',
                  }}>
                    <View style={{
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
                      bottom: 20, // Position it higher than inactive icons
                    }}>
                      <IconComponent name={icon as any} size={22} color="white" />
                    </View>
                  </View>
                ) : (
                  // Inactive tab - just show icon at standard position
                  <View style={{
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <IconComponent name={icon as any} size={24} color="#555" />
                  </View>
                )}
              </View>
            );
          },
          tabBarLabel: ({ focused }) => {
            const label = route.name.charAt(0).toUpperCase() + route.name.slice(1);
            return (
              <Text style={{
                color: focused ? '#00538C' : '#777',
                fontSize: 12,
                fontWeight: focused ? '600' : '500',
                marginBottom: 10,
              }}>
                {label}
              </Text>
            );
          },
          tabBarStyle: {
            backgroundColor: '#f5f5f5',
            height: 60,
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            position: 'absolute', // Makes tab bar float
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarItemStyle: {
            paddingTop: 0,
          },
        };
      }}
    >
      {/* Mapping Tab Screens */}
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ 
            headerShown: false
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabLayout;