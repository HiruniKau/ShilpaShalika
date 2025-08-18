// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
// import storage from "@react-native-firebase/storage"; // Not needed for this approach
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "react-native-image-picker";

interface Student {
  fullName: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  gender?: string;
  profilePic?: string;
}

const ProfileScreen = ({ navigation }: any) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) return;

        const doc = await firestore().collection("students").doc(uid).get();
        if (doc.exists()) {
          const data = doc.data() as Student;
          setStudent(data);
          setGender(data.gender || "");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  // Update gender automatically when changed
  useEffect(() => {
    const updateGender = async () => {
      try {
        const uid = auth().currentUser?.uid;
        if (!uid) return;
        if (gender.trim() === "") return;

        await firestore().collection("students").doc(uid).update({
          gender: gender,
        });

        setStudent((prev) => (prev ? { ...prev, gender } : prev));
      } catch (error) {
        console.error("Error updating gender:", error);
      }
    };

    if (student) {
      updateGender();
    }
  }, [gender]);

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
          if (response.didCancel) {
            console.log("User cancelled image picker");
            return;
          }
          if (response.errorMessage) {
            console.log("ImagePicker Error: ", response.errorMessage);
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
      {/* Header with Hamburger */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.avatar} onPress={handleUploadProfilePic}>
          {student.profilePic ? (
            <Image
              source={{ uri: student.profilePic }}
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.plus}>+</Text>
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
            onChangeText={setGender}
          />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>⏻ Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
