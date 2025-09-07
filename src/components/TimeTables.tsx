import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";

// Define the type for timetable data
interface Timetable {
  id: string;
  imageUrl: string;
  lecturerName?: string;
  subject?: string;
  // Add other fields as needed from your collection
}

const { width } = Dimensions.get('window');

const Timetable: React.FC = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList<Timetable>>(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const unsubscribe = firestore()
          .collection("timetables")
          .onSnapshot(
            (querySnapshot) => {
              const timetablesData: Timetable[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                timetablesData.push({
                  id: doc.id,
                  imageUrl: data.imageUrl || '',
                  lecturerName: data.lecturerName,
                  subject: data.subject
                  // Add other fields as needed
                });
              });
              setTimetables(timetablesData);
              setLoading(false);
            },
            (error) => {
              console.error("Error fetching timetables:", error);
              setLoading(false);
            }
          );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        setLoading(false);
      }
    };

    fetchTimetables();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (flatListRef.current && timetables.length > 0) {
        flatListRef.current.scrollToIndex({
          index: index % timetables.length,
          animated: true,
        });
        index++;
      }
    }, 3000); // Scroll every 3 seconds
    return () => clearInterval(interval);
  }, [timetables]);

  const handleTimetablePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderTimetableCard = ({ item }: { item: Timetable }) => (
    <TouchableOpacity
      style={styles.timetableCard}
      onPress={() => handleTimetablePress(item.imageUrl)}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.timetableImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Timetable</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading timetables...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        ref={flatListRef}
        data={timetables}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderTimetableCard}
        keyExtractor={item => item.id}
        snapToInterval={width * 0.6 + 16}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: width * 0.6 + 16,
          offset: (width * 0.6 + 16) * index,
          index,
        })}
      />

      {/* Image Popup Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalOverlay} onPress={closeModal} />
          
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
            
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  timetableCard: {
    width: width * 0.6,
    height: width * 0.4, // Wider aspect ratio for timetables
    backgroundColor: '#fff',
    borderColor: '#525252ff',
    borderWidth: 0.5,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timetableImage: {
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
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
});

export default Timetable;