// src/screens/ClassScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Define navigation types
declare type RootStackParamList = {
  ClassDetails: { classId: string };
  Home: undefined;
 
};

interface Enrollment {
  enrollmentId: string;
  classId: string;
  className: string;
  subject: string;
  teacherName: string;
  examYear: string;
  enrollmentMonth: string;
  enrollmentDate: any;
  duration: string;
  admissionFee: string;
  status: string;
  imageUrl?: string;
  studentId: string;
  studentName: string;
  medium?: string;
  type?: string;
  grade?: string;
}

const { width } = Dimensions.get('window');

const ClassScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch enrollments for the current user - simplified without orderBy temporarily
      const querySnapshot = await firestore()
        .collection('enrollments')
        .where('studentId', '==', user.uid)
        .where('status', '==', 'active')
        // .orderBy('enrollmentDate', 'desc') // Remove temporarily while index builds
        .get();

      // Map directly from enrollment documents (imageUrl is now included)
      const enrollmentsData: Enrollment[] = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        enrollmentId: doc.id,
      } as Enrollment));

      // Sort manually on client side by enrollment date
      const sortedEnrollments = enrollmentsData.sort((a, b) => {
        const dateA = a.enrollmentDate?.toDate?.() || new Date(0);
        const dateB = b.enrollmentDate?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
      });

      setEnrollments(sortedEnrollments);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      
      // Fallback: try without status filter if still failing
      try {
        const user = auth().currentUser;
        if (user) {
          const querySnapshot = await firestore()
            .collection('enrollments')
            .where('studentId', '==', user.uid)
            .get();

          const enrollmentsData: Enrollment[] = querySnapshot.docs
            .map(doc => ({
              ...doc.data(),
              enrollmentId: doc.id
            } as Enrollment))
            .filter(enrollment => enrollment.status === 'active')
            .sort((a, b) => {
              const dateA = a.enrollmentDate?.toDate?.() || new Date(0);
              const dateB = b.enrollmentDate?.toDate?.() || new Date(0);
              return dateB.getTime() - dateA.getTime();
            });

          setEnrollments(enrollmentsData);
        }
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEnrollments();
  };

  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      // Handle both Firestore Timestamp and Date objects
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderEnrollmentCard = ({ item }: { item: Enrollment }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => handleClassPress(item.classId)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.statusBadge}>{item.status?.toUpperCase() || 'ACTIVE'}</Text>
        <Text style={styles.enrollmentDate}>
          Enrolled: {formatDate(item.enrollmentDate)}
        </Text>
      </View>

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.classImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Icon name="book-open-page-variant" size={40} color="#ccc" />
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      <View style={styles.classInfo}>
        <Text style={styles.teacherText}>By {item.teacherName}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={14} color="#666" />
            <Text style={styles.detailText}>{item.examYear}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="cash" size={14} color="#666" />
            <Text style={styles.detailText}>{item.admissionFee}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-month" size={14} color="#666" />
            <Text style={styles.detailText}>{item.enrollmentMonth}</Text>
          </View>
        </View>


        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Course in progress</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1800ad" />
        <Text style={styles.loadingText}>Loading your classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
        <Text style={styles.headerSubtitle}>
          {enrollments.length} enrolled class{enrollments.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {enrollments.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="book-open-outline" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No classes enrolled yet</Text>
          <Text style={styles.emptyStateText}>
            Explore our courses and enroll to start learning!
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Browse Courses</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={enrollments}
          renderItem={renderEnrollmentCard}
          keyExtractor={(item) => item.enrollmentId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop:40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1800ad',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
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
    height: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#28a745',
    backgroundColor: '#d4edda',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  enrollmentDate: {
    fontSize: 12,
    color: '#666',
  },
  classImage: {
    width: '100%',
    height: 90,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#999',
    fontSize: 12,
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
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  progressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '30%',
    backgroundColor: '#1800ad',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: '#1800ad',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ClassScreen;