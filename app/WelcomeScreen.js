// app/WelcomeScreen.js

import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../constants/ThemeContext';

export default function WelcomeScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    // After 3 seconds → go to dashboard (change this if needed)
    const timer = setTimeout(() => {
      router.replace('/(tabs)/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require('../assets/icons/app-icon.png')} // your mascot icon
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: theme.primary }]}>
        Bienvenue sur Revisio
      </Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Chargement en cours...
      </Text>
      <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  loader: {
    marginTop: 16,
  },
});
