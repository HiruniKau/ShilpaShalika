// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import SigninScreen from '../screens/SigninScreen';
import SignUpScreen from '../screens/SignupScreen';
import MainTabs from './MainTabs';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import PaymentDetailsScreen from '../screens/PaymentDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TermsOfUseScreen from '../screens/TermsofUse';
import NotificationScreen from '../screens/NotificationsScreen';
import ClassDetailsScreen from '../screens/ClassDetailsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Splash: undefined;
  Signin: undefined;
  Signup: undefined;
  SearchResults: undefined;
  Home: undefined; 
  Profile: undefined; 
  PostAd: undefined; 
  Terms: undefined; 
  Settings: undefined; 
  Notifications: undefined;
  PaymentDetails: undefined;
  ClassDetails: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Terms" component={TermsOfUseScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="ClassDetails" component={ClassDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
