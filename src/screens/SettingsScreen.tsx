import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
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

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingCard}>
          <TouchableOpacity style={styles.settingItem} onPress={() => { /* Navigate to edit profile screen */ }}>
            <Icon name="account-edit-outline" size={24} color="#555" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => { /* Navigate to change password screen */ }}>
            <Icon name="lock-reset" size={24} color="#555" />
            <Text style={styles.settingText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => { navigation.navigate('PaymentDetails') }}>
            <Icon name="credit-card-outline" size={24} color="#555" />
            <Text style={styles.settingText}>Payment Details</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <Icon name="bell-outline" size={24} color="#555" />
            <Text style={styles.settingText}>Enable Push Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#1800ad" }}
              thumbColor={notificationsEnabled ? "#8eb7f8ff" : "#f4f3f4"}
              onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
              value={notificationsEnabled}
            />
          </View>
        </View>

        {/* App Preferences Section */}
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingItem}>
            <Icon name="theme-light-dark" size={24} color="#555" />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#1800ad" }}
              thumbColor={darkModeEnabled ? "#8eb7f8ff" : "#f4f3f4"}
              onValueChange={() => setDarkModeEnabled(previousState => !previousState)}
              value={darkModeEnabled}
            />
          </View>
          <TouchableOpacity style={styles.settingItem} onPress={() => { /* Navigate to privacy policy */ }}>
            <Icon name="shield-lock-outline" size={24} color="#555" />
            <Text style={styles.settingText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => { navigation.navigate('Terms') }}>
            <Icon name="file-document-outline" size={24} color="#555" />
            <Text style={styles.settingText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    color: "#333",
  },
  scrollView: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  settingCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: "#444",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
