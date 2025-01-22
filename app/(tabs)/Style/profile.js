import { StyleSheet} from "react-native";
 
 styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 20,
    },
    header: {
      paddingTop: 45,
      paddingBottom: 20,
    },
    backButton: {
      marginBottom: 20,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: '#000000',
      marginBottom: 30,
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#FFE4B5',
    },
    imageEditButton: {
      position: 'absolute',
      right: -5,
      bottom: -5,
      backgroundColor: '#FF4646',
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: '#000000',
      fontWeight: '600',
      marginBottom: 8,
    },
    input: {
      height: 56,
      borderWidth: 1,
      borderColor: '#FF4646',
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#000000',
      backgroundColor: '#ffffff',
    },
    valueContainer: {
      height: 56,
      borderWidth: 1,
      borderColor: '#FF4646',
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    valueText: {
      fontSize: 16,
      color: '#000000',
    },
    editButton: {
      backgroundColor: '#FF4646',
      height: 56,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    dropdownButton: {
      position: 'absolute',
      right: 16,
      top: '50%',
      transform: [{translateY: -10}],
    },
    nonEditableField: {
      height: 56,
      borderWidth: 1,
      borderColor: '#FF4646',
      borderRadius: 8,
      paddingHorizontal: 16,
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    inputError: {
      borderColor: '#FF4646',
      borderWidth: 1,
    },
    errorText: {
      color: '#FF4646',
      fontSize: 14,
      marginTop: 5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    loadingText: {
      marginTop: 10,
      color: '#000000',
      fontSize: 16,
    }
  });

  export default styles;