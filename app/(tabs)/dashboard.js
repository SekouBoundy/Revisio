// Example: How to integrate mascot headers into your screens

// app/(tabs)/dashboard.js - EXAMPLE INTEGRATION
import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';
import { DashboardHeader } from '../../components/headers/EnhancedHeaders';
import Mascot from '../../components/Mascot';

export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const handleProfilePress = () => {
    router.push('/profile');
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with Mascot */}
      <DashboardHeader 
        user={user}
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section with Large Mascot */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.surface }]}>
          <Mascot 
            variant="full" 
            size="large"
            showGreeting={true}
            greeting="Prêt à apprendre aujourd'hui ?"
          />
          <Text style={[styles.welcomeText, { color: theme.text }]}>
            Continue ton parcours d'apprentissage !
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Actions rapides
          </Text>
          
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => router.push('/quizzes')}
          >
            <Mascot variant="quizStart" size="small" />
            <Text style={[styles.actionTitle, { color: theme.text }]}>
              Commencer un quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.surface }]}
            onPress={() => router.push('/courses')}
          >
            <Mascot variant="small" size="small" />
            <Text style={[styles.actionTitle, { color: theme.text }]}>
              Parcourir les cours
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// app/(tabs)/courses.js - EXAMPLE INTEGRATION
import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { CoursesHeader } from '../../components/headers/EnhancedHeaders';
import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function CoursesScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearchPress = () => {
    setSearchVisible(!searchVisible);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with Mascot */}
      <CoursesHeader 
        user={user}
        onSearchPress={handleSearchPress}
        onFilterPress={handleFilterPress}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Your courses content here */}
      </ScrollView>
    </SafeAreaView>
  );
}

// app/quiz/[...slug].js - QUIZ SCREEN EXAMPLE
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuizHeader } from '../../components/headers/EnhancedHeaders';
import { ThemeContext } from '../../constants/ThemeContext';
import Mascot from '../../components/Mascot';

export default function QuizScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [quizState, setQuizState] = useState('start'); // 'start', 'progress', 'success', 'fail'
  const [progress, setProgress] = useState(0);

  const quizTitle = params.title || 'Quiz';

  const handleBackPress = () => {
    router.back();
  };

  // Example: Update quiz state based on progress
  useEffect(() => {
    if (progress === 1) {
      setQuizState('success');
    }
  }, [progress]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Dynamic Header with Mascot */}
      <QuizHeader 
        quizTitle={quizTitle}
        progress={progress}
        quizState={quizState}
        onBackPress={handleBackPress}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {quizState === 'start' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot 
              variant="quizStart" 
              size="large" 
              showGreeting={true}
              greeting="Prêt pour le défi ?"
            />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Clique pour commencer !
            </Text>
          </View>
        )}

        {quizState === 'success' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot 
              variant="quizSuccess" 
              size="large" 
              showGreeting={true}
              greeting="Fantastique ! 🎉"
            />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Quiz terminé avec succès !
            </Text>
          </View>
        )}

        {quizState === 'fail' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot 
              variant="quizFail" 
              size="large" 
              showGreeting={true}
              greeting="Ne lâche pas ! 💪"
            />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Réessaie, tu peux y arriver !
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
});