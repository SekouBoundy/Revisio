// app/(tabs)/dashboard.js - DIFFERENTIATED FOR DEF vs BAC
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

  // Common Components
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

  // DEF-Specific Components
  const DefQuickActionCard = ({ icon, title, color, onPress, badge }) => (
    <TouchableOpacity style={[styles.defActionCard, { backgroundColor: color + '15' }]} onPress={onPress}>
      <View style={[styles.defActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={28} color="#fff" />
        {badge && (
          <View style={[styles.defActionBadge, { backgroundColor: theme.error }]}>
            <Text style={styles.defActionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.defActionTitle, { color: theme.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  const DefSubjectCard = ({ icon, title, progress, nextLesson, color, onPress }) => (
    <TouchableOpacity style={[styles.defSubjectCard, { backgroundColor: theme.surface }]} onPress={onPress}>
      <View style={styles.defSubjectHeader}>
        <View style={[styles.defSubjectIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.defSubjectInfo}>
          <Text style={[styles.defSubjectTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.defSubjectNext, { color: theme.textSecondary }]}>{nextLesson}</Text>
        </View>
        <Text style={[styles.defSubjectProgress, { color: color }]}>{progress}%</Text>
      </View>
      <ProgressBar progress={progress} color={color} />
    </TouchableOpacity>
  );

  const DefTaskCard = ({ title, subject, dueDate, priority, onPress }) => (
    <TouchableOpacity style={[styles.defTaskCard, { backgroundColor: theme.surface }]} onPress={onPress}>
      <View style={[styles.defTaskPriority, { 
        backgroundColor: priority === 'high' ? theme.error : 
                        priority === 'medium' ? theme.warning : theme.success 
      }]} />
      <View style={styles.defTaskContent}>
        <Text style={[styles.defTaskTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.defTaskSubject, { color: theme.textSecondary }]}>{subject}</Text>
        <Text style={[styles.defTaskDue, { color: theme.primary }]}>{dueDate}</Text>
      </View>
    </TouchableOpacity>
  );

  // BAC-Specific Components
  const BacStatCard = ({ icon, title, value, color, subtitle, trend }) => (
    <ModernCard style={styles.bacStatCard}>
      <View style={styles.bacStatHeader}>
        <View style={[styles.bacStatIcon, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        {trend && (
          <View style={[styles.bacTrendIndicator, { backgroundColor: trend > 0 ? theme.success + '20' : theme.error + '20' }]}>
            <Ionicons 
              name={trend > 0 ? "trending-up" : "trending-down"} 
              size={14} 
              color={trend > 0 ? theme.success : theme.error} 
            />
          </View>
        )}
      </View>
      <Text style={[styles.bacStatValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.bacStatTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.bacStatSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      )}
    </ModernCard>
  );

  const BacExamCard = ({ title, subject, date, timeLeft, difficulty, onPress }) => (
    <TouchableOpacity style={[styles.bacExamCard, { backgroundColor: theme.surface }]} onPress={onPress}>
      <View style={styles.bacExamHeader}>
        <View style={styles.bacExamInfo}>
          <Text style={[styles.bacExamTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.bacExamSubject, { color: theme.textSecondary }]}>{subject}</Text>
          <Text style={[styles.bacExamDate, { color: theme.primary }]}>{date}</Text>
        </View>
        <View style={styles.bacExamMeta}>
          <Text style={[styles.bacExamTimeLeft, { color: theme.error }]}>{timeLeft}</Text>
          <View style={[styles.bacExamDifficulty, { 
            backgroundColor: difficulty === 'Difficile' ? theme.error + '20' : 
                            difficulty === 'Moyen' ? theme.warning + '20' : theme.success + '20'
          }]}>
            <Text style={[styles.bacExamDifficultyText, { 
              color: difficulty === 'Difficile' ? theme.error : 
                     difficulty === 'Moyen' ? theme.warning : theme.success 
            }]}>
              {difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Headers
  const DefHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.greeting, { color: '#FFFFFF99' }]}>
            Salut,
          </Text>
          <Text style={[styles.userName, { color: '#FFFFFF' }]}>
            {user?.name || 'Étudiant'} ! 👋
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
            <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.timeButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="time" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const BacHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.greeting, { color: '#FFFFFF99' }]}>
            Tableau de bord
          </Text>
          <Text style={[styles.userName, { color: '#FFFFFF' }]}>
            {user?.name || 'Étudiant'} • {user?.level}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
            <View style={[styles.notificationBadge, { backgroundColor: theme.error }]}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.analyticsButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}>
            <Ionicons name="analytics" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Progress Cards
  const DefProgressCard = () => (
    <View style={[styles.progressCardContainer, { backgroundColor: theme.surface }]}>
      <View style={styles.defCountdownContent}>
        <View style={styles.defCountdownLeft}>
          <Text style={[styles.defCountdownLabel, { color: theme.textSecondary }]}>
            Temps restant jusqu'au DEF
          </Text>
          <Text style={[styles.defCountdownValue, { color: theme.text }]}>42 jours</Text>
          <TouchableOpacity 
            style={[styles.defPlanningButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(tabs)/schedule')}
          >
            <Ionicons name="calendar" size={16} color="#FFFFFF" />
            <Text style={styles.defPlanningText}>Mon planning</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.defCountdownIcon, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="time" size={32} color={theme.primary} />
        </View>
      </View>
    </View>
  );

  const BacProgressCard = () => (
    <View style={[styles.progressCardContainer, { backgroundColor: theme.surface }]}>
      <View style={styles.bacCountdownContent}>
        <View style={styles.bacCountdownLeft}>
          <Text style={[styles.bacCountdownLabel, { color: theme.textSecondary }]}>
            Temps restant jusqu'au BAC
          </Text>
          <Text style={[styles.bacCountdownValue, { color: theme.text }]}>25 jours</Text>
          <TouchableOpacity 
            style={[styles.bacPlanningButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/(tabs)/schedule')}
          >
            <Ionicons name="calendar" size={16} color="#FFFFFF" />
            <Text style={styles.bacPlanningText}>Planning de révisions</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.bacCountdownIcon, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="hourglass" size={32} color={theme.primary} />
        </View>
      </View>
    </View>
  );

  // DEF Dashboard
  if (isDefLevel) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <DefHeader />
        <DefProgressCard />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
          {/* Weekly Progress */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ma progression</Text>
            <ModernCard style={styles.defWeeklyCard}>
              <View style={styles.defWeeklyContent}>
                <View style={styles.defWeeklyLeft}>
                  <Text style={[styles.defWeeklyTitle, { color: theme.text }]}>
                    Cette semaine
                  </Text>
                  <Text style={[styles.defWeeklyValue, { color: theme.primary }]}>
                    8/12 exercices
                  </Text>
                  <Text style={[styles.defWeeklySubtitle, { color: theme.textSecondary }]}>
                    Continue comme ça ! 🎉
                  </Text>
                </View>
                <View style={[styles.defWeeklyCircle, { backgroundColor: theme.primary + '15' }]}>
                  <Text style={[styles.defWeeklyPercent, { color: theme.primary }]}>67%</Text>
                </View>
              </View>
              <ProgressBar progress={67} color={theme.primary} />
            </ModernCard>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions rapides</Text>
            <View style={styles.defActionsGrid}>
              <DefQuickActionCard
                icon="book"
                title="Mes cours"
                color={theme.primary}
                onPress={() => router.push('/(tabs)/courses')}
              />
              <DefQuickActionCard
                icon="help-circle"
                title="Quiz"
                color={theme.accent}
                onPress={() => router.push('/(tabs)/quizzes')}
                badge="3"
              />
              <DefQuickActionCard
                icon="calendar"
                title="Planning"
                color={theme.success}
                onPress={() => router.push('/(tabs)/schedule')}
              />
              <DefQuickActionCard
                icon="trophy"
                title="Récompenses"
                color={theme.warning}
                onPress={() => console.log('Rewards')}
                badge="!"
              />
            </View>
          </View>

          {/* My Subjects */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes matières</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            
            <DefSubjectCard
              icon="calculator"
              title="Mathématiques"
              progress={75}
              nextLesson="Géométrie - Chapitre 4"
              color={theme.primary}
              onPress={() => router.push('/courses/DEF/Mathématiques')}
            />
            <DefSubjectCard
              icon="language"
              title="Français"
              progress={60}
              nextLesson="Expression écrite"
              color={theme.secondary}
              onPress={() => router.push('/courses/DEF/Français')}
            />
            <DefSubjectCard
              icon="flask"
              title="Physique-Chimie"
              progress={45}
              nextLesson="États de la matière"
              color={theme.accent}
              onPress={() => router.push('/courses/DEF/Physique-Chimie')}
            />
          </View>

          {/* Tasks & Homework */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes devoirs</Text>
            
            <DefTaskCard
              title="Exercices de géométrie"
              subject="Mathématiques"
              dueDate="Demain"
              priority="high"
              onPress={() => console.log('Open task')}
            />
            <DefTaskCard
              title="Lecture - Le Petit Prince"
              subject="Français"
              dueDate="Vendredi"
              priority="medium"
              onPress={() => console.log('Open task')}
            />
            <DefTaskCard
              title="Expérience sur les mélanges"
              subject="Physique-Chimie"
              dueDate="Lundi prochain"
              priority="low"
              onPress={() => console.log('Open task')}
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
      <BacHeader />
      <BacProgressCard />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        {/* Performance Analytics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Détails</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bacStatsGrid}>
            <BacStatCard
              icon="trending-up"
              title="Progression"
              value="68%"
              color={theme.success}
              subtitle="Moyenne générale"
              trend={5}
            />
            <BacStatCard
              icon="school"
              title="Examens"
              value="12"
              color={theme.info}
              subtitle="Terminés"
              trend={2}
            />
            <BacStatCard
              icon="trophy"
              title="Classement"
              value="#3"
              color={theme.accent}
              subtitle="Dans la classe"
              trend={-1}
            />
          </View>
        </View>

        {/* Subject Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Progression par matière</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <ModernCard style={styles.bacProgressOverviewCard}>
            <CircularProgress percentage={68} />
            <View style={styles.bacProgressStats}>
              <View style={styles.bacProgressStat}>
                <Text style={[styles.bacProgressStatValue, { color: theme.text }]}>5</Text>
                <Text style={[styles.bacProgressStatLabel, { color: theme.textSecondary }]}>Cours actifs</Text>
              </View>
              <View style={styles.bacProgressStat}>
                <Text style={[styles.bacProgressStatValue, { color: theme.text }]}>23</Text>
                <Text style={[styles.bacProgressStatLabel, { color: theme.textSecondary }]}>Leçons complétées</Text>
              </View>
              <View style={styles.bacProgressStat}>
                <Text style={[styles.bacProgressStatValue, { color: theme.text }]}>89%</Text>
                <Text style={[styles.bacProgressStatLabel, { color: theme.textSecondary }]}>Taux de réussite</Text>
              </View>
            </View>
          </ModernCard>
        </View>

        {/* Upcoming Exams */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Examens à venir</Text>
          
          <BacExamCard
            title="Examen Blanc Mathématiques"
            subject="Analyse et algèbre"
            date="25 Mai 2024"
            timeLeft="3 jours"
            difficulty="Difficile"
            onPress={() => console.log('Open exam details')}
          />
          <BacExamCard
            title="Dissertation Philosophie"
            subject="La conscience et l'inconscient"
            date="27 Mai 2024"
            timeLeft="5 jours"
            difficulty="Moyen"
            onPress={() => console.log('Open exam details')}
          />
          <BacExamCard
            title="TP Physique"
            subject="Oscillations mécaniques"
            date="30 Mai 2024"
            timeLeft="1 semaine"
            difficulty="Facile"
            onPress={() => console.log('Open exam details')}
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
  // Common Header Styles
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
  streakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Progress Card Styles
  progressCardContainer: {
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  
  // DEF Progress Styles
  defProgressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  defProgressLeft: {
    flex: 1,
  },
  defProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  defProgressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  defProgressSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  defProgressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defProgressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // DEF Countdown Styles
  defCountdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defCountdownLeft: {
    flex: 1,
  },
  defCountdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  defCountdownValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  defPlanningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  defPlanningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  defCountdownIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // DEF Weekly Progress Styles
  defWeeklyCard: {
    padding: 16,
  },
  defWeeklyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  defWeeklyLeft: {
    flex: 1,
  },
  defWeeklyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  defWeeklyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  defWeeklySubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  defWeeklyCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defWeeklyPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // BAC Progress Styles
  bacCountdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bacCountdownLeft: {
    flex: 1,
  },
  bacCountdownLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  bacCountdownValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bacPlanningButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  bacPlanningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bacCountdownIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Common Layout
  scrollContent: {
    flex: 1,
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
    marginBottom: 16,
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
  
  // DEF-Specific Styles
  defActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  defActionCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    position: 'relative',
  },
  defActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  defActionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  defActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  defSubjectCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  defSubjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  defSubjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  defSubjectInfo: {
    flex: 1,
  },
  defSubjectTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  defSubjectNext: {
    fontSize: 12,
  },
  defSubjectProgress: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  defTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  defTaskPriority: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  defTaskContent: {
    flex: 1,
  },
  defTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  defTaskSubject: {
    fontSize: 12,
    marginBottom: 2,
  },
  defTaskDue: {
    fontSize: 12,
    fontWeight: '500',
  },
  
  // BAC-Specific Styles
  bacStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bacStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  bacStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  bacStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bacTrendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bacStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bacStatTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  bacStatSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  bacProgressOverviewCard: {
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
  bacProgressStats: {
    flex: 1,
    gap: 16,
  },
  bacProgressStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bacProgressStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bacProgressStatLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  bacExamCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bacExamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bacExamInfo: {
    flex: 1,
  },
  bacExamTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bacExamSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  bacExamDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  bacExamMeta: {
    alignItems: 'flex-end',
  },
  bacExamTimeLeft: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bacExamDifficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bacExamDifficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});