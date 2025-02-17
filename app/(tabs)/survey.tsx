import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@/constants/constants';

// Define the interface for the survey data
interface SurveyItem {
  _id: string;
  title: string;
  question: string;
  options: string[];
  creator: string;
  profile: string;
  active: boolean;
  createdAt: string;
}

const Survey = () => {
  const [publicSurveys, setPublicSurveys] = useState<SurveyItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({}); // Track selected options
  const [completedSurveys, setCompletedSurveys] = useState<{ [key: string]: boolean }>({}); // Track completed surveys

  // Fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        console.log('Fetching data...'); // Debugging log
        const token = await AsyncStorage.getItem('userToken');
        console.log('Token:', token); // Debugging log

        if (!token) {
          alert('User token not found. Please log in again.');
          return;
        }

        try {
          const response = await fetch(`${API_URL}/user/poling`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          console.log('Response status:', response.status); // Debugging log

          if (!response.ok) {
            throw new Error(`Failed to fetch surveys: ${response.statusText}`);
          }

          const data = await response.json();
          console.log('API Response:', data); // Debugging log

          if (Array.isArray(data.surveys)) {
            setPublicSurveys(data.surveys); // Set the surveys array
          } else {
            console.error('API did not return an array:', data);
            alert('Unexpected response format from the server.');
          }
        } catch (error) {
          console.error('Error fetching surveys:', error);
          alert('Failed to fetch surveys. Please try again later.');
        }
      };

      fetchData();
    }, []) // Empty dependency array ensures the effect runs only on focus
  );

  // Handle option selection
  const handleOptionSelect = (surveyId: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [surveyId]: option, // Update the selected option for the survey
    }));
  };

  // Handle marking the poll as done
  const handleDone = async (surveyId: string) => {
    const selectedOption = selectedOptions[surveyId];

    if (!selectedOption) {
      alert('Please select an option before marking as done.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('User token not found. Please log in again.');
        return;
      }

      // Send the selected option and survey ID to the backend
      const response = await fetch(`${API_URL}/user/submit-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          surveyId,
          selectedOption,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit survey: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Survey submitted successfully:', data);

      // Mark the survey as completed
      setCompletedSurveys((prev) => ({
        ...prev,
        [surveyId]: true,
      }));

      Alert.alert('Success', 'Your response has been submitted successfully.');
    } catch (error) {
      console.error('Error submitting survey:', error);
      Alert.alert('Error', 'Failed to submit your response. Please try again later.');
    }
  };

  // Render each survey card
  const renderSurveyCard = (survey: SurveyItem) => {
    const isCompleted = completedSurveys[survey._id]; // Check if the survey is completed

    return (
      <View key={survey._id} style={styles.surveyCard}>
        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImagePlaceholder}>
            <FontAwesome name="user-circle" size={40} color="#4A6572" />
          </View>
          <Text style={styles.profileName}>{survey.profile}</Text>
        </View>

        {/* Survey Title */}
        <Text style={styles.surveyTitle}>{survey.title}</Text>

        {/* Survey Question */}
        <Text style={styles.description}>{survey.question}</Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {survey.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOptions[survey._id] === option && styles.selectedOptionButton,
                isCompleted && styles.disabledOptionButton, // Disable interaction if completed
              ]}
              onPress={() => handleOptionSelect(survey._id, option)}
              disabled={isCompleted} // Disable interaction if completed
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOptions[survey._id] === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Done Button */}
        {!isCompleted && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => handleDone(survey._id)}
            disabled={!selectedOptions[survey._id]} // Disable if no option is selected
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}

        {/* Completed Message */}
        {isCompleted && (
          <Text style={styles.completedText}>You have completed this survey.</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Surveys</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {publicSurveys.map(renderSurveyCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles (same as before)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  filterButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  surveyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  surveyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4A6572',
    lineHeight: 20,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 8,
  },
  selectedOptionButton: {
    borderColor: '#F28C28',
    backgroundColor: '#FFF3E0',
  },
  disabledOptionButton: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 14,
    color: '#4A6572',
  },
  selectedOptionText: {
    color: '#F28C28',
  },
  doneButton: {
    backgroundColor: '#F28C28',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 14,
    color: '#28A745',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Survey;