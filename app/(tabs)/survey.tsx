import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome ,MaterialIcons} from '@expo/vector-icons';

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
  const [activeTab, setActiveTab] = useState('public');

  const publicSurveys: SurveyItem[] = [
    {
      id: '1',
      title: 'City Transportation Feedback',
      description: 'Help us improve public transportation services in your area',
      dueDate: '2024-02-01',
      estimatedTime: '10 mins',
      responses: 245,
      reward: '$5 Gift Card'
    },
    {
      id: '2',
      title: 'Community Safety Survey',
      description: 'Share your thoughts on neighborhood safety measures',
      dueDate: '2024-02-15',
      estimatedTime: '15 mins',
      responses: 182,
      reward: '500 Points'
    }
  ];

  const targetedSurveys: SurveyItem[] = [
    {
      id: '3',
      title: 'Senior Citizens Healthcare Access',
      description: 'Survey for residents aged 65+ about healthcare services',
      category: 'Healthcare',
      dueDate: '2024-02-10',
      estimatedTime: '20 mins',
      responses: 89,
      reward: '$10 Gift Card'
    },
    {
      id: '4',
      title: 'Youth Recreation Programs',
      description: 'Feedback on youth activities and facilities',
      category: 'Recreation',
      dueDate: '2024-02-05',
      estimatedTime: '12 mins',
      responses: 156,
      reward: '750 Points'
    }
  ];

  const completedSurveys: SurveyItem[] = [
    {
      id: '5',
      title: 'Library Services Feedback',
      description: 'Evaluation of community library services and resources',
      dueDate: '2024-01-15',
      estimatedTime: '8 mins',
      responses: 342,
      isCompleted: true
    }
  ];

  const renderSurveyCard = (survey: SurveyItem) => (
    <TouchableOpacity
      key={survey.id}
      style={[
        styles.surveyCard,
        survey.isCompleted && styles.completedCard
      ]}
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

      {/* {survey.reward && (
        <View style={styles.rewardBadge}>
          <FontAwesome name="gift" size={14} color="#28A745" />
          <Text style={styles.rewardText}>{survey.reward}</Text>
        </View>
      )} */}

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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'public' && styles.activeTab]}
          onPress={() => setActiveTab('public')}
        >
          <Text style={[styles.tabText, activeTab === 'public' && styles.activeTabText]}>
            Public
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'targeted' && styles.activeTab]}
          onPress={() => setActiveTab('targeted')}
        >
          <Text style={[styles.tabText, activeTab === 'targeted' && styles.activeTabText]}>
            Targeted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'public' && publicSurveys.map(renderSurveyCard)}
        {activeTab === 'targeted' && targetedSurveys.map(renderSurveyCard)}
        {activeTab === 'completed' && completedSurveys.map(renderSurveyCard)}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#E3F2FD',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  activeTabText: {
    color: '#1976D2',
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
  completedCard: {
    opacity: 0.8,
    backgroundColor: '#F8F9FA',
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