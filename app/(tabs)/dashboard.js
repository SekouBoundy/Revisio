// File: app/(tabs)/dashboard.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function DashboardScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const isDefLevel = user?.level === 'DEF';

  const ProgressBar = ({ progress, color = theme.primary }) => (
    <View style={[styles.progressBarContainer, { backgroundColor: theme.neutralLight }]}>
      <View 
        style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} 
      />
    </View>
  );

  const CircularProgress = ({ percentage }) => (
    <View style={styles.circularContainer}>
      <View style={[styles.circularProgress, { borderColor: theme.neutralLight }]}>
        <View style={[styles.circularFill, { 
          borderTopColor: theme.primary,
          borderRightColor: theme.primary,
          transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
        }]} />
        <View style={styles.circularInner}>
          <Text style={[styles.percentageText, { color: theme.text }]}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );

  const ModernCard = ({ children, style = {} }) => (
    <View style={[styles.modernCard, { backgroundColor: theme.surface }, style]}>
      {children}
    </View>
  );

  const CourseCard = ({ icon, title, subtitle, progress, color, isNew = false }) => (
    <TouchableOpacity>
      <ModernCard style={styles.courseCard}>
        <View style={styles.courseHeader}>
          <View style={[styles.courseIconContainer, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={24} color={color} />
          </View>
          <View style={styles.courseInfo}>
            <Text style={[styles.courseTitle, { color: theme.text }]}>{title}</Text>
            {isNew ? (
              <View style={[styles.newBadge, { backgroundColor: theme.accent + '20' }]}>
                <Text style={[styles.newText, { color: theme.accent }]}>Nouveau</Text>
              </View>
            ) : (
              <Text style={[styles.courseSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </View>
        
        {progress !== undefined && (
          <View style={styles.progressSection}>
            <ProgressBar progress={progress} color={color} />
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>{progress}% complété</Text>
          </View>
        )}
      </ModernCard>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <ModernCard style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      )}
    </ModernCard>
  );

  const UpcomingCard = ({ title, date, subject, color, type }) => (
    <TouchableOpacity>
      <ModernCard style={styles.upcomingCard}>
        <View style={styles.upcomingHeader}>
          <View style={[styles.upcomingIndicator, { backgroundColor: color }]} />
          <View style={styles.upcomingContent}>
            <Text style={[styles.upcomingTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.upcomingSubject, { color: theme.textSecondary }]}>{subject}</Text>
          </View>
          <View style={styles.upcomingMeta}>
            <Text style={[styles.upcomingDate, { color: color }]}>{date}</Text>
            <Text style={[styles.upcomingType, { color: theme.textSecondary }]}>{type}</Text>
          </View>
        </View>
      </ModernCard>
    </TouchableOpacity>
  );

  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.greeting, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Bonjour,' : 'Bonsoir,'}
          </Text>
          <Text style={[styles.userName, { color: '#FFFFFF' }]}>
            {user?.name || 'Étudiant'}
          </Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
          <Ionicons name="notifications" size={20} color="#FFFFFF" />
          <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
            <Text style={styles.notificationCount}>{isDefLevel ? '3' : '2'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // DEF Dashboard
  if (isDefLevel) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />

          {/* Progress Card */}
          <View style={styles.section}>
            <ModernCard style={styles.weeklyProgressCard}>
              <Text style={[styles.progressCardTitle, { color: theme.text }]}>
                Ma progression cette semaine
              </Text>
              <Text style={[styles.progressCardValue, { color: theme.primary }]}>
                8/12 exercices
              </Text>
              <ProgressBar progress={67} color={theme.primary} />
              <Text style={[styles.progressCardSubtitle, { color: theme.textSecondary }]}>
                Continue comme ça !
              </Text>
            </ModernCard>
          </View>

          {/* Stats Grid */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes résultats</Text>
            <View style={styles.statsGrid}>
              <StatCard icon="trophy" title="Réussite" value="85%" color={theme.success} />
              <StatCard icon="book" title="Exercices" value="24" color={theme.primary} />
              <StatCard icon="school" title="Matières" value="6" color={theme.accent} />
            </View>
          </View>

          {/* Courses Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes matières</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <CourseCard
              icon="calculator"
              title="Mathématiques"
              subtitle="Géométrie - Chapitre 4"
              progress={45}
              color={theme.primary}
            />
            <CourseCard
              icon="flask"
              title="Physique-Chimie"
              subtitle="États de la matière"
              progress={60}
              color={theme.accent}
            />
            <CourseCard
              icon="language"
              title="Français"
              isNew={true}
              color={theme.secondary}
            />
          </View>

          {/* Upcoming Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Prochains contrôles</Text>
            
            <UpcomingCard
              title="Contrôle de Mathématiques"
              subject="Géométrie"
              date="Demain"
              type="Contrôle"
              color={theme.primary}
            />
            <UpcomingCard
              title="Quiz Sciences"
              subject="Physique-Chimie"
              date="Vendredi"
              type="Quiz"
              color={theme.accent}
            />
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // BAC Dashboard
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />

        {/* Countdown Card */}
        <View style={styles.section}>
          <ModernCard style={styles.countdownCard}>
            <View style={styles.countdownContent}>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>
                Temps restant jusqu'au BAC
              </Text>
              <Text style={[styles.countdownValue, { color: theme.text }]}>25 jours</Text>
              <TouchableOpacity 
                style={[styles.planningButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/(tabs)/schedule')}
              >
                <Ionicons name="calendar" size={16} color="#FFFFFF" />
                <Text style={styles.planningText}>Voir mon planning</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.countdownIcon, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="time" size={32} color={theme.primary} />
            </View>
          </ModernCard>
        </View>

        {/* Global Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Progression globale</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Détails</Text>
            </TouchableOpacity>
          </View>
          
          <ModernCard style={styles.progressOverviewCard}>
            <CircularProgress percentage={68} />
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: theme.text }]}>5</Text>
                <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>Cours</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: theme.text }]}>23</Text>
                <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>Leçons</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={[styles.progressStatValue, { color: theme.text }]}>12</Text>
                <Text style={[styles.progressStatLabel, { color: theme.textSecondary }]}>Quiz</Text>
              </View>
            </View>
          </ModernCard>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Continuer l'apprentissage</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <CourseCard
            icon="calculator"
            title="Mathématiques"
            subtitle="Intégrales - Chapitre 8"
            progress={65}
            color={theme.primary}
          />
          <CourseCard
            icon="nuclear"
            title="Physique"
            isNew={true}
            color={theme.accent}
          />
        </View>

        {/* Upcoming Exams */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Examens à venir</Text>
          
          <UpcomingCard
            title="Dissertation de Philosophie"
            subject="La conscience"
            date="25 Mai"
            type="Examen"
            color={theme.secondary}
          />
          <UpcomingCard
            title="Examen de Mathématiques"
            subject="Analyse"
            date="27 Mai"
            type="Examen Blanc"
            color={theme.primary}
          />
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
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modernCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  weeklyProgressCard: {
    alignItems: 'center',
    marginTop: -20,
  },
  progressCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressCardSubtitle: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  courseCard: {
    padding: 16,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  courseIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  newBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 16,
  },
  progressText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  countdownContent: {
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  countdownValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  planningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  countdownIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularContainer: {
    marginRight: 24,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularFill: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: 'transparent',
  },
  circularInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressStats: {
    flex: 1,
    gap: 16,
  },
  progressStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressStatLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  upcomingCard: {
    padding: 16,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingIndicator: {
    width: 4,
    height: 48,
    borderRadius: 2,
    marginRight: 16,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingSubject: {
    fontSize: 14,
    fontWeight: '500',
  },
  upcomingMeta: {
    alignItems: 'flex-end',
  },
  upcomingDate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  upcomingType: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});