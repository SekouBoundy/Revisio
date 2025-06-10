// app/(tabs)/dashboard.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContext';
import { UserContext } from '../../constants/UserContext';


import { useRouter } from 'expo-router';
// import MascotAnimated from '../../components/MascotAnimated'; // Uncomment when mascot is ready
import Button from '../../components/Button';

export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  // Example XP progress (for demo)
  const xpProgress = 0.65; // 65%

  // Example quote (can randomize or update later)
  const quote = "Success is the sum of small efforts, repeated day in and day out. – Robert Collier";

  // Example last quiz score (demo data)
  const lastQuiz = {
    subject: "Math",
    score: 8,
    total: 10,
    date: "2025-06-09"
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        {/* <MascotAnimated
          source={require('../../assets/mascots/mascot-welcome.png')}
          style={styles.mascot}
        /> */}
        <Text style={[styles.greeting, { color: theme.textPrimary }]}>
          Hello{user?.name ? `, ${user.name}` : ''} 👋
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Keep up the good work!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Your XP Progress</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${xpProgress * 100}%`, backgroundColor: theme.primary }]} />
        </View>
        <Text style={[styles.xpLabel, { color: theme.textSecondary }]}>{Math.round(xpProgress * 100)}% to next level</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Last Quiz</Text>
        <View style={styles.quizBox}>
          <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>
            {lastQuiz.subject} — {lastQuiz.score}/{lastQuiz.total}
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
            Taken: {lastQuiz.date}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Button
          title="Start New Quiz"
          onPress={() => router.push('/quizzes')}
        />
        <Button
          title="View Courses"
          onPress={() => router.push('/courses')}
        />
        <Button
          title="View Schedule"
          onPress={() => router.push('/schedule')}
        />
      </View>

      <View style={styles.quoteSection}>
        <Text style={[styles.quoteText, { color: theme.textSecondary }]}>
          "{quote}"
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mascot: {
    width: 110,
    height: 110,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center',
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBarBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 8,
  },
  xpLabel: {
    fontSize: 12,
    textAlign: 'right',
  },
  quizBox: {
    padding: 12,
    backgroundColor: '#f9fafd',
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'flex-start',
  },
  quoteSection: {
    marginTop: 28,
    paddingHorizontal: 10,
  },
  quoteText: {
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
  },
});

