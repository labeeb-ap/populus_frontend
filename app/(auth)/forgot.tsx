import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Dimensions,
    Image,
    Animated
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import axios, { AxiosError } from 'axios';
  import { NativeStackNavigationProp } from '@react-navigation/native-stack';
  import { LinearGradient } from 'expo-linear-gradient';
  import { Ionicons } from '@expo/vector-icons';
  
  const { width, height } = Dimensions.get('window');
  
  type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
  };
  
  type ForgotPasswordNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ForgotPassword'
  >;
  
  interface ForgotPasswordProps {
    navigation: ForgotPasswordNavigationProp;
  }
  
  interface ApiErrorResponse {
    message: string;
  }
  
  const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));
  
    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
  
    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
  
    const handleResetPassword = async (): Promise<void> => {
      setError('');
      
      if (!email) {
        setError('Please enter your email address');
        return;
      }
  
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
  
      setIsLoading(true);
  
      try {
        await axios.post('http://your-api-url/api/reset-password', {
          email: email.toLowerCase().trim()
        });
  
        Alert.alert(
          'Check Your Email',
          'We have sent password reset instructions to your email address.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Something went wrong. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.backButtonContainer}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
  
              <View style={styles.logoContainer}>
                <Image
                  source={require('./assets/logo.png')} // Add your logo image
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
  
              <View style={styles.card}>
                <View style={styles.header}>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.subtitle}>
                    Don't worry! It happens. Please enter the email address associated with your account.
                  </Text>
                </View>
  
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={[styles.inputWrapper, error && styles.inputError]}>
                      <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={(text: string) => {
                          setEmail(text);
                          setError('');
                        }}
                      />
                    </View>
                    {error ? (
                      <Animated.Text 
                        style={[styles.errorText, { opacity: fadeAnim }]}
                      >
                        {error}
                      </Animated.Text>
                    ) : null}
                  </View>
  
                  <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  };
  
  const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    backButtonContainer: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 1,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: height * 0.1,
      marginBottom: 30,
    },
    logo: {
      width: width * 0.4,
      height: width * 0.4,
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: '#666',
      lineHeight: 22,
      textAlign: 'center',
    },
    form: {
      gap: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 15,
      color: '#1a1a1a',
      marginBottom: 8,
      fontWeight: '500',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      borderWidth: 1,
      borderColor: '#e1e1e1',
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 56,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#1a1a1a',
    },
    inputError: {
      borderColor: '#dc3545',
      backgroundColor: '#fff8f8',
    },
    errorText: {
      color: '#dc3545',
      fontSize: 14,
      marginTop: 8,
      fontWeight: '500',
    },
    button: {
      backgroundColor: '#4c669f',
      height: 56,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonDisabled: {
      backgroundColor: 'rgba(76, 102, 159, 0.5)',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    buttonIcon: {
      marginLeft: 8,
    },
  });
  
  export default ForgotPassword;