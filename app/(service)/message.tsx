import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Switch,
  FlatList,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/constants/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Define types for our feedback data
interface FeedbackItem {
  id: string;
  type: 'suggestion' | 'complaint';
  subject: string;
  message: string;
  status: 'pending' | 'in-review' | 'resolved';
  isAnonymous: boolean;
  createdAt: string;
  response?: string;
  responseDate?: string;
}

// API Functions
const submitFeedback = async (feedbackData: {
  name?: string;
  email?: string;
  type: string;
  subject: string;
  message: string;
  isAnonymous: boolean;
}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_URL}/feedback/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(feedbackData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit feedback');
    }

    
    return await response.json();
  } catch (error) {
    console.error('Feedback submission error:', error);
    throw error;
  }
};

const getFeedbackHistory = async (): Promise<{ suggestions: FeedbackItem[], complaints: FeedbackItem[] }> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      // Handle case where user is not logged in
      return { suggestions: [], complaints: [] };
    }
    
    const response = await fetch(`${API_URL}/feedback/display`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch feedback history');
    }

    return await response.json();
  } catch (error) {
    console.error('Feedback history error:', error);
    throw error;
  }
};

const checkFeedbackStatus = async (feedbackId: string) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${API_URL}/feedback/${feedbackId}`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check feedback status');
    }

    return await response.json();
  } catch (error) {
    console.error('Feedback status check error:', error);
    throw error;
  }
};

// Empty state component for feedback list
const EmptyFeedbackList = ({ type }: { type: string }) => (
  <View style={styles.emptyContainer}>
    <Ionicons 
      name={type === 'suggestion' ? "bulb-outline" : "warning-outline"} 
      size={50} 
      color="#d1d1d1" 
    />
    <Text style={styles.emptyText}>No {type}s yet</Text>
    <Text style={styles.emptySubText}>
      Your submitted {type}s will appear here
    </Text>
  </View>
);

// FeedbackItem component
const FeedbackItem = ({ item, onPress }: { item: FeedbackItem, onPress: (item: FeedbackItem) => void, key?: string  }) => (
  <TouchableOpacity style={styles.feedbackItem} onPress={() => onPress(item)}>
    <View style={styles.feedbackHeader}>
      <View style={styles.feedbackTypeContainer}>
        <Ionicons 
          name={item.type === 'suggestion' ? "bulb-outline" : "warning-outline"} 
          size={18} 
          color={item.type === 'suggestion' ? "#3498db" : "#e74c3c"} 
        />
        <Text style={[
          styles.feedbackType, 
          { color: item.type === 'suggestion' ? "#3498db" : "#e74c3c" }
        ]}>
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
        </Text>
      </View>
      <Text style={styles.feedbackDate}>{item.createdAt}</Text>
    </View>
    <Text style={styles.feedbackSubject} numberOfLines={1}>{item.subject}</Text>
    <Text style={styles.feedbackPreview} numberOfLines={2}>{item.message}</Text>
    <View style={styles.feedbackFooter}>
      <Text style={[
        styles.feedbackStatus, 
        { 
          color: 
            item.status === 'resolved' ? '#27ae60' :
            item.status === 'in-review' ? '#f39c12' : '#7f8c8d'
        }
      ]}>
        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
      </Text>
      {item.isAnonymous && (
        <View style={styles.anonymousBadge}>
          <Ionicons name="eye-off" size={12} color="#fff" />
          <Text style={styles.anonymousBadgeText}>Anonymous</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const FeedbackScreen = () => {
  // State for feedback history
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<FeedbackItem[]>([]);
  const [complaints, setComplaints] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestion' | 'complaint'>('suggestion');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  
  // State for new feedback form
  const [feedbackFormVisible, setFeedbackFormVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'complaint'>('suggestion');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);

  const router = useRouter();
  
  // Fetch feedback history on component mount
  useEffect(() => {
    loadFeedbackHistory();
  }, []);

  const loadFeedbackHistory = async () => {
    setIsLoading(true);
    try {
      const { suggestions = [], complaints = [] } = await getFeedbackHistory();
    setSuggestions(suggestions);
    setComplaints(complaints);
    } catch (error) {
      Alert.alert('Error', 'Failed to load feedback history');
      setSuggestions([]);
    setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!isAnonymous) {
      if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    } else {
      if (!subject.trim() || !message.trim()) {
        Alert.alert('Error', 'Please fill in the subject and message fields');
        return;
      }
    }

    // Prepare data
    const submissionData = {
      type: feedbackType,
      subject,
      message,
      isAnonymous,
      ...(isAnonymous ? {} : { name, email }),
    };

    try {
      setIsSubmitting(true);
      const response = await submitFeedback(submissionData);
      setFeedbackId(response.id);

      Alert.alert(
        'Thank You',
        `Your ${feedbackType} has been submitted ${isAnonymous ? 'anonymously' : 'successfully'}.`,
        [{ text: 'OK', onPress: () => {
          resetForm();
          setFeedbackFormVisible(false);
          loadFeedbackHistory(); // Refresh the feedback list
        }}]
      );
    } catch (error: any) {
      Alert.alert(
        'Submission Error',
        error.message || 'Unable to submit your feedback. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsAnonymous(false);
    setFeedbackId(null);
  };

  const handleFeedbackPress = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setModalVisible(true);
  };

  const renderFeedbackForm = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={feedbackFormVisible}
      onRequestClose={() => setFeedbackFormVisible(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setFeedbackFormVisible(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Submit Feedback</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.tabContainer}>
            {(['suggestion', 'complaint'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.tab,
                  feedbackType === type && styles.activeTab,
                ]}
                onPress={() => setFeedbackType(type)}
              >
                <Ionicons
                  name={type === 'suggestion' ? "bulb-outline" : "warning-outline"}
                  size={20}
                  color={feedbackType === type ? '#fff' : '#555'}
                />
                <Text
                  style={[
                    styles.tabText,
                    feedbackType === type && styles.activeTabText,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formContainer}>
            <View style={styles.anonymousToggle}>
              <View style={styles.anonymousTextContainer}>
                <Ionicons name={isAnonymous ? "eye-off" : "eye"} size={20} color="#777" />
                <Text style={styles.anonymousText}>Submit Anonymously</Text>
              </View>
              <Switch
                trackColor={{ false: '#e0e0e0', true: '#bde0fe' }}
                thumbColor={isAnonymous ? '#3498db' : '#f4f3f4'}
                onValueChange={() => setIsAnonymous(prev => !prev)}
                value={isAnonymous}
              />
            </View>
            
            {!isAnonymous && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#777" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      value={name}
                      onChangeText={setName}
                      editable={!isSubmitting}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#777" />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                      editable={!isSubmitting}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="create-outline" size={20} color="#777" />
                <TextInput
                  style={styles.input}
                  placeholder={`Enter ${feedbackType} subject`}
                  value={subject}
                  onChangeText={setSubject}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={styles.textArea}
                  placeholder={`Describe your ${feedbackType} in detail`}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    Submit {feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderFeedbackDetails = () => {
    // Only render if selectedFeedback is not null
    if (!selectedFeedback) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsHeaderLeft}>
                <Ionicons 
                  name={selectedFeedback.type === 'suggestion' ? "bulb-outline" : "warning-outline"} 
                  size={22} 
                  color={selectedFeedback.type === 'suggestion' ? "#3498db" : "#e74c3c"} 
                />
                <Text style={styles.detailsTitle}>
                  {selectedFeedback.type.charAt(0).toUpperCase() + selectedFeedback.type.slice(1)} Details
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.detailsContent}>
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Subject</Text>
                <Text style={styles.detailsValue}>{selectedFeedback.subject}</Text>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Message</Text>
                <Text style={styles.detailsMessageValue}>{selectedFeedback.message}</Text>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Status</Text>
                <View style={[
                  styles.statusBadge, 
                  { 
                    backgroundColor: 
                      selectedFeedback.status === 'resolved' ? '#e6f7ef' :
                      selectedFeedback.status === 'in-review' ? '#fef5e8' : '#f0f2f3',
                    borderColor:
                      selectedFeedback.status === 'resolved' ? '#27ae60' :
                      selectedFeedback.status === 'in-review' ? '#f39c12' : '#7f8c8d',
                  }
                ]}>
                  <Text style={[
                    styles.statusBadgeText,
                    {
                      color:
                        selectedFeedback.status === 'resolved' ? '#27ae60' :
                        selectedFeedback.status === 'in-review' ? '#f39c12' : '#7f8c8d',
                    }
                  ]}>
                    {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1).replace('-', ' ')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Submitted On</Text>
                <Text style={styles.detailsValue}>{selectedFeedback.createdAt}</Text>
              </View>
              
              {selectedFeedback.response && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsLabel}>Response</Text>
                  <View style={styles.responseContainer}>
                    <Text style={styles.responseText}>{selectedFeedback.response}</Text>
                    {selectedFeedback.responseDate && (
                      <Text style={styles.responseDate}>{selectedFeedback.responseDate}</Text>
                    )}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.mainHeader}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.replace("/home")} // Make sure you have navigation prop
      >
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setFeedbackFormVisible(true)}
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* Tab navigator */}
      <View style={styles.mainTabContainer}>
        {(['suggestion', 'complaint'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.mainTab,
              activeTab === type && styles.mainActiveTab,
            ]}
            onPress={() => setActiveTab(type)}
          >
            <Text
              style={[
                styles.mainTabText,
                activeTab === type && styles.mainActiveTabText,
              ]}
            >
              {type === 'suggestion' ? 'Suggestions' : 'Complaints'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Feedback list */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loaderText}>Loading feedback...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'suggestion' ? suggestions : complaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedbackItem item={item} onPress={handleFeedbackPress} key={item.id}  />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyFeedbackList type={activeTab} />}
          refreshing={isLoading}
          onRefresh={loadFeedbackHistory}
        />
      )}
      
      {/* Feedback form modal */}
      {renderFeedbackForm()}
      
      {/* Feedback details modal */}
      {renderFeedbackDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  mainActiveTab: {
    borderBottomColor: '#3498db',
  },
  mainTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#95a5a6',
  },
  mainActiveTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 50,
  },
  feedbackItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackType: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  feedbackSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  feedbackPreview: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 10,
  },
  feedbackFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  feedbackStatus: {
    fontSize: 13,
    fontWeight: '500',
  },
  anonymousBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#95a5a6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  anonymousBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f1f1f1',
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anonymousToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  anonymousTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 10,
    fontSize: 15,
    color: '#2c3e50',
  },
  textArea: {
    width: '100%',
    height: 120,
    paddingHorizontal: 8,
    fontSize: 15,
    color: '#2c3e50',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    height: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#2c3e50',
  },
  detailsContent: {
    padding: 20,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
    marginBottom: 5,
  },
  detailsValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  detailsMessageValue: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  responseContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  responseText: {
    fontSize: 15,
    color: '#2c3e50',
    lineHeight: 22,
  },
  responseDate: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 10,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default FeedbackScreen;