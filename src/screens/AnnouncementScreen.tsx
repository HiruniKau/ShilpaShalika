// src/screens/AnnouncementScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnouncementScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Latest Announcements Appear Here</Text>
  </View>
);

export default AnnouncementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
