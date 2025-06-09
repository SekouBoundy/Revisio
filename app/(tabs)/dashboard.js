// app/(tabs)/dashboard.js - ENHANCED MODERN DASHBOARD
import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';
import Mascot from '../../components/Mascot';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Bonjour', emoji: '🌅', color: '#FFD54F' };
    if (hour < 17) return { greeting: 'Bon après-midi', emoji: '☀️', color: '#FF9800' };
    return { greeting: 'Bonsoir', emoji: '🌙', color: '#7986CB' };
  };

  const getStudyStreak = () => {
    // This would come from real data
    return { current: 7, best: 15 };
  };

  const getDailyGoal = () => {
    // This would come from real data  
    return { completed: 2, target: 3 };
  };

  const getRecentActivity = () => {
    // This would come from real data
    return [
      { id: 1, type: 'quiz', title: 'Mathématiques - Fractions', score: 85, time: '2h', icon: 'help-circle', color: theme.primary },
      { id: 2, type: 'course', title: 'Physique - États de la matière', progress: 75, time: '1j', icon: 'book', color: theme.success },
      { id: 3, type: 'achievement', title: 'Série de 7 jours !', badge: '🔥', time: '1j', icon: 'trophy', color: theme.warning }
    ];
  };

  const getWeeklyProgress = () => {
    // Mock weekly data - this would come from real analytics
    return [
      { day: 'L', value: 80, isToday: false },
      { day: 'M', value: 65, isToday: false },
      { day: 'M', value: 90, isToday: false },
      { day: 'J', value: 45, isToday: false },
      { day: 'V', value: 70, isToday: false },
      { day: 'S', value: 30, isToday: false },
      { day: 'D', value: 85, isToday: true }
    ];
  };

  const timeInfo = getTimeBasedGreeting();
  const streak = getStudyStreak();
  const dailyGoal = getDailyGoal();
  const recentActivity = getRecentActivity();
  const weeklyData = getWeeklyProgress();

  // Enhanced Header
  const EnhancedHeader = () => (
    <Animated.View 
      style={[
        styles.header, 
        { 
          backgroundColor: timeInfo.color,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.userInfo}>
            <Text style={[styles.greeting, { color: '#FFFFFF' }]}>
              {timeInfo.greeting} {timeInfo.emoji}
            </Text>
            <Text style={[styles.userName, { color: '#FFFFFF' }]}>
              {user?.name?.split(' ')[0] || 'Étudiant'}
            </Text>
            <Text style={[styles.currentTime, { color: 'rgba(255,255,255,0.8)' }]}>
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => console.log('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  // Stats Overview Card
  const StatsOverview = () => (
    <Animated.View 
      style={[
        styles.statsCard, 
        { 
          backgroundColor: theme.surface,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.statsHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Vue d'ensemble</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="flame" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>{streak.current}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Jours de suite</Text>
          <Text style={[styles.statSubtext, { color: theme.textSecondary }]}>
            Record: {streak.best}
          </Text>
        </View>
        
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: theme.success + '20' }]}>
            <Ionicons name="target" size={20} color={theme.success} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {dailyGoal.completed}/{dailyGoal.target}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Objectif du jour</Text>
          <View style={styles.progressBarMini}>
            <View 
              style={[
                styles.progressFillMini, 
                { 
                  width: `${(dailyGoal.completed / dailyGoal.target) * 100}%`,
                  backgroundColor: theme.success
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: theme.info + '20' }]}>
            <Ionicons name="trending-up" size={20} color={theme.info} />
          </View>
          <Text style={[styles.statValue, { color: theme.text }]}>87%</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Score moyen</Text>
          <Text style={[styles.statSubtext, { color: theme.info }]}>+5% cette semaine</Text>
        </View>
      </View>
    </Animated.View>
  );

  // Weekly Progress Chart
  const WeeklyProgressChart = () => (
    <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
      <Text style={[styles.cardTitle, { color: theme.text }]}>Activité de la semaine</Text>
      <View style={styles.chartContainer}>
        {weeklyData.map((day, index) => (
          <View key={index} style={styles.chartDay}>
            <View style={styles.chartBarContainer}>
              <View 
                style={[
                  styles.chartBar,
                  { 
                    height: `${day.value}%`,
                    backgroundColor: day.isToday ? theme.primary : theme.neutralLight
                  }
                ]}
              />
            </View>
            <Text style={[
              styles.chartDayLabel, 
              { 
                color: day.isToday ? theme.primary : theme.textSecondary,
                fontWeight: day.isToday ? 'bold' : 'normal'
              }
            ]}>
              {day.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Quick Actions Grid
  const QuickActionsGrid = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.primary + '15' }]}
          onPress={() => router.push('/(tabs)/quizzes')}
        >
          <Ionicons name="flash" size={28} color={theme.primary} />
          <Text style={[styles.actionTitle, { color: theme.text }]}>Quiz éclair</Text>
          <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>5 min</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.success + '15' }]}
          onPress={() => router.push('/(tabs)/courses')}
        >
          <Ionicons name="book-outline" size={28} color={theme.success} />
          <Text style={[styles.actionTitle, { color: theme.text }]}>Continuer</Text>
          <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Cours</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.warning + '15' }]}
          onPress={() => router.push('/(tabs)/schedule')}
        >
          <Ionicons name="calendar" size={28} color={theme.warning} />
          <Text style={[styles.actionTitle, { color: theme.text }]}>Planning</Text>
          <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Aujourd'hui</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: theme.info + '15' }]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Ionicons name="person" size={28} color={theme.info} />
          <Text style={[styles.actionTitle, { color: theme.text }]}>Profil</Text>
          <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>Mes stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Recent Activity Feed
  const RecentActivity = () => (
    <View style={[styles.activityCard, { backgroundColor: theme.surface }]}>
      <View style={styles.activityHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Activité récente</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: theme.primary }]}>Tout voir</Text>
        </TouchableOpacity>
      </View>
      
      {recentActivity.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
            <Ionicons name={activity.icon} size={16} color={activity.color} />
          </View>
          
          <View style={styles.activityContent}>
            <Text style={[styles.activityTitle, { color: theme.text }]}>
              {activity.title}
            </Text>
            <View style={styles.activityMeta}>
              {activity.score && (
                <Text style={[styles.activityScore, { color: activity.color }]}>
                  {activity.score}%
                </Text>
              )}
              {activity.progress && (
                <Text style={[styles.activityProgress, { color: activity.color }]}>
                  {activity.progress}% terminé
                </Text>
              )}
              {activity.badge && (
                <Text style={styles.activityBadge}>{activity.badge}</Text>
              )}
              <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
                il y a {activity.time}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  // Welcome Section with Mascot
  const WelcomeSection = () => (
    <View style={[styles.welcomeSection, { backgroundColor: theme.surface }]}>
      <Mascot variant="full" />
      <Text style={[styles.welcomeText, { color: theme.text }]}>
        Prêt pour une nouvelle session d'apprentissage ?
      </Text>
      <TouchableOpacity 
        style={[styles.startButton, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(tabs)/quizzes')}
      >
        <Text style={styles.startButtonText}>Commencer maintenant</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <EnhancedHeader />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatsOverview />
        <WelcomeSection />
        <WeeklyProgressChart />
        <QuickActionsGrid />
        <RecentActivity />
        
        <View style={styles.bottomPadding} />
      </ScrollView>
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
  
  // Enhanced Header
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
  },
  headerLeft: {
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  currentTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Stats Overview
  statsCard: {
    marginTop: -15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 10,
    textAlign: 'center',
  },
  progressBarMini: {
    width: 40,
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFillMini: {
    height: '100%',
    borderRadius: 2,
  },
  
  // Welcome Section
  welcomeSection: {
    marginHorizontal: 20,
    marginBottom: 20,
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
    marginBottom: 20,
    lineHeight: 22,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Weekly Chart
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginTop: 16,
  },
  chartDay: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 12,
    borderRadius: 6,
    minHeight: 4,
  },
  chartDayLabel: {
    fontSize: 12,
  },
  
  // Quick Actions
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 64) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  
  // Recent Activity
  activityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityScore: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityProgress: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityBadge: {
    fontSize: 12,
  },
  activityTime: {
    fontSize: 11,
    marginLeft: 'auto',
  },
  
  bottomPadding: {
    height: 40,
  },
});