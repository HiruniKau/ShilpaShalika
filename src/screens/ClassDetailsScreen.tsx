import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import auth from "@react-native-firebase/auth";

// Define navigation types locally
declare type RootStackParamList = {
  ClassDetails: { classId: string };
  // Add other screen names as needed
};

type ClassDetailsRouteProp = RouteProp<RootStackParamList, 'ClassDetails'>;

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

const ClassDetailsScreen: React.FC = () => {
  const route = useRoute<ClassDetailsRouteProp>();
  const { classId } = route.params;
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);
  const [enrollSuccessModalVisible, setEnrollSuccessModalVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("January");

  const years = ["2025", "2026", "2027"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const doc = await firestore()
          .collection("classDetails")
          .doc(classId)
          .get();

        if (doc.exists()) { // Fixed: removed parentheses from doc.exists
          const data = doc.data();
          setClassDetail({
            id: doc.id,
            className: data?.className || '',
            imageUrl: data?.imageUrl || '',
            subject: data?.subject || '',
            teacherName: data?.teacherName || '',
            duration: data?.duration || '',
            examYear: data?.examYear || '',
            medium: data?.medium || '',
            type: data?.type || '',
            admissionFee: data?.admissionFee || '',
            grade: data?.grade
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

  const handleEnrollNow = async () => {
    const user = auth().currentUser;
    if (!user) {
      Alert.alert("Error", "Please sign in to enroll in classes");
      return;
    }

    if (!classDetail) return;

    try {
      // SIMULATED SUCCESS - Without Firestore
      // Show success modal with sample message
      setEnrollSuccessModalVisible(true);
      
    } catch (error) {
      console.error("Error enrolling:", error);
      Alert.alert("Error", "Failed to enroll. Please try again.");
    }
  };

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
      {/* Class Banner */}
      {classDetail.imageUrl ? (
        <Image
          source={{ uri: classDetail.imageUrl }}
          style={styles.classBanner}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.bannerPlaceholder}>
          <Text>No Image Available</Text>
        </View>
      )}

      {/* Class Information */}
      <View style={styles.infoContainer}>
        {/* Class Details - Aligned to left */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>
            {classDetail.teacherName}-{classDetail.subject}-{classDetail.examYear}-{classDetail.type}
          </Text>
          <Text style={styles.durationText}>By {classDetail.teacherName}</Text>
          <Text style={styles.durationText}>{classDetail.duration}</Text>
        </View>

        {/* Special Details */}
        <View style={styles.specialDetails}>
          <Text style={styles.specialTitle}>Special Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exam Year:</Text>
            <Text style={styles.detailValue}>{classDetail.examYear}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Medium:</Text>
            <Text style={styles.detailValue}>{classDetail.medium}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{classDetail.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Admission Fee:</Text>
            <Text style={styles.detailValue}>{classDetail.admissionFee}</Text>
          </View>
        </View>

        {/* Year and Month Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionTitle}>Select Enrollment Period</Text>
          
          <View style={styles.selectionRow}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setYearModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedYear}</Text>
              <Icon name="arrow-drop-down" size={24} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setMonthModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedMonth}</Text>
              <Icon name="arrow-drop-down" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Enroll Now Button */}
        <TouchableOpacity style={styles.enrollButton} onPress={handleEnrollNow}>
          <Text style={styles.enrollButtonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>

      {/* Year Selection Modal */}
      <Modal
        visible={yearModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setYearModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Year</Text>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedYear(year);
                  setYearModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Month Selection Modal */}
      <Modal
        visible={monthModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMonthModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={styles.modalOption}
                onPress={() => {
                  setSelectedMonth(month);
                  setMonthModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Enrollment Success Modal */}
      <Modal
        visible={enrollSuccessModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEnrollSuccessModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <Icon name="check-circle" size={60} color="#4CAF50" style={styles.successIcon} />
            <Text style={styles.successTitle}>Enrollment Successful! </Text>
            <Text style={styles.successMessage}>
              You have successfully enrolled in:
            </Text>
            <Text style={styles.classInfoText}>
               {classDetail.subject}
            </Text>
            <Text style={styles.classInfoText}>
               {classDetail.teacherName}
            </Text>
            <Text style={styles.classInfoText}>
               {selectedYear} {selectedMonth}
            </Text>
            <Text style={styles.classInfoText}>
              {classDetail.duration}
            </Text>
            
            <View style={styles.successDivider} />
            
            <Text style={styles.successNote}>
              Your enrollment has been confirmed. You will receive class materials and schedule soon.
            </Text>
            
            <TouchableOpacity 
              style={styles.successButton}
              onPress={() => setEnrollSuccessModalVisible(false)}
            >
              <Text style={styles.successButtonText}>Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  classBanner: {
    width: "100%",
    height: 200,
  },
  bannerPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  yearText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  levelText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  subjectText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1800ad",
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  teacherSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  teacherLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginRight: 5,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailsSection: {
    marginBottom: 20,
    alignItems: "flex-start",
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
    marginBottom: 5,
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    textAlign: "left",
  },
  specialDetails: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  specialTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  selectionSection: {
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  selectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  enrollButton: {
    backgroundColor: "#1800ad",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  classInfoText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "500",
  },
  successDivider: {
    width: '80%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 15,
  },
  successNote: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  successButton: {
    backgroundColor: "#1800ad",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  successButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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

export default ClassDetailsScreen;