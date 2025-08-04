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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// The navigation prop type is assumed to be the same as in your SignUpScreen
export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  // Function to handle the sign-in process
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    try {
      console.log('Attempting to sign in user with Firebase...');
      await auth().signInWithEmailAndPassword(email, password);
      console.log('Sign in successful.');

      // On successful sign-in, navigate to the MainTabs screen
      // Using navigation.reset to prevent going back to the sign-in screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      // Display a user-friendly error message
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      }
      Alert.alert('Sign In Failed', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/logo1.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {/* Email input field */}
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

      {/* Password input field with hide/show toggle */}
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

      {/* Forgot password link */}
      <TouchableOpacity
        style={styles.forgotPasswordContainer}
        onPress={() => Alert.alert('Forgot Password', 'Not implemented yet.')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign In button */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Don't have an account link */}
      <Text style={styles.footerText}>
        Don't have an account?
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('Signup')}
        >
          {' '}
          Sign Up
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
    width: 80,
    height: 80,
    marginBottom: 10,
    marginTop: 50,
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
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#1800ad',
    fontWeight: 'bold',
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 16,
    color: '#888',
  },
  signUpText: {
    color: '#1800ad',
    fontWeight: 'bold',
  },
});
