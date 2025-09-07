// src/components/Header.tsx
// This will contain the app logo and name.
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={headerStyles.container}>
      <Image source={require('../assets/images/header.png')} style={headerStyles.logo} />
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // Or a different color based on your design
  },
  logo: {
    width: 250,
    height: 80,
    marginRight: 10,
  },
});