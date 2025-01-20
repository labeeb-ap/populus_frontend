import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, Entypo,FontAwesome } from "@expo/vector-icons";
import { useRouter } from 'expo-router'; 

interface AnnouncementProps {
  department: string;
  time: string;
  title: string;
  message: string;
}



export default function Home() {
  const router = useRouter();

  const handleMessagePress = () => {
    console.log('Message button pressed');
    
    try {
      router.push('/message');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleNotificationPress = () => {
    console.log(" notification pressed");
    router.push('/notification'); // Navigate to notifications page
  };

  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.logoText}>POPULUS</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}
            onPress={handleNotificationPress}>
            <Ionicons name="notifications-sharp" size={24} color="#DC3545" />
            </TouchableOpacity>
            <View style={styles.notificationContainer}>
              <TouchableOpacity 
              style={styles.iconButton}
              onPress={handleMessagePress}>

                <Entypo name="new-message" size={24} color="#2C3E50" />
                {/* <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>6</Text>
                </View> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Weather Widget */}
        <View style={styles.weatherWidget}>
          <View style={styles.weatherContent}>
            <View>
              <Text style={styles.temperature}>19°</Text>
              <Text style={styles.weather}>Mid Rain</Text>
            </View>
            <View style={styles.weatherInfo}>
              <Text style={styles.city}>Montreal, Canada</Text>
              {/* <FontAwesome name="cloud-rain" size={40} color="#4A6572" /> */}
            </View>
          </View>
        </View>

        {/* Announcements Section */}
        <View style={styles.announcementsSection}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          
          <Announcement
            department="Police Department"
            time="10:00 am"
            title="🚨 Traffic Alert 🚨"
            message="Road closure on Main St. from 3rd Ave to 5th Ave due to an ongoing investigation. Please use alternate routes. Updates will be shared as available."
          />
          <Announcement
            department="Health Department"
            time="10:00 am"
            title="Attention:"
            message="The Health Department advises all residents to take precautions during the flu season. Please get vaccinated, wash your hands frequently, and stay home if you feel unwell."
          />
          <Announcement
            department="Local government"
            time="10:00 am"
            title="Notice to All Residents:"
            message="The local government urges everyone to properly dispose of waste and maintain hygiene to prevent the spread of diseases. Ensure water storage is covered."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
          
const Announcement: React.FC<AnnouncementProps> = ({
  department,
  time,
  title,
  message,
}) => (
  <View style={styles.announcement}>
    <View style={styles.announcementHeader}>
      <View style={styles.departmentContainer}>
        <Text style={styles.department}>{department}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <FontAwesome name="ellipsis-v" size={16} color="#4A6572" />
      </TouchableOpacity>
    </View>
    <Text style={styles.announcementTitle}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <View style={styles.reactionIcons}>
      <TouchableOpacity style={styles.reactionButton}>
        <FontAwesome name="thumbs-up" size={20} color="#4A6572" />
        <Text style={styles.reactionCount}>24</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reactionButton}>
        <FontAwesome name="thumbs-down" size={20} color="#4A6572" />
        <Text style={styles.reactionCount}>2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reactionButton}>
        <FontAwesome name="comment" size={20} color="#4A6572" />
        <Text style={styles.reactionCount}>8</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 10,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#DC3545",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  weatherWidget: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "700",
    color: "#2C3E50",
  },
  city: {
    fontSize: 18,
    color: "#4A6572",
    fontWeight: "500",
    marginBottom: 8,
  },
  weather: {
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "500",
  },
  weatherInfo: {
    alignItems: "flex-end",
  },
  announcementsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 16,
  },
  announcement: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  departmentContainer: {
    flex: 1,
  },
  department: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: "#6C757D",
  },
  moreButton: {
    padding: 4,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#4A6572",
    lineHeight: 20,
    marginBottom: 16,
  },
  reactionIcons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    paddingTop: 12,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  reactionCount: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "500",
  },
});