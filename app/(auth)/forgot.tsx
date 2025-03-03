import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '@/constants/constants';
import { NavigationProp } from '@react-navigation/native';
import styles from '@/app/(auth)/Styles/forgotstyle'
import { useNavigation } from 'expo-router';
const { width } = Dimensions.get('window');
import { useRouter } from 'expo-router';


export default function ForgotPassword() {

  const router = useRouter();

  // Set method to 'email' only and don't allow changing it
  const [method] = useState<'email'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request, 2: Verify OTP, 3: Reset Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [resetToken, setResetToken] = useState<string | null>(null);
  

  // Timer for OTP expiration countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Animation effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestReset = async () => {
    try {
      setError('');
      
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      setIsLoading(true);
      try{
        const response = await axios.post(`${API_URL}/user/forgot-password`, {
          method,
          email: email.toLowerCase().trim(),
        });
  
        // Set OTP expiration time (5 minutes from now)
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);
        setOtpExpiry(expiryTime);
        setCountdown(300); // 5 minutes in seconds
        
        setStep(2);
      } catch (apiError: any) {
        console.error("API Error:", apiError);
        
        if (apiError.response && apiError.response.data && apiError.response.data.message) {
          setError(apiError.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      }
      
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      setIsLoading(true);

      try{
        await axios.post(`${API_URL}/user/resend-otp`, {
          method,
          email: email.toLowerCase().trim()
        });
  
        // Reset countdown
        setCountdown(300);
        
        // Update OTP expiration time
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 5);
        setOtpExpiry(expiryTime);
      } catch (apiError: any) {
        console.error("API Error:", apiError);
        
        if (apiError.response && apiError.response.data && apiError.response.data.message) {
          setError(apiError.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    console.log("verify otp");
    try {
      setError('');
      
      if (!otp.trim()) {
        setError('Please enter the verification code');
        return;
      }
  
      setIsLoading(true);
  
      // Debug: Log the payload being sent
      console.log("Sending OTP verification request with payload:", {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
      });
  
      const response = await axios.post(`${API_URL}/user/verify-otp`, {
        email: email.toLowerCase().trim(),
        otp: otp.trim(),
      });
  
      // Debug: Log the response from the backend
      console.log("OTP verification response:", response.data);
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Reset token in response:", response.data.resetToken);
       // Store the reset token from the response
      if (response.data.resetToken) {
        
        
        setResetToken(response.data.resetToken);
        console.log(response.data.resetToken);
      }else{
        console.error("Reset token not found in response:", response.data); // Debug log
      }

      setStep(3);
    } catch (apiError: any) {
      console.error("API Error:", apiError);
      
      if (apiError.response && apiError.response.data && apiError.response.data.message) {
        setError(apiError.response.data.message);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setError('');
      
      if (!newPassword) {
        setError('Please enter a new password');
        return;
      }

      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!resetToken) {
      setError('Reset token is missing. Please verify your OTP again.');
      return;
    }

      setIsLoading(true);
      try{
        const response = await axios.post(`${API_URL}/user/reset-password`, {
          resetToken, // Include the reset token
          newPassword, // Use the correct field name as expected by the backend
        });

         console.log("Reset password response:", response.data);

       // Show success message and navigate back
      setTimeout(() => {
        router.push({
          pathname: '/(auth)/sign_in',
          params: { 
            message: 'Password reset successful. Please login with your new password.' 
          }
        });
      }, 2000);
      } catch (apiError: any) {
        console.error("API Error:", apiError);
        
        if (apiError.response && apiError.response.data && apiError.response.data.message) {
          setError(apiError.response.data.message);
        } else {
          setError('Failed to reset password. Please try again.');
        }
      }
      
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  try{
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>
                  {step === 1 ? 'Forgot Password?' : 
                   step === 2 ? 'Verify Code' : 'Reset Password'}
                </Text>
                <Text style={styles.subtitle}>
                  {step === 1 ? 'Don\'t worry! Please enter the email associated with your account.' : 
                   step === 2 ? `We've sent a verification code to your email. The code expires in ${formatTime(countdown)}.` : 
                   'Create a new password for your account.'}
                </Text>
              </View>

              {step === 1 && (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, error && styles.inputError]}>
                      <Ionicons 
                        name="mail-outline" 
                        size={20} 
                        color={error ? '#dc3545' : '#666'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          setError('');
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRequestReset}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Continue</Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={20} 
                          color="#fff" 
                          style={styles.buttonIcon}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {step === 2 && (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Verification Code</Text>
                    <View style={[styles.inputWrapper, error && styles.inputError]}>
                      <Ionicons 
                        name="key-outline" 
                        size={20} 
                        color={error ? '#dc3545' : '#666'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="#999"
                        value={otp}
                        onChangeText={(text) => {
                          setOtp(text.replace(/[^0-9]/g, ''));
                          setError('');
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleVerifyOTP}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Verify Code</Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={20} 
                          color="#fff" 
                          style={styles.buttonIcon}
                        />
                      </>
                    )}
                  </TouchableOpacity>

                  <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <TouchableOpacity 
                      onPress={handleResendOTP}
                      disabled={countdown > 0 || isLoading}
                    >
                      <Text style={[
                        styles.resendButton, 
                        (countdown > 0 || isLoading) && styles.resendButtonDisabled
                      ]}>
                        Resend {countdown > 0 ? `(${formatTime(countdown)})` : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {step === 3 && (
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={[styles.inputWrapper, error && styles.inputError]}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={error ? '#dc3545' : '#666'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        placeholderTextColor="#999"
                        value={newPassword}
                        onChangeText={(text) => {
                          setNewPassword(text);
                          setError('');
                        }}
                        secureTextEntry
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[styles.inputWrapper, error && styles.inputError]}>
                      <Ionicons 
                        name="lock-closed-outline" 
                        size={20} 
                        color={error ? '#dc3545' : '#666'} 
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          setError('');
                        }}
                        secureTextEntry
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Reset Password</Text>
                        <Ionicons 
                          name="arrow-forward" 
                          size={20} 
                          color="#fff" 
                          style={styles.buttonIcon}
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } catch (error) {
    console.error("Render Error:", error);
    // Fallback UI in case of render error
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Something went wrong. Please try again.</Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20, width: 200 }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
} 