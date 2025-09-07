import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the type for lecturer data
interface Lecturer {
  id: string;
  lecturerName: string;
  imageUrl: string;
  subject: string;
  email?: string;
  phoneNumber?: string;
  whatsApp?: string;
  description?: string;
}

// Define navigation types
declare type RootStackParamList = {
  LecturerDetails: { lecturerId: string };
  // Add other screen names as needed
};

const { width } = Dimensions.get('window');

const LecturerPanel: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<Lecturer>>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const unsubscribe = firestore()
          .collection("lecturerDetails")
          .onSnapshot(
            (querySnapshot) => {
              const lecturersData: Lecturer[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                lecturersData.push({
                  id: doc.id,
                  lecturerName: data.lecturerName || '',
                  imageUrl: data.imageUrl || '',
                  subject: data.subject || '',
                  email: data.email,
                  phoneNumber: data.phoneNumber,
                  whatsApp: data.whatsApp,
                  description: data.description
                });
              });
              setLecturers(lecturersData);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching lecturers:", error);
              setLoading(false);
            }
          );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (flatListRef.current && lecturers.length > 0) {
        flatListRef.current.scrollToIndex({
          index: index % lecturers.length,
          animated: true,
        });
        index++;
      }
    }, 3000); // Scroll every 3 seconds
    return () => clearInterval(interval);
  }, [lecturers]);

  const handleLecturerPress = (lecturerId: string) => {
    navigation.navigate('LecturerDetails', { lecturerId });
  };

  const renderLecturerCard = ({ item }: { item: Lecturer }) => (
    <TouchableOpacity
      style={styles.lecturerCard}
      onPress={() => handleLecturerPress(item.id)}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.lecturerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading lecturers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        ref={flatListRef}
        data={lecturers}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderLecturerCard}
        keyExtractor={item => item.id}
        snapToInterval={width * 0.5 + 16} // Smaller cards for images only
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: width * 0.5 + 16,
          offset: (width * 0.5 + 16) * index,
          index,
        })}
      />
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
  lecturerCard: {
    width: width * 0.5, // Smaller width for image-only cards
    height: width * 0.5, // Square cards
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lecturerImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LecturerPanel;