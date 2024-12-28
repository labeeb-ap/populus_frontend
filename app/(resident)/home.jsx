// import { View, Text } from 'react-native';

// export default function HomeScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:'white'}}>
//       <Text>Home Screen</Text>
   
//     </View>
//   );
// }

import * as React from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';


function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('Notifications')}>
        Go to notifications
      </Button>
    </View>
  );
}

function SettingScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()}>Go back home</Button>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (

      <Drawer.Navigator initialRouteName="Profile">
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingScreen} />
      </Drawer.Navigator>

  );
}


// import React from 'react';
// import { Button, Text, View } from 'react-native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { NavigationContainer } from '@react-navigation/native';

// const Stack = createStackNavigator();

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

// function DetailsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       <Text>Details Screen</Text>
//       <Button
//         title="Go Back"
//         onPress={() => navigation.goBack()}
//       />
//     </View>
//   );
// }

// export default function App() {
//   return (
 
//       <Stack.Navigator>
//         <Stack.Screen name="HomeScreen" component={HomeScreen} />
//         <Stack.Screen
//           name="Details"
//           component={DetailsScreen}
//           options={{
//             title: 'Details Page',
//             headerStyle: {
//               backgroundColor: '#03dac6',
//             },
//           }}
//         />
//       </Stack.Navigator>
    
//   );
// }
