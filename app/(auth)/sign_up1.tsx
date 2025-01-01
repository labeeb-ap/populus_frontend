import React from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const SignUp1 = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Date of Birth" />
      <TextInput style={styles.input} placeholder="Gender" />
      <TextInput style={styles.input} placeholder="Keralite / Non Keralite" />
      <TextInput style={styles.input} placeholder="House No/Name" />
      <TextInput style={styles.input} placeholder="Place" />
      <TextInput style={styles.input} placeholder="Locality" />
      <TextInput style={styles.input} placeholder="District" />
      <TextInput style={styles.input} placeholder="Mobile No" />
      <TextInput style={styles.input} placeholder="Aadhaar No" />
      <View style={styles.buttonContainer}>
        <Button
          title="Next"
          onPress={() => router.push('/sign_up2')}
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

export default SignUp1;
