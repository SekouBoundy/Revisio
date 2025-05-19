/**
 * File: app/_tabs/profile/achievements.js
 * Achievements screen showing user's earned and locked achievements
 */

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/common/Header';
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
  {
    id: '5',
    title: 'Math Whiz',
    description: 'Complete the entire Mathematics course',
    icon: '🧮',
    unlocked: false,
    progress: 5,
    total: 24,
  },
  {
    id: '6',
    title: 'Language Explorer',
    description: 'Complete lessons in both English and Arabic',
    icon: '🌍',
    unlocked: true,
    date: '2023-11-05',
  },
  {
    id: '7',
    title: 'Quick Learner',
    description: 'Complete 5 lessons in a single day',
    icon: '⚡',
    unlocked: true,
    date: '2023-10-30',
  },
  {
    id: '8',
    title: 'Knowledge Seeker',
    description: 'Score above 80% in 10 different quizzes',
    icon: '🔍',
    unlocked: false,
    progress: 6,
    total: 10,
  },
  {
    id: '9',
    title: 'Persistent Scholar',
    description: 'Study for 30 consecutive days',
    icon: '📚',
    unlocked: false,
    progress: 3,
    total: 30,
  },
  {
    id: '10',
    title: 'Top of the Class',
    description: 'Achieve the Gold Scholar rank',
    icon: '👑',
    unlocked: false,
    progress: 450,
    total: 1000,
  },
];

// Achievement card component
const AchievementCard = ({ achievement }) => (
  <View 
    style={[
      styles.achievementCard,
      !achievement.unlocked && styles.achievementCardLocked
    ]}
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
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(achievement.progress / achievement.total) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.total}
          </Text>
        </View>
      )}
    </View>
  </View>
);

// Achievement filter button
const FilterButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      active && styles.filterButtonActive
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        active && styles.filterButtonTextActive
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default function AchievementsScreen() {
  const [filter, setFilter] = useState('all');
  
  // Get filtered achievements
  const getFilteredAchievements = () => {
    switch (filter) {
      case 'unlocked':
        return ACHIEVEMENTS.filter(achievement => achievement.unlocked);
      case 'locked':
        return ACHIEVEMENTS.filter(achievement => !achievement.unlocked);
      default:
        return ACHIEVEMENTS;
    }
  };

  const filteredAchievements = getFilteredAchievements();
  
  // Calculate progress stats
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const progressPercentage = Math.round((unlockedAchievements / totalAchievements) * 100);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header
        title="Achievements"
        showBack={true}
      />
      
      <View style={styles.progressSection}>
        <Text style={styles.progressSectionTitle}>Your Progress</Text>
        
        <View style={styles.progressStatsContainer}>
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>{unlockedAchievements}</Text>
            <Text style={styles.progressStatLabel}>Unlocked</Text>
          </View>
          
          <View style={styles.overallProgressContainer}>
            <View style={styles.overallProgressBar}>
              <View 
                style={[
                  styles.overallProgressFill,
                  { width: `${progressPercentage}%` }
                ]}
              />
            </View>
            <Text style={styles.overallProgressText}>{progressPercentage}% Complete</Text>
          </View>
          
          <View style={styles.progressStat}>
            <Text style={styles.progressStatValue}>{totalAchievements - unlockedAchievements}</Text>
            <Text style={styles.progressStatLabel}>Locked</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <FilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          label="Unlocked"
          active={filter === 'unlocked'}
          onPress={() => setFilter('unlocked')}
        />
        <FilterButton
          label="In Progress"
          active={filter === 'locked'}
          onPress={() => setFilter('locked')}
        />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
        
        {filteredAchievements.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No achievements found</Text>
            <Text style={styles.emptySubText}>
              {filter === 'unlocked' 
                ? "You haven't unlocked any achievements yet. Keep learning to earn them!" 
                : filter === 'locked'
                ? "No locked achievements found. Great job unlocking them all!"
                : "No achievements available at the moment."
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  progressSection: {
    padding: Theme.layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  progressSectionTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  progressStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: Theme.layout.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  progressStatLabel: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textSecondary,
  },
  overallProgressContainer: {
    flex: 1,
    marginHorizontal: Theme.layout.spacing.md,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 4,
    marginBottom: 4,
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: Theme.layout.spacing.md,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: Theme.layout.spacing.sm,
    marginHorizontal: Theme.layout.spacing.xs,
    borderRadius: Theme.layout.borderRadius.medium,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  filterButtonText: {
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.layout.spacing.md,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementDetails: {
    flex: 1,
    justifyContent: 'center',
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: 2,
    marginRight: Theme.layout.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.layout.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.sm,
  },
  emptySubText: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
});