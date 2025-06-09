// app/(tabs)/dashboard.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MascotAnimated from '../../components/MascotAnimated';
import Button from '../../components/Button';
import { ThemeContext } from '../../constants/ThemeContext';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <MascotAnimated
          // source={require('../../assets/mascots/mascot-welcome.png')}
          source={require('../../assets/mascots/mascot-welcome.png')}

          style={styles.mascot}
        />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Welcome to Revisio!
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ready to start learning?
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Start Quiz"
          onPress={() => router.push('/quizzes')}
        />
        <Button
          title="View Courses"
          onPress={() => router.push('/courses')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mascot: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  buttonsContainer: {
    marginTop: 24,
  },
});
