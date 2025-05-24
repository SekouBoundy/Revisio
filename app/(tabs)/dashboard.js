// app/(tabs)/dashboard.js
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
    <View style={styles.progressBarContainer}>
      <View 
        style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} 
      />
    </View>
  );

  const CircularProgress = ({ percentage }) => (
    <View style={styles.circularContainer}>
      <View style={[styles.circularProgress, { borderColor: theme.surface }]}>
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

  const CourseItem = ({ icon, title, subtitle, progress, color, isNew = false }) => (
    <TouchableOpacity style={[styles.courseItem, { backgroundColor: theme.surface }]}>
      <View style={[styles.courseIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.courseContent}>
        <Text style={[styles.courseTitle, { color: theme.text }]}>{title}</Text>
        {isNew ? (
          <Text style={[styles.newLabel, { color: '#E91E63' }]}>Nouveau</Text>
        ) : (
          <Text style={[styles.courseSubtitle, { color: theme.text + '80' }]}>{subtitle}</Text>
        )}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} color={color} />
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
    </TouchableOpacity>
  );

  const UpcomingItem = ({ title, date, daysLeft, color }) => (
    <View style={styles.upcomingItem}>
      <View style={[styles.upcomingIndicator, { backgroundColor: color }]} />
      <View style={styles.upcomingContent}>
        <Text style={[styles.upcomingTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.upcomingDate, { color: theme.text + '60' }]}>{date}</Text>
      </View>
      <Text style={[styles.daysLeft, { color: theme.primary }]}>{daysLeft}</Text>
    </View>
  );

  const SubjectProgress = ({ subject, progress, color }) => (
    <View style={styles.subjectItem}>
      <View style={styles.subjectHeader}>
        <Text style={[styles.subjectName, { color: theme.text }]}>{subject}</Text>
        <Text style={[styles.subjectPercentage, { color }]}>{progress}%</Text>
      </View>
      <ProgressBar progress={progress} color={color} />
    </View>
  );

  if (isDefLevel) {
    // Complete DEF dashboard
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: theme.text + '80' }]}>Bonjour,</Text>
              <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Étudiant'}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={theme.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Simple Progress Card */}
          <View style={[styles.simpleProgressCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>Ma progression cette semaine</Text>
            <Text style={[styles.progressValue, { color: theme.primary }]}>8/12 exercices</Text>
            <ProgressBar progress={67} color={theme.primary} />
            <Text style={[styles.progressSubtitle, { color: theme.text + '60' }]}>Continue comme ça !</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes résultats</Text>
            <View style={styles.simpleStatsGrid}>
              <View style={[styles.simpleStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.simpleStatValue, { color: '#4CAF50' }]}>85%</Text>
                <Text style={[styles.simpleStatLabel, { color: theme.text + '80' }]}>Réussite</Text>
              </View>
              <View style={[styles.simpleStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.simpleStatValue, { color: '#2196F3' }]}>24</Text>
                <Text style={[styles.simpleStatLabel, { color: theme.text + '80' }]}>Exercices</Text>
              </View>
              <View style={[styles.simpleStatCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.simpleStatValue, { color: '#FF9800' }]}>6</Text>
                <Text style={[styles.simpleStatLabel, { color: theme.text + '80' }]}>Matières</Text>
              </View>
            </View>
          </View>

          {/* My Subjects */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes matières</Text>
            <CourseItem
              icon="calculator-outline"
              title="Mathématiques"
              subtitle="45% Complété"
              progress={45}
              color="#2196F3"
            />
            <CourseItem
              icon="flask-outline"
              title="Physique-Chimie"
              subtitle="60% Complété"
              progress={60}
              color="#E91E63"
            />
            <CourseItem
              icon="language-outline"
              title="Français"
              subtitle="Nouveau chapitre"
              isNew={true}
              color="#FF9800"
            />
            <CourseItem
              icon="globe-outline"
              title="Histoire-Géographie"
              subtitle="75% Complété"
              progress={75}
              color="#9C27B0"
            />
            <CourseItem
              icon="leaf-outline"
              title="Sciences de la Vie et de la Terre"
              subtitle="30% Complété"
              progress={30}
              color="#4CAF50"
            />
          </View>

          {/* Upcoming Tests */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Prochains contrôles</Text>
            <UpcomingItem
              title="Contrôle de Maths"
              date="Demain"
              daysLeft="1 jour"
              color="#2196F3"
            />
            <UpcomingItem
              title="Quiz Physique-Chimie"
              date="Vendredi"
              daysLeft="3 jours"
              color="#E91E63"
            />
          </View>

          {/* Recommendations */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommandé pour toi</Text>
            <View style={[styles.recommendationCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.recommendationTitle, { color: theme.text }]}>
                Révisions d'Histoire-Géo
              </Text>
              <Text style={[styles.recommendationSubtitle, { color: theme.text + '60' }]}>
                Les grandes découvertes
              </Text>
              <View style={[styles.trendIcon, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name="globe-outline" size={20} color={theme.primary} />
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Advanced BAC dashboard
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text + '80' }]}>Bonsoir,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'Étudiant'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={theme.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* BAC Countdown */}
        <View style={[styles.countdownCard, { backgroundColor: theme.surface }]}>
          <View style={styles.countdownContent}>
            <Text style={[styles.countdownLabel, { color: theme.text + '80' }]}>
              Temps restant jusqu'au BAC
            </Text>
            <Text style={[styles.countdownValue, { color: theme.text }]}>25 jours</Text>
            <TouchableOpacity 
              style={[styles.planningButton, { backgroundColor: theme.primary + '20' }]}
              onPress={() => router.push('/(tabs)/schedule')}
            >
              <Text style={[styles.planningText, { color: theme.primary }]}>
                Voir mon planning
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.calendarIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="calendar-outline" size={32} color={theme.primary} />
          </View>
        </View>

        {/* Global Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Progression globale</Text>
            <TouchableOpacity>
              <Text style={[styles.detailsText, { color: theme.primary }]}>Détails</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.progressCard, { backgroundColor: theme.surface }]}>
            <CircularProgress percentage={68} />
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Cours</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>23</Text>
                <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Leçons</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: theme.text + '60' }]}>Quiz</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Continuer l'apprentissage</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <CourseItem
            icon="calculator-outline"
            title="Mathématiques"
            subtitle="65% Complété - Intégrales"
            progress={65}
            color="#2196F3"
          />
          <CourseItem
            icon="nuclear-outline"
            title="Physique"
            subtitle="Nouveau chapitre"
            isNew={true}
            color="#E91E63"
          />
          <CourseItem
            icon="flask-outline"
            title="Chimie"
            subtitle="100% Terminé - Chimie organique"
            progress={100}
            color="#9C27B0"
          />
          <CourseItem
            icon="bulb-outline"
            title="Philosophie"
            subtitle="45% Complété - La conscience"
            progress={45}
            color="#795548"
          />
        </View>

        {/* Upcoming Deadlines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Échéances à venir</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Calendrier</Text>
            </TouchableOpacity>
          </View>
          
          <UpcomingItem
            title="Dissertation: Philosophie"
            date="25 Mai"
            daysLeft="4 jours"
            color="#795548"
          />
          <UpcomingItem
            title="Examen: Mathématiques"
            date="27 Mai"
            daysLeft="6 jours"
            color="#2196F3"
          />
        </View>

        {/* Subject Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Progression par matière</Text>
          
          <SubjectProgress subject="Mathématiques" progress={73} color="#2196F3" />
          <SubjectProgress subject="Physique" progress={58} color="#E91E63" />
          <SubjectProgress subject="Chimie" progress={82} color="#9C27B0" />
          <SubjectProgress subject="Français" progress={45} color="#FF9800" />
          <SubjectProgress subject="Philosophie" progress={29} color="#795548" />
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommandé pour vous</Text>
          
          <View style={[styles.recommendationCard, { backgroundColor: theme.surface }]}>
            <View style={styles.recommendationHeader}>
              <View style={[styles.popularBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.popularText, { color: theme.primary }]}>Populaire</Text>
              </View>
            </View>
            <Text style={[styles.recommendationTitle, { color: theme.text }]}>
              Révisions intensives Maths
            </Text>
            <Text style={[styles.recommendationSubtitle, { color: theme.text + '60' }]}>
              Intégrales et dérivées - Spécial BAC
            </Text>
            <View style={[styles.trendIcon, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="trending-up" size={20} color={theme.primary} />
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
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
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 16,
  },
  countdownContent: {
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  countdownValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  planningButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  planningText: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  detailsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  circularContainer: {
    marginBottom: 20,
  },
  circularProgress: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularFill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: 'transparent',
  },
  circularInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  newLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  upcomingIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingDate: {
    fontSize: 12,
  },
  daysLeft: {
    fontSize: 12,
    fontWeight: '600',
  },
  subjectItem: {
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '500',
  },
  subjectPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 12,
    position: 'relative',
  },
  recommendationHeader: {
    marginBottom: 8,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recommendationSubtitle: {
    fontSize: 12,
  },
  trendIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleProgressCard: {
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressSubtitle: {
    fontSize: 12,
    marginTop: 8,
  },
  simpleStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  simpleStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  simpleStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  simpleStatLabel: {
    fontSize: 12,
  },
  bottomPadding: {
    height: 40,
  },
});