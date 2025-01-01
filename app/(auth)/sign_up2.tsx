import React from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp2 = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Ration ID" />
      <TextInput style={styles.input} placeholder="Upload photo" />
      <TextInput style={styles.input} placeholder="Map your house" />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up"
          onPress={() => router.push('/success')}
          color="#003366"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    marginVertical: 16,
  },
});

export default SignUp2;
