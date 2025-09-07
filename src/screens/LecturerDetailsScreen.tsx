import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // For WhatsApp icon

// Define navigation types locally (or import from your navigation file)
declare type RootStackParamList = {
  LecturerDetails: { lecturerId: string };
  // Add other screen names as needed
  Home: undefined;
  Profile: undefined;
  Signin: undefined;
  Classes: undefined;
  Announcements: undefined;
  PostAd: undefined;
  Terms: undefined;
  Settings: undefined;
  Notifications: undefined;
  PaymentDetails: undefined;
  ClassDetails: { classId: string };
};

// Define the type for route params
type LecturerDetailsRouteProp = RouteProp<RootStackParamList, 'LecturerDetails'>;

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

const LecturerDetailsScreen: React.FC = () => {
  const route = useRoute<LecturerDetailsRouteProp>();
  const { lecturerId } = route.params;
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecturerDetails = async () => {
      try {
        const doc = await firestore()
          .collection("lecturerDetails")
          .doc(lecturerId)
          .get();

        if (doc.exists()) { // Fixed: removed parentheses from doc.exists()
          const data = doc.data();
          setLecturer({
            id: doc.id,
            lecturerName: data?.lecturerName || '',
            subject: data?.subject || '',
            imageUrl: data?.imageUrl || '',
            email: data?.email,
            phoneNumber: data?.phoneNumber,
            whatsApp: data?.whatsApp,
            description: data?.description
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lecturer details:", error);
        setLoading(false);
      }
    };

    fetchLecturerDetails();
  }, [lecturerId]);

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (whatsAppNumber: string) => {
    // Remove any non-digit characters from the number
    const cleanNumber = whatsAppNumber.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${cleanNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading lecturer details...</Text>
      </View>
    );
  }

  if (!lecturer) {
    return (
      <View style={styles.center}>
        <Text>Lecturer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Lecturer Image */}
      {lecturer.imageUrl ? (
        <Image
          source={{ uri: lecturer.imageUrl }}
          style={styles.lecturerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image Available</Text>
        </View>
      )}

      {/* Lecturer Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>{lecturer.lecturerName}</Text>
        <Text style={styles.subjectText}>{lecturer.subject}</Text>
        
        {lecturer.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{lecturer.description}</Text>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          
          {lecturer.phoneNumber && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handlePhoneCall(lecturer.phoneNumber!)}
            >
              <Icon name="phone" size={24} color="#007bff" />
              <Text style={styles.contactText}>{lecturer.phoneNumber}</Text>
            </TouchableOpacity>
          )}

          {lecturer.whatsApp && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleWhatsApp(lecturer.whatsApp!)}
            >
              <FontAwesome name="whatsapp" size={24} color="#25D366" />
              <Text style={styles.contactText}>{lecturer.whatsApp}</Text>
            </TouchableOpacity>
          )}

          {lecturer.email && (
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleEmail(lecturer.email!)}
            >
              <Icon name="email" size={24} color="#007bff" />
              <Text style={styles.contactText}>{lecturer.email}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  lecturerImage: {
    width: "100%",
    height: 250,
  },
  imagePlaceholder: {
    width: "100%",
    height: 250,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subjectText: {
    fontSize: 18,
    color: "#007bff",
    marginBottom: 20,
    fontWeight: "600",
  },
  descriptionContainer: {
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 5,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default LecturerDetailsScreen;