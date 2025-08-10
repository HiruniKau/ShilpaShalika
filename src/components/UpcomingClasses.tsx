// src/components/UpcomingClasses.tsx
// This component fetches and renders a list of upcoming class images from Firestore.

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Define the interface for our class data to ensure type safety
interface ClassData {
  id: string;
  image: string; // This will be the image URL from Firestore
}

export default function UpcomingClasses() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect hook to fetch data from Firestore when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Get a reference to the 'classes' collection in Firestore
        const snapshot = await firestore().collection('classes').get();
        
        // Map the Firestore documents to our ClassData interface, only getting the image field
        const fetchedClasses: ClassData[] = snapshot.docs.map(doc => ({
          id: doc.id,
          image: doc.data().image,
        }));
        
        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Failed to fetch classes from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []); // The empty dependency array ensures this effect runs only once

  if (loading) {
    return (
      <View style={classStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#1800ad" />
      </View>
    );
  }

  // Handle the case where no classes are found
  if (classes.length === 0) {
    return (
      <View style={classStyles.emptyContainer}>
        <Text style={classStyles.emptyText}>No upcoming classes available.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={classStyles.scrollView}>
      {classes.map((item) => (
        <View key={item.id} style={classStyles.card}>
          {/* Use source={{ uri: item.image }} to load the image from the URL */}
          <Image source={{ uri: item.image }} style={classStyles.image} />
        </View>
      ))}
    </ScrollView>
  );
}

const classStyles = StyleSheet.create({
  scrollView: {
    paddingRight: 20,
  },
  card: {
    width: 250,
    height: 150,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150, // Match the height of the card for consistent layout
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});
