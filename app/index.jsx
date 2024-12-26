import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import home from "@/app/(resident)/home.jsx";
import message from "@/app/(resident)/message.jsx";
import map from "@/app/(resident)/map.jsx";
import survey from "@/app/(resident)/survey.jsx";
import { Foundation, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

const App = () => {
  const tabConfig=[
    {
      name: "Map",
      component: map,
      focusedIcon: 'home-map-marker',
      unfocusedIcon: 'home-map-marker',
      iconComponent: MaterialCommunityIcons
    },
    {
      name: "Home",
      component: home,
      focusedIcon: 'home',
      unfocusedIcon: 'home',
      iconComponent: Foundation
    },
    {
      name: "Survey",
      component: survey,
      focusedIcon: 'google-analytics',
      unfocusedIcon: 'google-analytics',
      iconComponent: MaterialCommunityIcons
    },
    {
      name: "Message",
      component: message,
      focusedIcon: 'message-text',
      unfocusedIcon: 'message-text',
      iconComponent: MaterialCommunityIcons
    },
  ]
const screenOptions=({route})=>({
  tabBarIcon:({focused,color,size})=>{
    const routeConfig = tabConfig.find(config => config.name == route.name);
    const iconName = focused
    ? routeConfig.focusedIcon
    : routeConfig.unfocusedIcon;
    const IconComponent =  routeConfig.iconComponent;

    return <IconComponent name={iconName} size={size} color={color}/>
  },
  
    tabBarActiveTintColor: 	'#4682B4',
    tabBarInactiveTintColor:'black',
    tabBarLabelStyle: {
      fontSize: 14,
      paddingBottom: 5,
      fontWeight: "600",
    },
    tabBarStyle: {
      height : 60,
      backgroundColor: '#f8f8f8',
      paddingTop: 0,
    },
    
});

  return (
    
      <Tab.Navigator
        screenOptions={screenOptions}>
        <Tab.Screen name="Map" component={map} options={{headerTitleAlign:"center"}} />
        <Tab.Screen name="Home" component={home} options={{headerTitleAlign:"center"}}/>
        <Tab.Screen name="Survey" component={survey} options={{headerTitleAlign:"center"}} />
        <Tab.Screen name="Message" component={message} options={{headerTitleAlign:"center"}}/>
      </Tab.Navigator>
 
  );
};

export default App;

const styles = StyleSheet.create({
  // Your styles here
});
