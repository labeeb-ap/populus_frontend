import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Define props for the Announcement component
interface AnnouncementProps {
  department: string;
  time: string;
  title: string;
  message: string;
}

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>POPULUS</Text>
        <View style={styles.headerIcons}>
          <FontAwesome name="exclamation-circle" size={24} color="red" />
          <FontAwesome name="envelope" size={24} color="black" style={{ marginLeft: 10 }} />
          <Text style={styles.notificationBadge}>6</Text>
        </View>
      </View>

      {/* Weather Widget */}
      <View style={styles.weatherWidget}>
        <Text style={styles.temperature}>19°</Text>
        <Text style={styles.city}>Montreal, Canada</Text>
        <Text style={styles.weather}>Mid Rain</Text>
      </View>

      {/* Announcements */}
      <ScrollView style={styles.announcements}>
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
      </ScrollView>
    </View>
  );
}

// Announcement Component with Props
const Announcement: React.FC<AnnouncementProps> = ({
  department,
  time,
  title,
  message,
}) => (
  <View style={styles.announcement}>
    <Text style={styles.department}>{department}</Text>
    <Text style={styles.time}>{time}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <View style={styles.reactionIcons}>
      <FontAwesome name="thumbs-up" size={24} color="black" />
      <FontAwesome name="thumbs-down" size={24} color="black" style={{ marginLeft: 10 }} />
      <FontAwesome name="comment" size={24} color="black" style={{ marginLeft: 10 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    padding: 2,
    fontSize: 12,
  },
  weatherWidget: {
    backgroundColor: "#d1c4e9",
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
  },
  city: {
    fontSize: 18,
  },
  weather: {
    fontSize: 16,
    color: "gray",
  },
  announcements: {
    flex: 1,
  },
  announcement: {
    backgroundColor: "#f0f0f0",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  department: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  // title: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   marginTop: 5,
  // },
  message: {
    fontSize: 14,
    marginTop: 5,
  },
  reactionIcons: {
    flexDirection: "row",
    marginTop: 10,
  },
});
