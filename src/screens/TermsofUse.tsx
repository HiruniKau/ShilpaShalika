import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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

const TermsOfUseScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#1800ad" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>ShilpaShalika App - Last Updated: [8/9/2025]</Text>
        <Text style={styles.paragraph}>
          Welcome to Shilpa Shalika, a mobile application built for students of Shilpa Shalika Higher Education Center, Ambalangoda. 
          This app is designed to modernize communication, reduce reliance on physical notices & social media, and deliver class 
          info, timetables, announcements, and enrollment all in one place. By using this app, you agree to comply with these Terms of Use. Please read them carefully.
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using the Shilpa Shalika app, you confirm that you accept these Terms of Use and agree to be
          bound by them. If you do not agree, you must not use the app.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          To be eligible to use the Shilpa Shalika app, you must be a student currently enrolled in an A/L or O/L class at the Shilpa Shalika Higher Education Center.
        </Text>

        <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Accurate Information:</Text> You are responsible for providing accurate and up-to-date personal and academic information, including your Student ID.</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Respectful Conduct:</Text> The app is for educational purposes. Any fraudulent, misleading, or abusive behavior is strictly prohibited.</Text>
        <Text style={styles.bulletPoint}>• <Text style={styles.boldText}>Account Security:</Text> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</Text>

        <Text style={styles.sectionTitle}>4. Prohibited Activities</Text>
        <Text style={styles.paragraph}>
          You must NOT:
        </Text>
        <Text style={styles.bulletPoint}>• Share your account information with others.</Text>
        <Text style={styles.bulletPoint}>• Use the app to post fake or misleading information.</Text>
        <Text style={styles.bulletPoint}>• Harass or discriminate against other students or staff.</Text>
        <Text style={styles.bulletPoint}>• Distribute viruses or other harmful code.</Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the app's systems or data.</Text>

        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          The content on this app, including text, graphics, logos, and software, is the property of Shilpa Shalika
          or its content suppliers and is protected by international copyright laws. You may not use, reproduce, or
          distribute any content without explicit permission.
        </Text>

        <Text style={styles.sectionTitle}>6. Disclaimer of Warranties</Text>
        <Text style={styles.paragraph}>
          The app is provided "as is" and "as available" without any warranties of any kind, either express or implied.
          Shilpa Shalika does not guarantee that the app will be uninterrupted or error-free.
        </Text>

        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Shilpa Shalika will not be liable for any damages arising from the use of this app. This includes, but is not
          limited to, direct, indirect, incidental, punitive, and consequential damages.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          Shilpa Shalika reserves the right to modify these Terms of Use at any time. We will notify you of any changes
          by posting the new Terms on this screen. Your continued use of the app after any such changes constitutes
          your acceptance of the new Terms.
        </Text>

        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms of Use are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising
          out of these Terms will be subject to the exclusive jurisdiction of the courts of Sri Lanka.
        </Text>
        <Text style={styles.sectionTitle}>10. Contact Information</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms of Use, please contact us at: <Text style={styles.boldText}>contact@shilpashalika.edu</Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default TermsOfUseScreen;
