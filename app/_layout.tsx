import { Stack } from 'expo-router';
import React from 'react';
import SurveyProvider from './context/SurveyContext';
import SurveyNotification from '@/components/SurveyNotification';

const RootLayout = () => {
  return (
    <SurveyProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(service)" options={{ headerShown: false }} />
      </Stack>
      <SurveyNotification />
    </SurveyProvider>
  );
};

export default RootLayout;