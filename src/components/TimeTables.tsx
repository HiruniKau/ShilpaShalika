// src/components/TimeTables.tsx
// This will display the time table cards with a horizontal scroll view.
import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

export default function TimeTables() {
  const timeTables = [
    { id: '1', image: require('../assets/images/3.png') },
    { id: '2', image: require('../assets/images/4.png') },
    // Add more time table data here
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={timetableStyles.scrollView}>
      {timeTables.map((item) => (
        <View key={item.id} style={timetableStyles.card}>
          <Image source={item.image} style={timetableStyles.image} />
        </View>
      ))}
    </ScrollView>
  );
}

const timetableStyles = StyleSheet.create({
  scrollView: {
    paddingRight: 20,
  },
  card: {
    width: 250,
    height: 150,
    borderRadius: 12,
    marginRight: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
});
