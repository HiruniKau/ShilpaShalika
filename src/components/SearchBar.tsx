// src/components/SearchBar.tsx
// This will be the search bar input and the filter icon.
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SearchBar() {
  return (
    <View style={searchStyles.container}>
      <Icon name="magnify" size={20} color="#888" style={searchStyles.icon} />
      <TextInput
        style={searchStyles.input}
        placeholder="Search by subject, grade..."
        placeholderTextColor="#888"
      />
      <Icon name="filter-variant" size={20} color="#888" style={searchStyles.icon} />
    </View>
  );
}

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 5,
  },
});