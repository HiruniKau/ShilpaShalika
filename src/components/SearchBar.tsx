// src/components/SearchBar.tsx
// This component features a search bar with a linear gradient background and a filter modal.

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define the type for your navigation stack and its parameters
type RootStackParamList = {
  SearchResults: {
    searchQuery: string;
    selectedSubjects: string[];
    selectedGrades: string[];
  };
};

// Create a typed version of useNavigation
type SearchBarNavigationProp = NavigationProp<RootStackParamList, 'SearchResults'>;

export default function SearchBar() {
  const navigation = useNavigation<SearchBarNavigationProp>();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Dummy data for filter options
  const subjects = ['Physics', 'Pure Mathematics', 'Chemistry', 'Applied Mathematics'];
  const grades = ['Grade 12', 'Grade 13'];

  // Handle filter selection
  const handleSelectFilter = (type: 'subject' | 'grade', value: string) => {
    if (type === 'subject') {
      setSelectedSubjects((prev) =>
        prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
      );
    } else {
      setSelectedGrades((prev) =>
        prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
      );
    }
  };

  // Handle search and navigation
  const handleSearch = () => {
    setFilterModalVisible(false);
    navigation.navigate('SearchResults', { searchQuery, selectedSubjects, selectedGrades });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSubjects([]);
    setSelectedGrades([]);
  };

  return (
    <LinearGradient
      colors={['#1800AD', '#f11616']} // Red to Blue, you can adjust these
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={searchStyles.container} // The gradient now applies to the entire container
    >
      <View style={searchStyles.searchBarWrapper}> {/* This is the new wrapper for the search input and icons */}
        <Icon name="magnify" size={20} color="#888" style={searchStyles.icon} />
        <TextInput
          style={searchStyles.input}
          placeholder="Search by subject, grade..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="filter-variant" size={20} color="#888" style={searchStyles.icon} />
        </TouchableOpacity>
      </View>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={searchStyles.centeredView}>
          <View style={searchStyles.modalView}>
            <View style={searchStyles.modalHeader}>
              <Text style={searchStyles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Subject Filters */}
            <Text style={searchStyles.filterHeading}>Subject</Text>
            <View style={searchStyles.filterOptionsContainer}>
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    searchStyles.filterButton,
                    selectedSubjects.includes(subject) && searchStyles.filterButtonSelected,
                  ]}
                  onPress={() => handleSelectFilter('subject', subject)}
                >
                  <Text
                    style={[
                      searchStyles.filterButtonText,
                      selectedSubjects.includes(subject) && searchStyles.filterButtonTextSelected,
                    ]}
                  >
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Grade Filters */}
            <Text style={searchStyles.filterHeading}>Grade</Text>
            <View style={searchStyles.filterOptionsContainer}>
              {grades.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    searchStyles.filterButton,
                    selectedGrades.includes(grade) && searchStyles.filterButtonSelected,
                  ]}
                  onPress={() => handleSelectFilter('grade', grade)}
                >
                  <Text
                    style={[
                      searchStyles.filterButtonText,
                      selectedGrades.includes(grade) && searchStyles.filterButtonTextSelected,
                    ]}
                  >
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={searchStyles.modalFooter}>
              <TouchableOpacity
                style={[searchStyles.actionButton, searchStyles.resetButton]}
                onPress={handleResetFilters}
              >
                <Text style={searchStyles.actionButtonText}>Reset Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[searchStyles.actionButton, searchStyles.applyButton]}
                onPress={handleSearch}
              >
                <Text style={searchStyles.actionButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const searchStyles = StyleSheet.create({
  container: {
    // The gradient component now acts as the container
    paddingHorizontal: 20,
    paddingVertical: 15, // Added vertical padding to give the gradient some height
    borderBottomLeftRadius: 20, // Rounded corners for the bottom of the gradient
    borderBottomRightRadius: 20,
  },
  searchBarWrapper: { // This new style defines the look of the search bar itself
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // White background
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333', // Dark text color for readability on a white background
  },
  icon: {
    marginHorizontal: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    marginBottom: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#1800ad',
    borderColor: '#1800ad',
  },
  filterButtonText: {
    color: '#333',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#eee',
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#1800ad',
  },
  actionButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});
