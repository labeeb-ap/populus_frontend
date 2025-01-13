import { View, Text } from 'react-native'
import React from 'react'
import { Slot , Stack } from 'expo-router'

const AuthLayout = () => {
  return (
     <Stack>
          <Stack.Screen name="sign_in" options={{headerShown: false}} />
          <Stack.Screen name="success" options={{headerShown: true, headerTitle: 'Sign Up'}} />
      </Stack>
  )
}

export default AuthLayout