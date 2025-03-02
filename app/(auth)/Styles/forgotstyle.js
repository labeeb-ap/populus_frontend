import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      padding: 24,
    },
    backButton: {
      marginBottom: 20,
    },
    headerContent: {
      alignItems: 'center',
      marginVertical: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 12,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      lineHeight: 24,
      marginHorizontal: 20,
    },
    formContainer: {
      marginTop: 24,
    },
    methodTabs: {
      flexDirection: 'row',
      marginBottom: 24,
      borderRadius: 12,
      backgroundColor: '#f8f9fa',
      padding: 4,
    },
    methodTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 8,
    },
    activeMethodTab: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    methodText: {
      fontSize: 15,
      fontWeight: '500',
      color: '#666',
      marginLeft: 8,
    },
    activeMethodText: {
      color: '#f33a59',
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1a1a1a',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e1e1e1',
      borderRadius: 12,
      backgroundColor: '#f8f9fa',
      height: 56,
      paddingHorizontal: 16,
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
      backgroundColor: '#fff5f5',
    },
    errorText: {
      color: '#dc3545',
      fontSize: 14,
      marginTop: 4,
      marginBottom: 16,
      fontWeight: '500',
    },
    button: {
      backgroundColor: '#f33a59',
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
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '600',
    },
    buttonIcon: {
      marginLeft: 8,
    },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    resendText: {
      fontSize: 14,
      color: '#666',
    },
    resendButton: {
      fontSize: 14,
      fontWeight: '600',
      color: '#f33a59',
    },
    resendButtonDisabled: {
      color: '#999',
    },
  });

  export default styles;