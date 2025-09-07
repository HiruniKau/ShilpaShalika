// src/components/SearchBar.tsx
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
  // Add other screen names as needed
};

// Create a typed version of useNavigation
type SearchBarNavigationProp = NavigationProp<RootStackParamList, 'SearchResults'>;

export default function SearchBar() {
  const navigation = useNavigation<SearchBarNavigationProp>();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Filter options based on your class data
  const subjects = ['Physics', 'Chemistry', 'Combined Mathematics', 'Applied Mathematics'];
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
    if (searchQuery.trim() || selectedSubjects.length > 0 || selectedGrades.length > 0) {
      setFilterModalVisible(false);
      navigation.navigate('SearchResults', { 
        searchQuery: searchQuery.trim(), 
        selectedSubjects, 
        selectedGrades 
      });
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSubjects([]);
    setSelectedGrades([]);
    setSearchQuery('');
  };

  return (
    <LinearGradient
      colors={['#1800AD', '#f11616']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={searchStyles.container}
    >
      <View style={searchStyles.searchBarWrapper}>
        <Icon name="magnify" size={20} color="#888" style={searchStyles.icon} />
        <TextInput
          style={searchStyles.input}
          placeholder="Search by subject, grade, teacher..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
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
              <Text style={searchStyles.modalTitle}>Filter Classes</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Search Input in Modal */}
            <View style={searchStyles.searchInputContainer}>
              <Icon name="magnify" size={20} color="#888" style={searchStyles.modalIcon} />
              <TextInput
                style={searchStyles.modalInput}
                placeholder="Search classes..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Subject Filters */}
            <Text style={searchStyles.filterHeading}>Subjects</Text>
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
            <Text style={searchStyles.filterHeading}>Grades</Text>
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

            {/* Selected Filters Display */}
            {(selectedSubjects.length > 0 || selectedGrades.length > 0) && (
              <View style={searchStyles.selectedFilters}>
                <Text style={searchStyles.filterHeading}>Selected Filters:</Text>
                <View style={searchStyles.selectedFiltersContainer}>
                  {selectedSubjects.map((subject) => (
                    <View key={subject} style={searchStyles.selectedFilterChip}>
                      <Text style={searchStyles.selectedFilterText}>{subject}</Text>
                    </View>
                  ))}
                  {selectedGrades.map((grade) => (
                    <View key={grade} style={searchStyles.selectedFilterChip}>
                      <Text style={searchStyles.selectedFilterText}>{grade}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={searchStyles.modalFooter}>
              <TouchableOpacity
                style={[searchStyles.actionButton, searchStyles.resetButton]}
                onPress={handleResetFilters}
              >
                <Text style={searchStyles.resetButtonText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[searchStyles.actionButton, searchStyles.applyButton]}
                onPress={handleSearch}
              >
                <Text style={searchStyles.applyButtonText}>Show Results</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
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
    padding: 25,
    maxHeight: '80%',
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
    color: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  filterHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  filterButtonSelected: {
    backgroundColor: '#1800ad',
    borderColor: '#1800ad',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  selectedFilters: {
    marginBottom: 20,
  },
  selectedFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedFilterChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedFilterText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  applyButton: {
    backgroundColor: '#1800ad',
  },
  resetButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});