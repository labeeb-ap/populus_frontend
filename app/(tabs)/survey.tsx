import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correct import
import { API_URL } from '@/constants/constants';

interface SurveyItem {
  id: string;
  title: string;
  description: string;
  category?: string;
  dueDate: string;
  estimatedTime: string;
  responses: number;
  reward?: string;
  isCompleted?: boolean;
}


const Survey = () => {
  const [publicSurveys, setPublicSurveys] = useState<SurveyItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert("User token not found. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user/map`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch surveys');
        }

        const data = await response.json();
        setPublicSurveys(data); // Assuming the API returns an array of surveys
      } catch (error) {
        console.error('Error fetching surveys:', error);
        alert('Failed to fetch surveys. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const renderSurveyCard = (survey: SurveyItem) => (
    <TouchableOpacity
      key={survey.id}
      style={styles.surveyCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.surveyTitle}>{survey.title}</Text>
          {survey.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{survey.category}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-v" size={16} color="#4A6572" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>{survey.description}</Text>
      
      <View style={styles.surveyDetails}>
        <View style={styles.detailItem}>
          <FontAwesome name="clock-o" size={14} color="#6C757D" />
          <Text style={styles.detailText}>{survey.estimatedTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="calendar" size={14} color="#6C757D" />
          <Text style={styles.detailText}>Due: {survey.dueDate}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome name="users" size={14} color="#6C757D" />
          <Text style={styles.detailText}>{survey.responses} responses</Text>
        </View>
      </View>

      {survey.reward && (
        <View style={styles.rewardBadge}>
          <FontAwesome name="gift" size={14} color="#28A745" />
          <Text style={styles.rewardText}>{survey.reward}</Text>
        </View>
      )}

      {!survey.isCompleted && (
        <TouchableOpacity style={styles.startButton}>
          <View style={styles.buttonContent}>
            <MaterialIcons name="start" size={20} color="#fff" />
            <Text style={styles.startButtonText}>Start Survey</Text>
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Surveys</Text>
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={20} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {publicSurveys.map(renderSurveyCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  surveyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  moreButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#4A6572',
    lineHeight: 20,
    marginBottom: 12,
  },
  surveyDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 13,
    color: '#6C757D',
    marginLeft: 4,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '500',
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: '#F28C28',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default Survey;