import { Stack } from 'expo-router';  // Import Stack from expo-router

export default function ResidentLayout() {
  return (
    <Stack>
    
      <Stack.Screen
        name="home"  // This matches the home.jsx file
        options={{ title: "Home", headerShown: false }}
      />

      <Stack.Screen
        name="map"  // This matches the map.jsx file
        options={{ title: "Map", headerShown: false }}
      />

      <Stack.Screen
        name="survey"  // This matches the survey.jsx file
        options={{ title: "Survey", headerShown: false }}
      />

      <Stack.Screen
        name="message"  // This matches the message.jsx file
        options={{ title: "Messages", headerShown: false }}
      />
    </Stack>
  );
}
