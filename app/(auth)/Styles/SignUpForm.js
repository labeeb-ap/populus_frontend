import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    container: {
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    formTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 20,
      textAlign: 'center',
    },
    progressBar: {
      height: 4,
      backgroundColor: '#e0e0e0',
      borderRadius: 2,
      marginBottom: 10,
    },
    progressIndicator: {
      height: '100%',
      backgroundColor: '#003366',
      borderRadius: 2,
    },
    stepIndicator: {
      textAlign: 'center',
      color: '#666',
      marginBottom: 20,
    },
    formSection: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }, 
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: '#ffffff',
      marginBottom: 8,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: '#ffffff',
    },
    picker: {
      height: 50,
    },
    dateInput: {
      justifyContent: 'center',
    },
    dateText: {
      color: '#333',
      fontSize: 16,
    },
    textArea: {
      height: 80, // Adjust height for the multiline input
      textAlignVertical: 'top', // Ensures text starts at the top
    },
    uploadButton: {
      height: 50,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderStyle: 'dashed',
    },
    uploadButtonText: {
      color: '#666',
      fontSize: 16,
    },
    mapContainer: {
      height: 200,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#003366',
      borderRadius: 8,
      padding: 15,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 5,
    },
    buttonSecondary: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#003366',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextSecondary: {
      color: '#003366',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: '#dc3545',
      fontSize: 12,
      marginTop: 4,
    },
    checkingText: {
      color: '#666',
      fontSize: 12,
      marginTop: 4,
    },
  });

export default styles;