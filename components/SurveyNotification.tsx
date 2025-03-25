import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSurvey } from '@/app/context/SurveyContext';

const SurveyNotification = () => {
  const { showNotification } = useSurvey();
  const slideAnim = new Animated.Value(-100); // Start above the screen

  useEffect(() => {
    if (showNotification) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showNotification]);

  if (!showNotification) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <MaterialIcons name="notifications" size={24} color="white" />
      <Text style={styles.text}>New survey available!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007BFF',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SurveyNotification;