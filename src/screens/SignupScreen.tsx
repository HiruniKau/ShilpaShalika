// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const generateStudentId = async () => {
    const snapshot = await firestore()
      .collection('students')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    let lastNumber = 0;
    if (!snapshot.empty) {
      const lastId = snapshot.docs[0].data().studentId;
      const parts = lastId.split('/');
      lastNumber = parseInt(parts[2], 10);
    }
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');
    return `AMD/2025/${newNumber}`;
  };

  const handleSignUp = async () => {
    if (!fullName || !phoneNumber || !email || !password) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      console.log('Creating user in Firebase Auth...');
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      console.log('User created:', userCredential.user.uid);

      const studentId = await generateStudentId();
      console.log('Generated student ID:', studentId);

      await firestore()
        .collection('students')
        .doc(userCredential.user.uid)
        .set({
          fullName,
          phoneNumber,
          email,
          studentId,
          createdAt: firestore.Timestamp.now(),
        });

      console.log('User data saved to Firestore.');

      Alert.alert(
        'Success',
        `Account created!\nYour ID: ${studentId}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Go to MainTabs (Home)
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/logo1.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join our education center today</Text>

      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setHidePassword(!hidePassword)}
          style={styles.eyeIcon}
        >
          <Icon
            name={hidePassword ? 'eye-off' : 'eye'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account?
        <Text
          style={styles.signInText}
          onPress={() => navigation.navigate('Signin')}
        >
          {' '}
          Sign In
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    marginTop:30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1800ad',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: '100%',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: '#1800ad',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  footerText: {
    marginTop: 16,
    color: '#888',
  },
  signInText: {
    color: '#1800ad',
    fontWeight: 'bold',
  },
});
