// src/components/Header.tsx

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
    backgroundColor: '#fff', 
  },
  logo: {
    width: 250,
    height: 80,
    marginRight: 10,
  },
});