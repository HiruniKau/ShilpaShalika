// src/components/LecturerPanel.tsx
// This will display the list of lecturers with a horizontal scroll view.
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

export default function LecturerPanel() {
  const lecturers = [
    { id: '1', name: 'MR. AMAL PERERA', university: 'University of Sri Jayewardenepura', subject: 'PHYSICS', image: require('../assets/images/1.png') },
    { id: '2', name: 'MR. NIMAL DIAS', university: 'University of Kelaniya', subject: 'PURE MATHS', image: require('../assets/images/2.png') },
    // Add more lecturer data here
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={lecturerStyles.scrollView}>
      {lecturers.map((item) => (
        <View key={item.id} style={lecturerStyles.card}>
          <Image source={item.image} style={lecturerStyles.image} />
          <View style={lecturerStyles.infoContainer}>
            <Text style={lecturerStyles.name}>{item.name}</Text>
            <Text style={lecturerStyles.university}>{item.university}</Text>
            <View style={lecturerStyles.subjectBadge}>
              <Text style={lecturerStyles.subjectText}>{item.subject}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const lecturerStyles = StyleSheet.create({
  scrollView: {
    paddingRight: 20,
    paddingBottom:20,
  },
  card: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  university: {
    fontSize: 12,
    color: '#888',
  },
  subjectBadge: {
    backgroundColor: '#1800ad',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  subjectText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});