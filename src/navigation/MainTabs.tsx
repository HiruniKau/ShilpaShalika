// src/navigation/MainTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ClassScreen from '../screens/ClassScreen';
import AnnouncementScreen from '../screens/AnnouncementScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';



const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#1800ad', 
      tabBarInactiveTintColor: 'gray', 
      tabBarStyle: {
        backgroundColor: 'white',
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="home" size={24} color={color} />, 
      }}
    />
    <Tab.Screen
      name="Classes"
      component={ClassScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="list-alt" size={24} color={color} />, 
      }}
    />
    <Tab.Screen
      name="Announcements"
      component={AnnouncementScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="campaign" size={24} color={color} />, 
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color }) => <Icon name="person" size={24} color={color} />, 
      }}
    />
  </Tab.Navigator>
);

export default MainTabs;
