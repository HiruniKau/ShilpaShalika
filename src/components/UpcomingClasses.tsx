import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for your class data
interface ClassDetail {
  id: string;
  className: string;
  imageUrl: string;
  examYear: string;
  subject: string;
  teacherName: string;
  adminSionFee?: string;
  duration?: string;
  medium?: string;
  type?: string;
}

// Define navigation types
declare type RootStackParamList = {
  ClassDetails: { classId: string };
  // Add other screen names as needed
};

const { width } = Dimensions.get('window');

const UpcomingClasses: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const unsubscribe = firestore()
          .collection("classDetails")
          .onSnapshot(
            (querySnapshot) => {
              const classesData: ClassDetail[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                classesData.push({
                  id: doc.id,
                  className: data.className || '',
                  imageUrl: data.imageUrl || '',
                  examYear: data.examYear || '',
                  subject: data.subject || '',
                  teacherName: data.teacherName || '',
                  adminSionFee: data.adminSionFee,
                  duration: data.duration,
                  medium: data.medium,
                  type: data.type
                });
              });
              setClasses(classesData);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching classes:", error);
              setLoading(false);
            }
          );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading classes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming New Classes</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {classes.map((classItem) => (
          <TouchableOpacity
            key={classItem.id}
            style={styles.classCard}
            onPress={() => handleClassPress(classItem.id)}
          >
            <View style={styles.classHeader}>
              <Text style={styles.yearText}>{classItem.examYear}</Text>
              <Text style={styles.levelText}>ADVANCED LEVEL</Text>
            </View>
            
            {classItem.imageUrl ? (
              <Image
                source={{ uri: classItem.imageUrl }}
                style={styles.classImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            
            <View style={styles.classInfo}>
              <Text style={styles.subjectText}>{classItem.subject}</Text>
              <Text style={styles.teacherText}>Lecturer: {classItem.teacherName}</Text>
              {classItem.adminSionFee && (
                <Text style={styles.feeText}>{classItem.adminSionFee}/Month</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 16,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 15,
  },
  classCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classHeader: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  levelText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  classImage: {
    width: '100%',
    height: 150,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  classInfo: {
    padding: 15,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  teacherText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  feeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UpcomingClasses;