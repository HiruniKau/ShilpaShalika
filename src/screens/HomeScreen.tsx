// src/screens/HomeScreen.tsx
// This file will act as the main container for all the components.

import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Import the new components
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import UpcomingClasses from '../components/UpcomingClasses';
import LecturerPanel from '../components/LecturerPanel';
import TimeTables from '../components/TimeTables';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* The header with the logo and app name */}
      <Header />

      {/* The search bar component */}
      <SearchBar />

      {/* Upcoming classes section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming New Classes</Text>
          <TouchableOpacity onPress={() => console.log('See all classes pressed')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <UpcomingClasses />
      </View>

      {/* Lecturer panel section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lecturer Panel</Text>
          <TouchableOpacity onPress={() => console.log('See all lecturers pressed')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <LecturerPanel />
      </View>

      {/* Time table section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Time Tables</Text>
          <TouchableOpacity onPress={() => console.log('See all time tables pressed')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <TimeTables />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#1800ad',
    fontWeight: 'bold',
  },
});