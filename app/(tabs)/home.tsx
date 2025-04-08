import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_URL } from '@/constants/constants';
import styles from "@/app/(tabs)/Style/homestyle";
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import WeatherCard from '../../components/WeatherCard';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#1F3A93',
  primaryLight: '#3A5FBF',
  secondary: '#007ACC',
  background: '#F6F8FA',
  cardBackground: '#FFFFFF',
  text: '#2C3E50',
  textLight: '#546E7A',
  subtext: '#7F8C8D',
  accent: '#00A8FF',
  white: '#FFFFFF',
  border: '#E4E8EC',
  borderLight: '#F0F2F5',
  error: '#C0392B',
  success: '#27AE60',
};

interface Department {
  id: number;
  name: string;
  color: string;
  icon: string;
  iconFamily: 'MaterialIcons' | 'MaterialCommunityIcons';
}

interface DecodedToken {
  username: string;
  userId: string;
  presidentId:string, 
  exp: number;
  // Add any other properties that might be in your token
}
const getUserInfoFromToken = async (): Promise<{ username: string; userId: string,access: string }> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    if (!token) {
      console.log('No token found in AsyncStorage');
      return { username: 'Anonymous', userId: '0000',access:'Null' }; // Default values
    }
    
    const decodedToken = jwtDecode(token) as DecodedToken;
    console.log(decodedToken.presidentId);
    return {
      username: decodedToken.username || 'Anonymous',
      userId: decodedToken.userId || '0000',
      access:decodedToken.presidentId||'Null', 
    };
  } catch (error) {
    console.error('Error getting user information from token:', error);
    return { username: 'Anonymous', userId: '0000',access: 'Null' }; // Default values on error
  }
};

const DEPARTMENTS: Department[] = [
  { 
    id: 1, 
    name: 'Local Government', 
    color: '#3498DB',
    icon: 'account-balance',
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 2, 
    name: 'Health Department', 
    color: '#2ECC71',
    icon: 'local-hospital',
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 3, 
    name: 'Police Department', 
    color: '#34495E',
    icon: 'police-badge',
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 4, 
    name: 'Fire Department', 
    color: '#E74C3C',
    icon: 'fire-truck',
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 5, 
    name: 'Education Department', 
    color: '#9B59B6',
    icon: 'school',
    iconFamily: 'MaterialIcons'
  },
  { 
    id: 6, 
    name: 'Transportation Department', 
    color: '#F1C40F',
    icon: 'bus',
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 7, 
    name: 'Environmental Department', 
    color: '#16A085',
    icon: 'leaf',
    iconFamily: 'MaterialCommunityIcons'
  },
  { 
    id: 8, 
    name: 'Social Services', 
    color: '#E67E22',
    icon: 'account-group',
    iconFamily: 'MaterialCommunityIcons'
  },
];

interface Comment {
  username: string;
  message: string;
  createdAt: Date;
}

interface Post {
  _id: string;
  department: string;
  time: Date;
  title: string;
  message: string;
  imageUri?: string;
  reactions: {
    likes: number;
    dislikes: number;
    comments: Comment[];
  };
  createdAt: Date;
  userReaction?: 'like' | 'dislike' | null;
}

// Weather data mock (could be replaced with actual API)
const weatherData = {
  temperature: 28,
  condition: 'Sunny',
  city: 'City Center',
  humidity: 42,
  wind: 5.2
};

const DepartmentIcon: React.FC<{ department: Department; size?: number; color?: string }> = ({
  department,
  size = 24,
  color,
}) => {
  if (!department) return null;

  if (department.iconFamily === 'MaterialIcons') {
    return <MaterialIcons name={department.icon} size={size} color={color || department.color} />;
  } else if (department.iconFamily === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={department.icon} size={size} color={color || department.color} />;
  }

  return null;
};

const CommentModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  onAddComment: (comment: string) => Promise<void>;
}> = ({ visible, onClose, postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.commentTime}>
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </View>
      <Text style={styles.commentMessage}>{item.message}</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.commentModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Icon name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.commentsList}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <Icon name="chatbubbles-outline" size={48} color={COLORS.subtext} />
                <Text style={styles.emptyCommentsText}>No comments yet. Be the first to comment!</Text>
              </View>
            }
          />

          <View style={styles.commentInput}>
            <TextInput
              style={styles.commentTextInput}
              placeholder="Write a comment..."
              placeholderTextColor={COLORS.subtext}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.commentSubmitButton,
                (!newComment.trim() || isSubmitting) && styles.commentSubmitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Icon name="send" size={20} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};



  const Home = ()=>  {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  
    const router = useRouter();

  // Animated values for interaction feedback

    // Add handler functions for header buttons
    const handleNotificationPress = () => {
      Alert.alert("Notifications", "You clicked the notifications button");
    };
  
    const handleMessagePress = () => {
      router.replace("/message");
    };



  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      // Get user info, including the access value
      const userInfo = await getUserInfoFromToken();
      const access = userInfo.access; // Extract the access value
      console.log(access);
      // Make the axios request with the access parameter
      const response = await axios.get(`${API_URL}/posts/display`, {
          params: {
              access: access // Pass the access value from the token
          }
      });
      const transformedPosts = response.data.announcements.map((post: any) => ({
        _id: post._id,
        department: post.department,
        time: new Date(post.time),
        title: post.title,
        message: post.message,
        imageUri: post.imageUri,
        reactions: {
          likes: post.reactions?.likes || 0,
          dislikes: post.reactions?.dislikes || 0,
          comments: post.reactions?.comments?.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt)
          })) || []
        },
        createdAt: new Date(post.createdAt),
        userReaction: post.userReaction
      }));
      setPosts(transformedPosts);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to fetch posts. Please check your connection and try again.',
        [{ text: 'Retry', onPress: fetchPosts }, { text: 'OK' }]
      );
      console.error('Fetch posts error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (postId: string, type: 'like' | 'dislike') => {
    try {
       // Retrieve user info from token
      const { userId } = await getUserInfoFromToken();
      const response = await axios.post(`${API_URL}/posts/${postId}/reaction`, {
        userId,
        type
      });
      
      //update UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId 
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  likes: response.data.reactions.likes,
                  dislikes: response.data.reactions.dislikes
                },
                userReaction: response.data.userReaction
              }
            : post
        )
      );
    } catch (error) {
      Alert.alert('Error', `Failed to ${type} post. Please try again.`);
    }
  };

  const handleAddComment = async (postId: string, message: string) => {
    try {
      // Retrieve user info from token
      const { username } = await getUserInfoFromToken();

      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        username,
        message
      });
       // Extract the comment object from the response
      const newComment = response.data.comment;
      // Ensure the comment object is valid
      if (!newComment || !newComment.username || !newComment.message || !newComment.createdAt) {
        throw new Error("Invalid comment data returned from API");
      }

      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              reactions: {
                ...post.reactions,
                comments: [
                  ...post.reactions.comments,
                  {
                    username: newComment.username,
                    message: newComment.message,
                    createdAt: new Date(newComment.createdAt)
                }]
              }
            };
          }
          return post;
        })
      );

      return response.data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  };

  const renderPostItem = ({ item }: { item: Post }) => {
    const department = DEPARTMENTS.find(d => d.name === item.department);
    
    const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

      // Update your share function to use proper typing
      const shareToWhatsApp = async (item: Post) => {
        try {
          // Get department name
          const departmentName = DEPARTMENTS.find(d => d.name === item.department)?.name || "Department not specified";
          
          // Format date nicely
          const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          // Create comprehensive formatted message
          const message = 
            `*${item.title}*\n\n` +
            ` *${departmentName}\n` +
            `*Date:* ${formattedDate}\n\n` +
            `${item.message}\n\n` + 
            (item.imageUri ? `*Image:* ${item.imageUri}\n\n` : "") +
            "Shared from Populus App";
          
          // For WhatsApp sharing via Linking (no need for RNShare)
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
          
          const canOpen = await Linking.canOpenURL(whatsappUrl);
          if (canOpen) {
            await Linking.openURL(whatsappUrl);
          } else {
            Alert.alert("WhatsApp not installed", "Please install WhatsApp to share content.");
          }
        } catch (error) {
          console.error('Error sharing:', error);
          Alert.alert(
            'Sharing Failed',
            'Could not share this post to WhatsApp. Please try again later.'
          );
        }
      };

    return (
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          {department && (
            <View style={styles.departmentInfo}>
              <View style={styles.departmentIconContainer}>
                <DepartmentIcon department={department} size={24}  />
              </View>
              <View style={styles.departmentTextContainer}>
                <Text style={styles.departmentText}>{department.name}</Text>
                <Text style={styles.postDate}>{formattedDate}</Text>
              </View>
            </View>
          )}
          <TouchableOpacity style={styles.moreOptionsButton}>
            <MaterialIcons name="more-vert" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.message}</Text>
        
        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.postStats}>
          <Text style={styles.statsText}>
            {item.reactions.likes > 0 && <Text>{item.reactions.likes} likes</Text>}
            {item.reactions.likes > 0 && item.reactions.comments.length > 0 && <Text> • </Text>}
            {item.reactions.comments.length > 0 && <Text>{item.reactions.comments.length} comments</Text>}
          </Text>
        </View>
        
        <View style={styles.separator} />
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReaction(item._id, 'like')}
          >
            <View style={styles.iconContainer}>
            <Icon 
              name={item.userReaction === 'like' ? "thumbs-up" : "thumbs-up-outline"} 
              size={20} 
              color={item.userReaction === 'like' ? COLORS.secondary : COLORS.textLight} 
            />
            <Text style={[
              styles.actionText, 
              item.userReaction === 'like' && styles.activeActionText
            ]}>
              {item.reactions.likes > 0 ? item.reactions.likes : ''}Like</Text>
              </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReaction(item._id, 'dislike')}
          >
            <Icon 
              name={item.userReaction === 'dislike' ? "thumbs-down" : "thumbs-down-outline"} 
              size={20} 
              color={item.userReaction === 'dislike' ? COLORS.error : COLORS.textLight} 
            />
            <Text style={[
              styles.actionText, 
              item.userReaction === 'dislike' && styles.activeActionText
            ]}>
              {item.reactions.dislikes > 0 ? item.reactions.dislikes : ''} Dislike
            </Text>
          </TouchableOpacity>


          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setSelectedPostId(item._id);
              setCommentModalVisible(true);
            }}
          >
            <Icon name="chatbubble-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => shareToWhatsApp(item)}
          >
            <Icon name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.actionText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {selectedPostId === item._id && (
          <CommentModal
            visible={commentModalVisible}
            onClose={() => setCommentModalVisible(false)}
            postId={item._id}
            comments={item.reactions.comments}
            onAddComment={(message) => handleAddComment(item._id, message)}
          />
        )}
      </View>
    );
  };
  const Header = () => {
    return (
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>POPULUS</Text>
        <TouchableOpacity style={headerStyles.alertButton}>
          <Icon name="notifications-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View >
      <Header />
      <WeatherCard/>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.headerTopContent}>
          <Text style={styles.logoText}>POPULUS</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleNotificationPress}
            >
              <Icon name="notifications-sharp" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleMessagePress}
            >
              <Entypo name="new-message" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
        {/* Posts List */}
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.secondary}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={posts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item._id}
            refreshing={isLoading}
            onRefresh={fetchPosts}
            
            contentContainerStyle={styles.listContainer}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="documents-outline" size={48} color={COLORS.subtext} />
                <Text style={styles.emptyStateText}>
                  No community posts yet.{'\n'}Be the first to share!
                </Text>
              </View>
            }
          />
        )}

    </SafeAreaView>
  );
};

export default Home;

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14, // Increased vertical padding
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    width: '100%', // Ensure it takes full width
    elevation: 2, // Add slight shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 0,
  },
  title: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 0.5, // Slight letter spacing for better legibility
  },
  alertButton: {
    padding: 8, // Increased touchable area
  },
});