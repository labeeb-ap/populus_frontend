import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:'white'}}>
      <Text>Home Screen</Text>
    </View>
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
