import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/constants';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
     

      const response = await fetch(`${API_URL}/user/resident_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      // const responseText = await response.text();
      // console.log('Raw Response:', responseText);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      if (data.success && data.token) {
        // Store the token here if needed
         await AsyncStorage.setItem('userToken', data.token);
        
        router.replace('/home');
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error: unknown) {
      const err = error as Error;
      Alert.alert(
        'Error',
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      

      <Image
        source={require('@/assets/images/LLogo.png')}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/forgot')} disabled={isLoading} >
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={() => router.push('/sign_up')}
        disabled={isLoading}
      >
        <Text style={styles.createAccountText}>Create new account</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>POPULUS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 210,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingLeft: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#f33a59',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 15,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: '#00538C',
    marginBottom: 20,
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: '#00538C',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  createAccountText: {
    color: '#00538C',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    color: '#00538C',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
});

export default SignIn;