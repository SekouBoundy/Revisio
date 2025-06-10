// app/(tabs)/dashboard.js - ENHANCED VERSION WITH PROMINENT MASCOT WELCOME
import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Animated,
  Image,
  Dimensions
} 
from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

const { width } = Dimensions.get('window');

export default function EnhancedDashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  // const mascotAnim = new Animated.Value(0);
  const mascotAnim = React.useRef(new Animated.Value(1)).current; // start as visible
  const hasAnimatedOnce = React.useRef(false);



useEffect(() => {
  if (!hasAnimatedOnce.current) {
    // Run the animation only once
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    mascotAnim.setValue(0);

    Animated.sequence([
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
      ]),
      Animated.spring(mascotAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start(() => {
      hasAnimatedOnce.current = true; // Mark as done
    });
  }
}, []);


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Calculate days until exams
  const getExamCountdown = () => {
    const examDates = {
      DEF: new Date('2025-06-15'),
      BAC: new Date('2025-06-20'),
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

  // Progress data
  const progressData = {
    weeklyGoal: 20, // hours
    currentWeekStudy: 14, // hours
    monthlyQuizzes: 25,
    currentMonthQuizzes: 18,
    overallProgress: 68, // percentage
    strongSubjects: ['Mathématiques', 'Physique'],
    improvementAreas: ['Français', 'Histoire']
  };

  const upcomingClasses = [
    { subject: 'Mathématiques', time: '08:00', room: 'Salle 101', type: 'Cours', color: '#2196F3' },
    { subject: 'Français', time: '10:00', room: 'Salle 203', type: 'TD', color: '#FF9800' },
    { subject: 'Physique', time: '14:00', room: 'Lab', type: 'TP', color: '#E91E63' },
  ];

  const recentQuizzes = [
    { subject: 'Physique', score: 85, date: '2025-06-08', trend: 'up', color: '#E91E63' },
    { subject: 'Histoire', score: 72, date: '2025-06-07', trend: 'down', color: '#9C27B0' },
    { subject: 'Mathématiques', score: 92, date: '2025-06-06', trend: 'up', color: '#2196F3' },
  ];

  // Enhanced Header Component
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
      {daysUntilExam > 0 && (
        <View style={[styles.examCountdown, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
          <Ionicons name="calendar" size={20} color="#FFFFFF" />
          <Text style={[styles.examCountdownText, { color: '#FFFFFF' }]}>
            {daysUntilExam} jours avant l'examen {user?.level}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF99" />
        </View>
      )}
    </View>
  );

  // Big Mascot Welcome Section
const MascotWelcomeSection = () => {
  const Wrapper = hasAnimatedOnce.current ? View : Animated.View;

  return (
    <Wrapper style={[
      styles.mascotWelcomeContainer,
      !hasAnimatedOnce.current && {
        opacity: mascotAnim,
        transform: [{
          scale: mascotAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        }]
      }
    ]}>
      <View style={[styles.mascotWelcomeCard, { backgroundColor: theme.surface }]}>
        <View style={styles.mascotContainer}>
          <Image 
            source={require('../../assets/mascots/mascot-welcome.png')}
            style={styles.bigMascot}
            resizeMode="contain"
          />
          {/* Floating animation elements */}
          <View style={[styles.floatingElement, styles.star1]}>
            <Text style={styles.floatingEmoji}>⭐</Text>
          </View>
          <View style={[styles.floatingElement, styles.star2]}>
            <Text style={styles.floatingEmoji}>🎯</Text>
          </View>
          <View style={[styles.floatingElement, styles.star3]}>
            <Text style={styles.floatingEmoji}>📚</Text>
          </View>
        </View>
        
        <View style={styles.mascotWelcomeContent}>
          <Text style={[styles.mascotWelcomeTitle, { color: theme.text }]}>
            Prêt à apprendre ?
          </Text>
          <Text style={[styles.mascotWelcomeSubtitle, { color: theme.textSecondary }]}>
            Continuons ensemble ton parcours d'apprentissage ! 🚀
          </Text>
          
          {/* Quick motivation stats */}
          <View style={styles.motivationStats}>
            <View style={[styles.motivationStat, { backgroundColor: theme.success + '15' }]}>
              <Text style={[styles.motivationStatNumber, { color: theme.success }]}>
                {stats.studyStreak}
              </Text>
              <Text style={[styles.motivationStatLabel, { color: theme.success }]}>
                jours de suite
              </Text>
            </View>
            <View style={[styles.motivationStat, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.motivationStatNumber, { color: theme.primary }]}>
                {stats.averageScore}%
              </Text>
              <Text style={[styles.motivationStatLabel, { color: theme.primary }]}>
                moyenne
              </Text>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity 
            style={[styles.startLearningButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/quizzes')}
          >
            <Ionicons name="play-circle" size={20} color="#FFFFFF" />
            <Text style={styles.startLearningText}>Commencer à apprendre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Wrapper>
  );
};

  // Enhanced Stats Card Component
  const StatsCard = ({ icon, title, value, subtitle, color, trend, onPress }) => (
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
      {trend && (
        <View style={styles.statsTrend}>
          <Ionicons 
            name={trend === 'up' ? 'trending-up' : 'trending-down'} 
            size={12} 
            color={trend === 'up' ? theme.success : theme.error} 
          />
        </View>
      )}
    </TouchableOpacity>
  );

  // Enhanced Quick Action Component
  const QuickAction = ({ icon, title, color, subtitle, onPress }) => (
    <TouchableOpacity 
      style={[styles.quickAction, { backgroundColor: color + '10' }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={[styles.quickActionTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.quickActionSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={color} />
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
        {/* Big Mascot Welcome Section */}
        <MascotWelcomeSection />

        {/* Enhanced Stats Overview */}
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Aperçu de tes progrès
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Détails →
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <StatsCard
              icon="school"
              title="Cours complétés"
              value={`${stats.coursesCompleted}/${stats.totalCourses}`}
              subtitle={`${Math.round((stats.coursesCompleted/stats.totalCourses)*100)}% terminé`}
              color={theme.primary}
              trend="up"
              onPress={() => router.push('/courses')}
            />
            <StatsCard
              icon="help-circle"
              title="Quiz réalisés"
              value={stats.quizzesCompleted}
              subtitle={`Moyenne: ${stats.averageScore}%`}
              color={theme.success}
              trend="up"
              onPress={() => router.push('/quizzes')}
            />
            <StatsCard
              icon="flame"
              title="Série active"
              value={`${stats.studyStreak} jours`}
              subtitle="Continue comme ça !"
              color={theme.warning}
              trend="up"
            />
            <StatsCard
              icon="time"
              title="Temps d'étude"
              value={`${Math.floor(stats.totalStudyTime/60)}h ${stats.totalStudyTime%60}min`}
              subtitle="Cette semaine"
              color={theme.info}
            />
          </View>
        </Animated.View>

        {/* Enhanced Quick Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Actions rapides
            </Text>
          </View>
          <View style={styles.quickActionsContainer}>
            <QuickAction
              icon="play-circle"
              title="Quiz rapide"
              subtitle="Teste tes connaissances"
              color={theme.success}
              onPress={() => router.push('/quizzes')}
            />
            <QuickAction
              icon="book-outline"
              title="Cours du jour"
              subtitle="Voir ton planning"
              color={theme.primary}
              onPress={() => router.push('/schedule')}
            />
            <QuickAction
              icon="trophy-outline"
              title="Défis"
              subtitle="Nouveaux challenges"
              color={theme.warning}
              onPress={() => {}}
            />
            <QuickAction
              icon="analytics-outline"
              title="Mes progrès"
              subtitle="Statistiques détaillées"
              color={theme.info}
              onPress={() => router.push('/profile')}
            />
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Aujourd'hui à ton programme
            </Text>
            <TouchableOpacity onPress={() => router.push('/schedule')}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Planning complet →
              </Text>
            </TouchableOpacity>
          </View>
          
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.classItem, { backgroundColor: theme.surface }]}
                onPress={() => router.push('/schedule')}
              >
                <View style={[styles.classTimeContainer, { backgroundColor: classItem.color + '15' }]}>
                  <Text style={[styles.classTimeText, { color: classItem.color }]}>
                    {classItem.time}
                  </Text>
                </View>
                <View style={styles.classInfo}>
                  <Text style={[styles.classSubject, { color: theme.text }]}>
                    {classItem.subject}
                  </Text>
                  <View style={styles.classMetaContainer}>
                    <View style={styles.classDetailItem}>
                      <Ionicons name="location-outline" size={12} color={theme.textSecondary} />
                      <Text style={[styles.classDetails, { color: theme.textSecondary }]}>
                        {classItem.room}
                      </Text>
                    </View>
                    <View style={[styles.classTypeBadge, { backgroundColor: classItem.color + '20' }]}>
                      <Text style={[styles.classType, { color: classItem.color }]}>
                        {classItem.type}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar-outline" size={32} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Aucun cours aujourd'hui
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
                Profite de cette journée libre !
              </Text>
            </View>
          )}
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
            <TouchableOpacity 
              key={index} 
              style={[styles.activityItem, { backgroundColor: theme.surface }]}
              onPress={() => router.push('/quizzes')}
            >
              <View style={[styles.activityIcon, { backgroundColor: quiz.color + '20' }]}>
                <Ionicons name="document-text" size={20} color={quiz.color} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: theme.text }]}>
                  Quiz {quiz.subject}
                </Text>
                <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
                  {new Date(quiz.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </View>
              <View style={styles.activityScore}>
                <Text style={[
                  styles.activityScoreText, 
                  { color: quiz.score >= 80 ? theme.success : quiz.score >= 60 ? theme.warning : theme.error }
                ]}>
                  {quiz.score}%
                </Text>
                <View style={[
                  styles.trendBadge,
                  { backgroundColor: quiz.trend === 'up' ? theme.success + '20' : theme.error + '20' }
                ]}>
                  <Ionicons 
                    name={quiz.trend === 'up' ? 'trending-up' : 'trending-down'} 
                    size={12} 
                    color={quiz.trend === 'up' ? theme.success : theme.error} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Motivational Quote */}
        <View style={[styles.quoteCard, { backgroundColor: theme.primary + '10' }]}>
          <View style={[styles.quoteIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="bulb" size={24} color={theme.primary} />
          </View>
          <View style={styles.quoteContent}>
            <Text style={[styles.quoteText, { color: theme.text }]}>
              "Le succès est la somme de petits efforts répétés jour après jour."
            </Text>
            <Text style={[styles.quoteAuthor, { color: theme.textSecondary }]}>
              - Robert Collier
            </Text>
          </View>
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
    flex: 1,
  },

  // Big Mascot Welcome Section
  mascotWelcomeContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mascotWelcomeCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  bigMascot: {
    width: width * 0.4,
    height: width * 0.4,
    maxWidth: 200,
    maxHeight: 200,
  },
  floatingElement: {
    position: 'absolute',
  },
  star1: {
    top: 20,
    right: 20,
  },
  star2: {
    top: 60,
    left: 10,
  },
  star3: {
    bottom: 30,
    right: 30,
  },
  floatingEmoji: {
    fontSize: 20,
  },
  mascotWelcomeContent: {
    alignItems: 'center',
  },
  mascotWelcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  mascotWelcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  motivationStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  motivationStat: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  motivationStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  motivationStatLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  startLearningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
  },
  startLearningText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Enhanced Stats Section
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    position: 'relative',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsSubtitle: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  statsTrend: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Enhanced Quick Actions
  quickActionsContainer: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
  },

  // Enhanced Class Items
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
  classTimeContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  classTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  classMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  classDetails: {
    fontSize: 12,
  },
  classTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  classType: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
  },

  // Enhanced Activity Items
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
    width: 44,
    height: 44,
    borderRadius: 22,
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
    textTransform: 'capitalize',
  },
  activityScore: {
    alignItems: 'center',
    gap: 4,
  },
  activityScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  trendBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Enhanced Quote Card
  quoteCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContent: {
    flex: 1,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});