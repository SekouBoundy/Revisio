/**
 * File: app/_tabs/profile/index.js
 * User profile screen with user information and statistics
 */

import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Theme from '../../../constants/Theme';

// Mock achievement data
const ACHIEVEMENTS = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🏆',
    unlocked: true,
    date: '2023-10-15',
  },
  {
    id: '2',
    title: 'Quiz Master',
    description: 'Score 100% on any quiz',
    icon: '🥇',
    unlocked: true,
    date: '2023-10-18',
  },
  {
    id: '3',
    title: 'Study Streak',
    description: 'Study for 7 consecutive days',
    icon: '🔥',
    unlocked: false,
    progress: 3,
    total: 7,
  },
  {
    id: '4',
    title: 'Perfect Week',
    description: 'Complete all assigned activities in a week',
    icon: '⭐',
    unlocked: false,
    progress: 4,
    total: 10,
  },
];

// Mock stats data
const STATS = {
  lessonsCompleted: 12,
  quizzesTaken: 8,
  averageScore: 76,
  totalPoints: 450,
  studyMinutes: 345,
  rank: 'Silver Scholar',
};

// Achievement card component
const AchievementCard = ({ achievement, onPress }) => (
  <TouchableOpacity 
    style={[
      styles.achievementCard,
      !achievement.unlocked && styles.achievementCardLocked
    ]}
    onPress={onPress}
  >
    <View style={styles.achievementIconContainer}>
      <Text style={styles.achievementIcon}>
        {achievement.unlocked ? achievement.icon : '🔒'}
      </Text>
    </View>
    
    <View style={styles.achievementDetails}>
      <Text style={styles.achievementTitle}>{achievement.title}</Text>
      <Text style={styles.achievementDescription}>{achievement.description}</Text>
      
      {achievement.unlocked ? (
        <Text style={styles.achievementDate}>
          Unlocked on {new Date(achievement.date).toLocaleDateString()}
        </Text>
      ) : (
        <View style={styles.achievementProgressContainer}>
          <View style={styles.achievementProgressBar}>
            <View 
              style={[
                styles.achievementProgressFill,
                { width: `${(achievement.progress / achievement.total) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.achievementProgressText}>
            {achievement.progress}/{achievement.total}
          </Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

// Stat item component
const StatItem = ({ label, value, icon }) => (
  <View style={styles.statItem}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync('user_data');
        
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear stored user data
      await SecureStore.deleteItemAsync('user_token');
      await SecureStore.deleteItemAsync('user_data');
      
      // Navigate to login screen
      router.replace('/_auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleViewAchievements = () => {
    router.push('/profile/achievements');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // Get learning type color
  const getLearningTypeColor = () => {
    if (!userData || !userData.learningType) return Theme.colors.primary;
    
    switch (userData.learningType) {
      case 'bac':
        return Theme.colors.bac;
      case 'def':
        return Theme.colors.def;
      case 'languages':
        return Theme.colors.languages;
      default:
        return Theme.colors.primary;
    }
  };

  // Get learning type label
  const getLearningTypeLabel = () => {
    if (!userData || !userData.learningType) return '';
    
    switch (userData.learningType) {
      case 'bac':
        return 'BAC Preparation';
      case 'def':
        return 'DEF Preparation';
      case 'languages':
        return 'Language Learning';
      default:
        return userData.learningType;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView style={styles.scrollView}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileHeaderTop}>
            <View style={[
              styles.avatarContainer,
              { borderColor: getLearningTypeColor() }
            ]}>
              <Text style={styles.avatarText}>
                {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{userData?.name || 'User'}</Text>
          
          <View style={[
            styles.learningTypeBadge,
            { backgroundColor: getLearningTypeColor() }
          ]}>
            <Text style={styles.learningTypeText}>{getLearningTypeLabel()}</Text>
          </View>
          
          <View style={styles.rankContainer}>
            <Text style={styles.rankLabel}>Current Rank</Text>
            <Text style={styles.rankValue}>{STATS.rank}</Text>
            
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsValue}>{STATS.totalPoints} Points</Text>
              <View style={styles.levelProgressContainer}>
                <View style={styles.levelProgressBar}>
                  <View 
                    style={[
                      styles.levelProgressFill,
                      { width: '65%', backgroundColor: getLearningTypeColor() }
                    ]}
                  />
                </View>
                <Text style={styles.levelProgressText}>
                  {50} points to next rank
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Stats section */}
        <Card variant="flat" style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          
          <View style={styles.statsGrid}>
            <StatItem 
              label="Lessons" 
              value={STATS.lessonsCompleted} 
              icon="📚" 
            />
            <StatItem 
              label="Quizzes" 
              value={STATS.quizzesTaken} 
              icon="📝" 
            />
            <StatItem 
              label="Avg. Score" 
              value={`${STATS.averageScore}%`} 
              icon="📊" 
            />
            <StatItem 
              label="Study Time" 
              value={`${Math.floor(STATS.studyMinutes / 60)}h ${STATS.studyMinutes % 60}m`} 
              icon="⏱️" 
            />
          </View>
        </Card>
        
        {/* Achievements section */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <TouchableOpacity onPress={handleViewAchievements}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {ACHIEVEMENTS.slice(0, 2).map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onPress={handleViewAchievements}
            />
          ))}
        </View>
        
        {/* Settings section */}
        <Card variant="outlined" style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingText}>Notifications</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🎯</Text>
            <Text style={styles.settingText}>Study Goals</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>🔒</Text>
            <Text style={styles.settingText}>Privacy & Security</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingIcon}>❓</Text>
            <Text style={styles.settingText}>Help & Support</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </Card>
        
        {/* Logout button */}
        <Button
          variant="outline"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Log Out
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: Theme.layout.spacing.lg,
    paddingTop: 60,
    paddingBottom: Theme.layout.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  profileHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.layout.spacing.md,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: Theme.layout.spacing.sm,
    borderRadius: Theme.layout.borderRadius.medium,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  editButtonText: {
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  userName: {
    fontSize: Theme.layout.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.sm,
  },
  learningTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: 4,
    borderRadius: Theme.layout.borderRadius.small,
    marginBottom: Theme.layout.spacing.md,
  },
  learningTypeText: {
    color: Theme.colors.white,
    fontSize: Theme.layout.fontSize.xs,
    fontWeight: '600',
  },
  rankContainer: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: Theme.layout.spacing.md,
    borderRadius: Theme.layout.borderRadius.medium,
  },
  rankLabel: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  rankValue: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.sm,
  },
  pointsContainer: {
    marginTop: Theme.layout.spacing.xs,
  },
  pointsValue: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '500',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  levelProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    marginRight: Theme.layout.spacing.sm,
  },
  levelProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  levelProgressText: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  statsCard: {
    margin: Theme.layout.spacing.lg,
    marginTop: Theme.layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    padding: Theme.layout.spacing.md,
    backgroundColor: Theme.colors.backgroundPrimary,
    borderRadius: Theme.layout.borderRadius.medium,
    marginBottom: Theme.layout.spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: Theme.layout.spacing.sm,
  },
  statValue: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  achievementsSection: {
    padding: Theme.layout.spacing.lg,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.layout.spacing.md,
  },
  viewAllText: {
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  achievementCard: {
    flexDirection: 'row',
    padding: Theme.layout.spacing.md,
    backgroundColor: Theme.colors.backgroundPrimary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.layout.borderRadius.medium,
    marginBottom: Theme.layout.spacing.md,
  },
  achievementCardLocked: {
    opacity: 0.7,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.layout.spacing.md,
  },
  achievementIcon: {
    fontSize: 20,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  achievementProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  achievementProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: 2,
    marginRight: Theme.layout.spacing.sm,
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  settingsCard: {
    margin: Theme.layout.spacing.lg,
    marginTop: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: Theme.layout.spacing.md,
  },
  settingText: {
    flex: 1,
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textPrimary,
  },
  settingArrow: {
    fontSize: Theme.layout.fontSize.lg,
    color: Theme.colors.textLight,
  },
  logoutButton: {
    margin: Theme.layout.spacing.lg,
    marginTop: 0,
    marginBottom: Theme.layout.spacing.xxl,
  },
});