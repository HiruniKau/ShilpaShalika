import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Define the type for your navigation parameters
declare type RootStackParamList = {
  ClassDetails: { classId: string };
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
  // Add other screens as needed
};

// Define the type for route params
type ClassDetailsRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

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

const ClassDetailsScreen: React.FC = () => {
  const route = useRoute<ClassDetailsRouteProp>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { classId } = route.params;
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const doc = await firestore()
          .collection("classDetails")
          .doc(classId)
          .get();

        if (doc.exists()) {
          const data = doc.data();
          setClassDetail({
            id: doc.id,
            className: data?.className || '',
            imageUrl: data?.imageUrl || '',
            examYear: data?.examYear || '',
            subject: data?.subject || '',
            teacherName: data?.teacherName || '',
            adminSionFee: data?.adminSionFee,
            duration: data?.duration,
            medium: data?.medium,
            type: data?.type
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching class details:", error);
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading class details...</Text>
      </View>
    );
  }

  if (!classDetail) {
    return (
      <View style={styles.center}>
        <Text>Class not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class Details</Text>
        <View style={{ width: 24 }} /> {/* Spacer for balance */}
      </View>

      {/* Class Image */}
      {classDetail.imageUrl ? (
        <Image
          source={{ uri: classDetail.imageUrl }}
          style={styles.classImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No Image Available</Text>
        </View>
      )}

      {/* Class Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.className}>{classDetail.className}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>{classDetail.examYear}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{classDetail.subject}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Lecturer:</Text>
          <Text style={styles.value}>{classDetail.teacherName}</Text>
        </View>

        {classDetail.duration && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>{classDetail.duration}</Text>
          </View>
        )}

        {classDetail.medium && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Medium:</Text>
            <Text style={styles.value}>{classDetail.medium}</Text>
          </View>
        )}

        {classDetail.type && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>{classDetail.type}</Text>
          </View>
        )}

        {classDetail.adminSionFee && (
          <View style={styles.feeContainer}>
            <Text style={styles.feeLabel}>Monthly Fee:</Text>
            <Text style={styles.feeAmount}>{classDetail.adminSionFee}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classImage: {
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
  className: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  feeContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007bff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ClassDetailsScreen;