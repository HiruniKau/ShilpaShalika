// src/screens/SearchResultsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define types
declare type RootStackParamList = {
  SearchResults: {
    searchQuery: string;
    selectedSubjects: string[];
    selectedGrades: string[];
  };
  ClassDetails: { classId: string };

};

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;
type SearchResultsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;

interface ClassDetail {
  id: string;
  className: string;
  imageUrl: string;
  subject: string;
  teacherName: string;
  duration: string;
  examYear: string;
  medium: string;
  type: string;
  admissionFee: string;
  grade?: string;
}

const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsRouteProp>();
  const navigation = useNavigation<SearchResultsNavigationProp>();
  const { searchQuery, selectedSubjects, selectedGrades } = route.params;
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('classDetails')
          .get();

        const classesData: ClassDetail[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          classesData.push({
            id: doc.id,
            className: data.className || '',
            imageUrl: data.imageUrl || '',
            subject: data.subject || '',
            teacherName: data.teacherName || '',
            duration: data.duration || '',
            examYear: data.examYear || '',
            medium: data.medium || '',
            type: data.type || '',
            admissionFee: data.admissionFee || '',
            grade: data.grade
          });
        });

        setClasses(classesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      let results = classes;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (classItem) =>
            classItem.subject.toLowerCase().includes(query) ||
            classItem.teacherName.toLowerCase().includes(query) ||
            classItem.className.toLowerCase().includes(query) ||
            (classItem.grade && classItem.grade.toLowerCase().includes(query))
        );
      }

      // Filter by selected subjects
      if (selectedSubjects.length > 0) {
        results = results.filter((classItem) =>
          selectedSubjects.includes(classItem.subject)
        );
      }

      // Filter by selected grades
      if (selectedGrades.length > 0) {
        results = results.filter((classItem) => {
          const classGrade = classItem.grade || '';
          return selectedGrades.some((grade) => classGrade.includes(grade.replace('Grade ', '')));
        });
      }

      setFilteredClasses(results);
    }
  }, [classes, searchQuery, selectedSubjects, selectedGrades]);

  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

  const renderClassCard = ({ item }: { item: ClassDetail }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => handleClassPress(item.id)}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.classImage}
        resizeMode="cover"
      />
      <View style={styles.classInfo}>
        <Text style={styles.subjectText}>{item.subject}</Text>
        <Text style={styles.teacherText}>By {item.teacherName}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.durationText}>{item.duration}</Text>
          <Text style={styles.feeText}>{item.admissionFee}</Text>
        </View>
        {item.grade && (
          <View style={styles.gradeBadge}>
            <Text style={styles.gradeText}>{item.grade}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1800ad" />
        <Text style={styles.loadingText}>Searching classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Search Results</Text>
          <Text style={styles.resultsCount}>
            {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} found
          </Text>
        </View>
      </View>

      {filteredClasses.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="magnify-close" size={60} color="#ccc" />
          <Text style={styles.emptyStateText}>No classes found</Text>
          <Text style={styles.emptyStateSubText}>
            Try adjusting your search criteria or filters
          </Text>
          <TouchableOpacity 
            style={styles.backToSearchButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToSearchText}>Back to Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop:40,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerContent: {
    flex: 1,
   
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1800ad',
    marginBottom: 2,
    marginRight: 40,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
    marginRight: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    height: 220,
  },
  classImage: {
    width: '100%',
    height: 80,
  },
  classInfo: {
    padding: 16,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  teacherText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  feeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1800ad',
  },
  gradeBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  gradeText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToSearchButton: {
    backgroundColor: '#1800ad',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToSearchText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SearchResultsScreen;