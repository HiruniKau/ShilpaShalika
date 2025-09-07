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

// Define the type for lecturer data
interface Lecturer {
  id: string;
  lecturerName: string;
  subject: string;
  imageUrl: string;
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
                  subject: data.subject || '',
                  imageUrl: data.imageUrl || '',
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

  const handleLecturerPress = (lecturerId: string) => {
    navigation.navigate('LecturerDetails', { lecturerId });
  };

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
      <Text style={styles.sectionTitle}>Lecturer Panel</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lecturers.map((lecturer) => (
          <TouchableOpacity
            key={lecturer.id}
            style={styles.lecturerCard}
            onPress={() => handleLecturerPress(lecturer.id)}
          >
            {lecturer.imageUrl ? (
              <Image
                source={{ uri: lecturer.imageUrl }}
                style={styles.lecturerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>No Image</Text>
              </View>
            )}
            
            <View style={styles.lecturerInfo}>
              <Text style={styles.nameText}>{lecturer.lecturerName}</Text>
              <Text style={styles.subjectText}>{lecturer.subject}</Text>
              
              {lecturer.description && (
                <Text 
                  style={styles.descriptionText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {lecturer.description}
                </Text>
              )}
              
              <View style={styles.contactInfo}>
                {lecturer.phoneNumber && (
                  <Text style={styles.contactText}>📞 {lecturer.phoneNumber}</Text>
                )}
                {lecturer.email && (
                  <Text style={styles.contactText}>✉️ {lecturer.email}</Text>
                )}
              </View>
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
  lecturerCard: {
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
  lecturerImage: {
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
  lecturerInfo: {
    padding: 15,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1800ad',
    marginBottom: 5,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    lineHeight: 16,
  },
  contactInfo: {
    marginTop: 5,
  },
  contactText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LecturerPanel;