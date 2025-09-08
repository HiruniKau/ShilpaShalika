import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for class data
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
 
};

const { width } = Dimensions.get('window');

const UpcomingClasses: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [classes, setClasses] = useState<ClassDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<ClassDetail>>(null);

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

  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (flatListRef.current && classes.length > 0) {
        flatListRef.current.scrollToIndex({
          index: index % classes.length,
          animated: true,
        });
        index++;
      }
    }, 2000); // Scroll every 3 seconds
    return () => clearInterval(interval);
  }, [classes]);

  const handleClassPress = (classId: string) => {
    navigation.navigate('ClassDetails', { classId });
  };

  const renderClassCard = ({ item }: { item: ClassDetail }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => handleClassPress(item.id)}
    >
      
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.classImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      
      <View style={styles.classInfo}>
        <Text style={styles.subjectText}>{item.subject}</Text>
        <Text style={styles.teacherText}>Lecturer: {item.teacherName}</Text>
        {item.adminSionFee && (
          <Text style={styles.feeText}>{item.adminSionFee}/Month</Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
      
      <FlatList
        ref={flatListRef}
        data={classes}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderClassCard}
        keyExtractor={item => item.id}
        snapToInterval={width * 0.7 + 16}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: width * 0.7 + 16,
          offset: (width * 0.7 + 16) * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginBottom:5,
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
    marginBottom: 5,
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
    height: 130,
  },
  imagePlaceholder: {
    width: '100%',
    height: 130,
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
    color: '#1800ad',
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