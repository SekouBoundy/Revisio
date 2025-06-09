// app/WelcomeScreen.js - FIXED VERSION

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../constants/ThemeContext';
import Mascot from '../components/Mascot';

export default function WelcomeScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  useEffect(() => {
    // After 2 seconds → go to dashboard
    const timer = setTimeout(() => {
      router.replace('/(tabs)/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Use the Mascot component instead of Image */}
      <Mascot variant="full" />
      
      <Text style={[styles.title, { color: theme.primary }]}>
        Apprends avec moi !
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 16,
  },
});