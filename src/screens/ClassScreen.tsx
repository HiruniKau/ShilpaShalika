// src/screens/ClassScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClassScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>This is the Class Screen</Text>
  </View>
);

export default ClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
