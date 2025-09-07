import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// NOTE: You will need to define this type based on your AppNavigator setup.
declare type RootStackParamList = {
  Signin: undefined;
  Home: undefined;
  Classes: undefined;
  Announcements: undefined;
  Profile: undefined;
  PostAd: undefined;
  Terms: undefined;
  Settings: undefined;
  Notifications: undefined;
  PaymentDetails: undefined;
};

const NotificationScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const notifications = [
    {
      id: '1',
      title: 'Payment Successful',
      message: 'Your payment for the Advanced Level Physics class has been successfully processed. Thank you!',
      timestamp: 'Just now',
      icon: 'cash-check',
      iconColor: '#4CAF50',
    },
    {
      id: '2',
      title: 'New Class Enrolled',
      message: 'You have been successfully enrolled in the new Chemistry A/L class. Check your timetable for details.',
      timestamp: '1 hour ago',
      icon: 'account-multiple-plus',
      iconColor: '#2196F3',
    },
    {
      id: '3',
      title: 'Timetable Update',
      message: 'The timetable for the Physics class has been updated. Please check the Classes section for the new schedule.',
      timestamp: '3 hours ago',
      icon: 'calendar-sync',
      iconColor: '#FFC107',
    },
    {
      id: '4',
      title: 'Upcoming Class',
      message: 'Your Biology class is starting in 15 minutes. Get ready!',
      timestamp: '2 days ago',
      icon: 'clock-start',
      iconColor: '#F44336',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#1800ad" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={[styles.iconContainer, { backgroundColor: notification.iconColor + '20' }]}>
              <Icon name={notification.icon} size={24} color={notification.iconColor} />
            </View>
            <View style={styles.notificationTextContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1800ad",
  },
  content: {
    padding: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationTextContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default NotificationScreen;
