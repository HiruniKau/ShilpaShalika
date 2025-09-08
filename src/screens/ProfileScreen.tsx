import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  Dimensions,
  ScrollView
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


declare type RootStackParamList = {
  Signin: undefined;
  Home: undefined;
  Classes: undefined;
  Announcements: undefined;
  Profile: undefined;
  PostAd: undefined;
  Terms: undefined;
  Settings: undefined;
  PaymentDetails: undefined;
};

interface Student {
  fullName: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  gender?: string;
  profilePic?: string;
}

const windowWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [student, setStudent] = useState<Student | null>(null);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) {
          setLoading(false);
          return;
        }

        // Use onSnapshot for real-time updates, similar to the original request
        const unsubscribe = firestore().collection("students").doc(uid).onSnapshot(
          (doc) => {
            if (doc.exists()) {
              const data = doc.data() as Student;
              setStudent(data);
              setGender(data.gender || "");
            } else {
              setStudent(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching student data:", error);
            setLoading(false);
            Alert.alert("Error", "Failed to fetch profile data.");
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up Firestore listener:", error);
        setLoading(false);
        Alert.alert("Error", "Could not connect to the database.");
      }
    };

    fetchStudent();
  }, []);

  // Update gender automatically when changed
  const handleUpdateGender = async (text: string) => {
    setGender(text);
    const uid = auth().currentUser?.uid;
    if (!uid) return;
    try {
      await firestore().collection("students").doc(uid).update({
        gender: text,
      });
    } catch (error) {
      console.error("Error updating gender:", error);
      Alert.alert("Error", "Failed to update gender.");
    }
  };

  // Upload profile picture (using local URI)
  const handleUploadProfilePic = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }

      ImagePicker.launchImageLibrary(
        { mediaType: "photo", quality: 0.7 },
        async (response) => {
          if (response.didCancel) return;
          if (response.errorMessage) {
            Alert.alert("Error", response.errorMessage);
            return;
          }

          if (response.assets && response.assets.length > 0) {
            const asset = response.assets[0];
            const uri = asset.uri;

            if (!uri) {
              Alert.alert("Error", "Image URI is not available.");
              return;
            }

            try {
              // This is the key change: we're saving the local URI directly to Firestore.
              await firestore().collection("students").doc(uid).update({
                profilePic: uri,
              });

              setStudent((prev) =>
                prev ? { ...prev, profilePic: uri } : prev
              );
              Alert.alert("Success", "Profile picture updated!");
            } catch (firestoreError) {
              console.error("Firestore Update Error:", firestoreError);
              Alert.alert(
                "Error",
                "An error occurred while updating the profile picture."
              );
            }
          }
        }
      );
    } catch (error) {
      console.error("Error in handleUploadProfilePic:", error);
      Alert.alert("Error", "Could not initiate profile picture upload.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Signin" }],
      });
    } catch (error) {
      Alert.alert("Error", "Logout failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading Profile...</Text>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.center}>
        <Text>No student data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Logo and Hamburger */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/header.png')} // Replace with your logo path
          style={styles.logo}
        />
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatar} onPress={handleUploadProfilePic}>
            {student.profilePic ? (
              <Image
                source={{ uri: student.profilePic }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.plus}>+</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.name}>{student.fullName}</Text>
          <Text style={styles.email}>{student.email}</Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.value}>{student.studentId}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{student.phoneNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Gender</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Gender"
              value={gender}
              onChangeText={handleUpdateGender}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Side Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.sideMenuContainer}>
            <View style={styles.sideMenu}>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeButton}>
                <Icon name="close" size={28} color="#000" />
              </TouchableOpacity>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menu</Text>
              </View>
              {/* Menu items */}
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('PaymentDetails'); setMenuVisible(false); }}>
                <Icon name="credit-card" size={20} color="#1800ad" />
                <Text style={styles.menuItemText}>Payment Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Settings'); setMenuVisible(false); }}>
                <Icon name="cog" size={20} color="#1800ad" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { navigation.navigate('Terms'); setMenuVisible(false); }}>
                <Icon name="file-document" size={20} color="#1800ad" />
                <Text style={styles.menuItemText}>Terms of Use</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10, // Use a value that looks good on both iOS and Android
    paddingBottom: 20,
  },
  logo: {
    width: 250, // Adjust width as needed
    height: 80, // Adjust height as needed
    resizeMode: 'contain',
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    fontSize: 36,
    color: "#555",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  infoCard: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#000",
    marginTop: 3,
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignSelf: "center",
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Add space between icon and text
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // --- Side Menu Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end", // Align the menu to the right
    alignItems: "flex-end",
  },
  sideMenuContainer: {
    width: windowWidth * 0.7, // 70% of screen width
    height: "100%",
    backgroundColor: "#fff",
  },
  sideMenu: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 10,
  },
  menuHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});

export default ProfileScreen;
