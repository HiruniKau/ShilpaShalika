// src/screens/SearchResultsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SearchResultsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>This is the Search Results Screen.</Text>
    <Text style={styles.text}>Search results will be displayed here.</Text>
  </View>
);

export default SearchResultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
});
