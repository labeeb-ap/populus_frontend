import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter

const SignIn = () => {
  const router = useRouter(); // Initialize the router

  const handleLogin = () => {
    // Navigate to the /home route
    router.push('/home');
  };

  const handleSignUp = () => {
    // Navigate to the /sign_up route
    router.push('/sign_up1');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.languageText}>English (India)</Text>

      {/* Logo */}
      <Image
        source={require('@/assets/images/LLogo.png')}
        style={styles.logo}
      />

      {/* Email and Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={true}
        />
        <TouchableOpacity>
          <Text style={styles.showText}>Show</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Create New Account */}
      <TouchableOpacity
        style={styles.createAccountButton}
        onPress={handleSignUp}
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
  languageText: {
    marginTop: 20,
    color: '#5c5c5c',
    fontSize: 16,
    fontWeight: '500',
  },
  logo: {
    width: 100,
    height: 100,
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
  showText: {
    marginRight: 10,
    color: '#007bff',
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1b1b7e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 15,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordText: {
    color: '#007bff',
    marginBottom: 20,
  },
  createAccountButton: {
    borderWidth: 1,
    borderColor: '#1b1b7e',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  createAccountText: {
    color: '#1b1b7e',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 30,
    color: '#1b1b7e',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default SignIn;
