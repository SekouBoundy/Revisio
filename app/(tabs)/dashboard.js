// app/(tabs)/dashboard.js - ENHANCED VERSION
import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function EnhancedDashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bonjour');
    else if (hour < 18) setGreeting('Bon après-midi');
    else setGreeting('Bonsoir');

    // Animate entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Calculate days until exams
  const getExamCountdown = () => {
    const examDates = {
      DEF: new Date('2025-06-15'), // Example DEF exam date
      BAC: new Date('2025-06-20'), // Example BAC exam date
    };
    
    const today = new Date();
    const examDate = user?.level === 'DEF' ? examDates.DEF : examDates.BAC;
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    
    return daysLeft > 0 ? daysLeft : 0;
  };

  const daysUntilExam = getExamCountdown();

  // Mock data for demonstration
  const stats = {
    coursesCompleted: 12,
    totalCourses: 24,
    quizzesCompleted: 45,
    averageScore: 78,
    studyStreak: 5,
    totalStudyTime: 1240, // minutes
  };

  const upcomingClasses = [
    { subject: 'Mathématiques', time: '08:00', room: 'Salle 101', type: 'Cours' },
    { subject: 'Français', time: '10:00', room: 'Salle 203', type: 'TD' },
  ];

  const recentQuizzes = [
    { subject: 'Physique', score: 85, date: '2025-06-08', trend: 'up' },
    { subject: 'Histoire', score: 72, date: '2025-06-07', trend: 'down' },
  ];

  // Header Component
  const DashboardHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerGreeting, { color: '#FFFFFF99' }]}>
            {greeting},
          </Text>
          <Text style={[styles.headerName, { color: '#FFFFFF' }]}>
            {user?.name || 'Étudiant'} 👋
          </Text>
          <Text style={[styles.headerLevel, { color: '#FFFFFF99' }]}>
            Niveau {user?.level || 'DEF'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-circle" size={40} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Exam Countdown Banner */}
      <View style={[styles.examCountdown, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
        <Ionicons name="calendar" size={20} color="#FFFFFF" />
        <Text style={[styles.examCountdownText, { color: '#FFFFFF' }]}>
          {daysUntilExam > 0 
            ? `${daysUntilExam} jours avant l'examen ${user?.level}` 
            : "C'est le jour J ! Bonne chance !"}
        </Text>
      </View>
    </View>
  );

  // Stats Card Component
  const StatsCard = ({ icon, title, value, subtitle, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.statsCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statsValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statsTitle, { color: theme.textSecondary }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statsSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );

  // Quick Action Component
  const QuickAction = ({ icon, title, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.quickAction, { backgroundColor: color + '15' }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <Text style={[styles.quickActionText, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <DashboardHeader />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
          />
        }
      >
        {/* Stats Overview */}
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.statsGrid}>
            <StatsCard
              icon="school"
              title="Cours"
              value={`${stats.coursesCompleted}/${stats.totalCourses}`}
              subtitle={`${Math.round((stats.coursesCompleted/stats.totalCourses)*100)}% complété`}
              color={theme.primary}
              onPress={() => router.push('/courses')}
            />
            <StatsCard
              icon="help-circle"
              title="Quiz"
              value={stats.quizzesCompleted}
              subtitle={`Moy: ${stats.averageScore}%`}
              color={theme.success}
              onPress={() => router.push('/quizzes')}
            />
            <StatsCard
              icon="flame"
              title="Série"
              value={`${stats.studyStreak} jours`}
              subtitle="Continue !"
              color={theme.warning}
            />
            <StatsCard
              icon="time"
              title="Temps"
              value={`${Math.floor(stats.totalStudyTime/60)}h`}
              subtitle="Cette semaine"
              color={theme.info}
            />
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions rapides</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="play-circle"
              title="Quiz rapide"
              color={theme.success}
              onPress={() => router.push('/quizzes')}
            />
            <QuickAction
              icon="book"
              title="Cours du jour"
              color={theme.primary}
              onPress={() => router.push('/schedule')}
            />
            <QuickAction
              icon="trophy"
              title="Défis"
              color={theme.warning}
              onPress={() => {}}
            />
            <QuickAction
              icon="stats-chart"
              title="Progrès"
              color={theme.info}
              onPress={() => router.push('/profile')}
            />
          </View>
        </View>

        {/* Today's Schedule Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Aujourd'hui
            </Text>
            <TouchableOpacity onPress={() => router.push('/schedule')}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Voir tout →
              </Text>
            </TouchableOpacity>
          </View>
          
          {upcomingClasses.map((classItem, index) => (
            <View 
              key={index} 
              style={[styles.classItem, { backgroundColor: theme.surface }]}
            >
              <View style={styles.classTime}>
                <Text style={[styles.classTimeText, { color: theme.primary }]}>
                  {classItem.time}
                </Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={[styles.classSubject, { color: theme.text }]}>
                  {classItem.subject}
                </Text>
                <Text style={[styles.classDetails, { color: theme.textSecondary }]}>
                  {classItem.room} • {classItem.type}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Activité récente
            </Text>
            <TouchableOpacity onPress={() => router.push('/quizzes')}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Historique →
              </Text>
            </TouchableOpacity>
          </View>
          
          {recentQuizzes.map((quiz, index) => (
            <View 
              key={index} 
              style={[styles.activityItem, { backgroundColor: theme.surface }]}
            >
              <View style={[styles.activityIcon, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name="document-text" size={20} color={theme.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: theme.text }]}>
                  Quiz {quiz.subject}
                </Text>
                <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
                  {quiz.date}
                </Text>
              </View>
              <View style={styles.activityScore}>
                <Text style={[
                  styles.activityScoreText, 
                  { color: quiz.score >= 70 ? theme.success : theme.warning }
                ]}>
                  {quiz.score}%
                </Text>
                <Ionicons 
                  name={quiz.trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={16} 
                  color={quiz.trend === 'up' ? theme.success : theme.error} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Motivational Quote */}
        <View style={[styles.quoteCard, { backgroundColor: theme.primary + '10' }]}>
          <Ionicons name="bulb" size={24} color={theme.primary} />
          <Text style={[styles.quoteText, { color: theme.text }]}>
            "Le succès est la somme de petits efforts répétés jour après jour."
          </Text>
          <Text style={[styles.quoteAuthor, { color: theme.textSecondary }]}>
            - Robert Collier
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  headerLevel: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examCountdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  examCountdownText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  classTime: {
    marginRight: 16,
  },
  classTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
  },
  activityScore: {
    alignItems: 'center',
  },
  activityScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  quoteCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});