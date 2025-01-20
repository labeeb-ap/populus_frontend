import React from 'react';
import { Stack } from 'expo-router'


export default function serviceLayout() {
  return (
    <Stack>
              <Stack.Screen name="message" options={{headerShown: false}} />
              <Stack.Screen name="notification" options={{headerShown: false}} />
    </Stack>
  );
}
                