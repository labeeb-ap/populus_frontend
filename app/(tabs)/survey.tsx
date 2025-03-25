import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '@/constants/constants';
import { useSurvey } from '../context/SurveyContext';

interface SurveyItem {
  _id: string;
  title: string;
  question: string;
  options: string[];
  creator: string;
  active: boolean;
  createdAt: string;
}

const Survey = () => {
  const [publicSurveys, setPublicSurveys] = useState<SurveyItem[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({}); 
  const [completedSurveys, setCompletedSurveys] = useState<{ [key: string]: boolean }>({});
  const { checkPendingSurveys } = useSurvey();

  const handleOptionSelect = (surveyId: string, option: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [surveyId]: option,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const token = await AsyncStorage.getItem('userToken');

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

          if (!response.ok) {
            throw new Error(`Failed to fetch surveys: ${response.statusText}`);
          }

          const data = await response.json();

          if (Array.isArray(data.surveys)) {
            setPublicSurveys(data.surveys);
            checkPendingSurveys(data.surveys, completedSurveys);
          }
        } catch (error) {
          console.error('Error fetching surveys:', error);
          alert('Failed to fetch surveys. Please try again later.');
        }
      };

      fetchData();
    }, [completedSurveys, checkPendingSurveys])
  );

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

      const newCompletedSurveys = {
        ...completedSurveys,
        [surveyId]: true
      };

      setCompletedSurveys(newCompletedSurveys);
      checkPendingSurveys(publicSurveys, newCompletedSurveys);

      Alert.alert('Success', 'Your response has been submitted successfully.');
    } catch (error) {
      console.error('Error submitting survey:', error);
      Alert.alert('Error', 'Failed to submit your response. Please try again later.');
    }
  };

  const renderSurveyCard = (survey: SurveyItem) => {
    const isCompleted = completedSurveys[survey._id];

    return (
      <View key={survey._id} style={styles.surveyCard}>
        <View style={styles.surveyHeader}>
          <Text style={styles.surveyTitle}>{survey.title}</Text>
          <Text style={styles.surveyDate}>
            {new Date(survey.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.surveyQuestion}>{survey.question}</Text>

        <View style={styles.optionsContainer}>
          {survey.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOptions[survey._id] === option && styles.selectedOptionButton,
                isCompleted && styles.disabledOptionButton,
              ]}
              onPress={() => handleOptionSelect(survey._id, option)}
              disabled={isCompleted}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOptions[survey._id] === option && styles.selectedOptionText,
                ]}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!isCompleted ? (
          <TouchableOpacity
            style={[
              styles.doneButton,
              !selectedOptions[survey._id] && styles.disabledDoneButton
            ]}
            onPress={() => handleDone(survey._id)}
            disabled={!selectedOptions[survey._id]}
          >
            <Text style={styles.doneButtonText}>Submit Response</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedContainer}>
            <MaterialIcons name="check-circle" size={24} color="#28A745" />
            <Text style={styles.completedText}>Survey Completed</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Surveys</Text>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {publicSurveys.map(renderSurveyCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E5E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  surveyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surveyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 0.7,
  },
  surveyDate: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'right',
  },
  surveyQuestion: {
    fontSize: 16,
    color: '#4A6572',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1E5E8',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOptionButton: {
    borderColor: '#007BFF',
    backgroundColor: '#E7F1FF',
  },
  disabledOptionButton: {
    opacity: 0.6,
  },
  optionText: {
    fontSize: 14,
    color: '#4A6572',
    flex: 1,
  },
  selectedOptionText: {
    color: '#007BFF',
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledDoneButton: {
    backgroundColor: '#B0C4DE',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9ECEF',
    padding: 15,
    borderRadius: 10,
  },
  completedText: {
    fontSize: 16,
    color: '#28A745',
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default Survey;