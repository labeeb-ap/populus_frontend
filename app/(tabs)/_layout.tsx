import { View, Text } from 'react-native';
import React from 'react';
import { Foundation, MaterialCommunityIcons,FontAwesome6 } from '@expo/vector-icons';
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
        const iconName = routeConfig ? (routeConfig.focusedIcon) : '';
        const IconComponent = routeConfig ? routeConfig.iconComponent : MaterialCommunityIcons;

        return {
          tabBarIcon: ({ focused, color, size }) => {
            const icon = focused ? iconName : routeConfig?.unfocusedIcon;
            return <IconComponent name={icon as any} size={size} color={color} />;
          },
          tabBarStyle:{
            backgroundColor:'#ecebec'
          }
        };
      }}
    >
      {/* Mapping Tab Screens */}
      {tabConfig.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ headerShown:false }}
        />
      ))}
    </Tab.Navigator>
    
  );
};

export default TabLayout;
