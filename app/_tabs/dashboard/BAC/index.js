// app/_tabs/dashboard/BAC/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

// Mock data for the dashboard
const recentActivities = [
  { id: '1', type: 'course', title: 'Mathématiques: Intégrales', progress: 65, color: '#3B82F6', icon: 'calculator-outline' },
  { id: '2', type: 'quiz', title: 'Physique: Forces', progress: 0, color: '#EC4899', icon: 'flask-outline' },
  { id: '3', type: 'note', title: 'Littérature: Résumé', progress: 100, color: '#F59E0B', icon: 'document-text-outline' }
];

const upcomingDeadlines = [
  { id: '1', title: 'Dissertation: Histoire', dueDate: '25 Mai', daysLeft: 4, color: '#8B5CF6' },
  { id: '2', title: 'Examen blanc: Philosophie', dueDate: '27 Mai', daysLeft: 6, color: '#10B981' }
];

const subjects = [
  { id: 'math', name: 'Mathématiques', progress: 73, color: '#3B82F6' },
  { id: 'phys', name: 'Physique', progress: 58, color: '#EC4899' },
  { id: 'fran', name: 'Français', progress: 82, color: '#F59E0B' },
  { id: 'hist', name: 'Histoire', progress: 45, color: '#8B5CF6' },
  { id: 'phil', name: 'Philosophie', progress: 29, color: '#10B981' }
];

export default function BACDashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { userProfile } = useUser();
  const [greeting, setGreeting] = useState('');
  const screenWidth = Dimensions.get('window').width;
  
  // Generate appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      setGreeting('Bonjour');
    } else if (hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
  }, []);
  
  // Progress donut chart component
  const DonutChart = ({ progress, size = 120, strokeWidth = 12, color }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <View style={[styles.donutContainer, { width: size, height: size }]}>
        <View style={styles.donutBackground}>
          <View style={[styles.donutTrack, { borderWidth: strokeWidth, borderColor: isDarkMode ? '#333' : '#E5E7EB' }]} />
          <View 
            style={[
              styles.donutProgress, 
              { 
                borderWidth: strokeWidth, 
                borderColor: color,
                width: size,
                height: size,
                borderRadius: size / 2,
                transform: [{ rotateZ: '-90deg' }],
                borderBottomColor: 'transparent',
                borderRightColor: 'transparent',
                borderLeftColor: progress > 25 ? color : 'transparent',
                borderTopColor: progress > 75 ? color : 'transparent',
                // Use opacity to simulate progress between 0-25% and 50-75%
                opacity: progress > 50 ? 1 : 0.5
              }
            ]} 
          />
        </View>
        <View style={styles.donutContent}>
          <Text style={[styles.donutText, { color: theme.text }]}>{progress}%</Text>
        </View>
      </View>
    );
  };
  
  // Progress bar component
  const ProgressBar = ({ progress, color, height = 8, width = '100%' }) => (
    <View style={[styles.progressContainer, { height, width, backgroundColor: isDarkMode ? '#333' : '#E5E7EB' }]}>
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${progress}%`, 
            backgroundColor: color,
            height
          }
        ]} 
      />
    </View>
  );
  
  // Activity card component
  const ActivityCard = ({ activity }) => (
    <TouchableOpacity 
      style={[styles.activityCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => router.push(
        activity.type === 'course' 
          ? `/_tabs/courses/${activity.id}` 
          : activity.type === 'quiz' 
            ? `/_tabs/quizzes/${activity.id}` 
            : `/_tabs/notes/${activity.id}`
      )}
    >
      <View style={[styles.activityIconContainer, { backgroundColor: activity.color + '20' }]}>
        <Ionicons name={activity.icon} size={22} color={activity.color} />
      </View>
      
      <View style={styles.activityInfo}>
        <Text style={[styles.activityTitle, { color: theme.text }]} numberOfLines={1}>
          {activity.title}
        </Text>
        
        {activity.progress > 0 ? (
          <View style={styles.activityProgress}>
            <ProgressBar progress={activity.progress} color={activity.color} height={4} />
            <Text style={[styles.activityProgressText, { color: theme.textSecondary }]}>
              {activity.progress}% {activity.progress === 100 ? 'Terminé' : 'Complété'}
            </Text>
          </View>
        ) : (
          <Text style={[styles.activityNew, { color: activity.color }]}>Nouveau</Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
    </TouchableOpacity>
  );
  
  // Deadline card component
  const DeadlineCard = ({ deadline }) => (
    <View style={[styles.deadlineCard, { backgroundColor: theme.cardBackground }]}>
      <View style={[styles.deadlineColorIndicator, { backgroundColor: deadline.color }]} />
      
      <View style={styles.deadlineInfo}>
        <Text style={[styles.deadlineTitle, { color: theme.text }]} numberOfLines={1}>
          {deadline.title}
        </Text>
        
        <View style={styles.deadlineDetails}>
          <Text style={[styles.deadlineDate, { color: theme.textSecondary }]}>
            {deadline.dueDate}
          </Text>
          
          <View style={[styles.deadlineDays, { backgroundColor: deadline.daysLeft <= 3 ? '#FEE2E2' : '#E0F2FE' }]}>
            <Text style={{ 
              color: deadline.daysLeft <= 3 ? '#EF4444' : '#3B82F6',
              fontSize: 12,
              fontWeight: '500'
            }}>
              {deadline.daysLeft} {deadline.daysLeft === 1 ? 'jour' : 'jours'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Subject progress component
  const SubjectProgress = ({ subject }) => (
    <View style={styles.subjectItem}>
      <View style={styles.subjectHeader}>
        <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
        <Text style={[styles.subjectPercent, { color: subject.color }]}>{subject.progress}%</Text>
      </View>
      
      <ProgressBar progress={subject.progress} color={subject.color} height={6} />
    </View>
  );

  // Time until BAC exam calculation
  const today = new Date();
  const bacExamDate = new Date(2025, 5, 15); // Example: June, 15 2025
  const diffTime = Math.abs(bacExamDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section with Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              {greeting},
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {userProfile?.name || 'Étudiant'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.notificationsButton, { backgroundColor: theme.cardBackground }]}
            onPress={() => {/* Handle notifications */}}
          >
            <Ionicons name="notifications-outline" size={22} color={theme.text} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* BAC Countdown */}
        <View style={[styles.countdownCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.countdownContent}>
            <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>
              Temps restant jusqu'au BAC
            </Text>
            <Text style={[styles.countdownValue, { color: theme.text }]}>
              {diffDays} jours
            </Text>
            <TouchableOpacity 
              style={[styles.countdownButton, { backgroundColor: theme.primary + '20' }]}
              onPress={() => {/* Open calendar or planning */}}
            >
              <Text style={[styles.countdownButtonText, { color: theme.primary }]}>
                Voir mon planning
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.countdownImageContainer}>
            <View style={[styles.countdownImageBackground, { backgroundColor: theme.primary + '30' }]}>
              <Ionicons name="calendar-outline" size={48} color={theme.primary} />
            </View>
          </View>
        </View>
        
        {/* Overall Progress */}
        <View style={[styles.progressCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.text }]}>
              Progression globale
            </Text>
            <TouchableOpacity onPress={() => router.push('/_tabs/profile/achievements')}>
              <Text style={[styles.progressLink, { color: theme.primary }]}>
                Détails
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressContent}>
            <DonutChart progress={68} color={theme.primary} />
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, { color: theme.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Cours
                </Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, { color: theme.text }]}>23</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Leçons
                </Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, { color: theme.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  Quiz
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Continue Learning Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Continuer l'apprentissage
            </Text>
            <TouchableOpacity onPress={() => router.push('/_tabs/courses')}>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activitiesList}>
            {recentActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>
        
        {/* Upcoming Deadlines */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Échéances à venir
            </Text>
            <TouchableOpacity>
              <Text style={[styles.sectionLink, { color: theme.primary }]}>
                Calendrier
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.deadlinesList}>
            {upcomingDeadlines.map(deadline => (
              <DeadlineCard key={deadline.id} deadline={deadline} />
            ))}
          </View>
        </View>
        
        {/* Subject Progress */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Progression par matière
            </Text>
          </View>
          
          <View style={[styles.subjectCard, { backgroundColor: theme.cardBackground }]}>
            {subjects.map(subject => (
              <SubjectProgress key={subject.id} subject={subject} />
            ))}
          </View>
        </View>
        
        {/* Recommended Resources */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recommandé pour vous
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.recommendedCard, { backgroundColor: theme.cardBackground }]}
            onPress={() => router.push('/_tabs/courses/bac-recommended')}
          >
            <View style={styles.recommendedContent}>
              <View style={[styles.recommendedBadge, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.recommendedBadgeText, { color: theme.primary }]}>
                  Populaire
                </Text>
              </View>
              
              <Text style={[styles.recommendedTitle, { color: theme.text }]}>
                Exercices à haut impact
              </Text>
              
              <Text style={[styles.recommendedDescription, { color: theme.textSecondary }]}>
                15 exercices mathématiques fréquemment au BAC
              </Text>
            </View>
            
            <View style={[styles.recommendedImageContainer, { backgroundColor: '#3B82F6' + '20' }]}>
              <Ionicons name="trending-up" size={48} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Countdown card styles
  countdownCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdownContent: {
    flex: 1,
  },
  countdownLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  countdownButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  countdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  countdownImageContainer: {
    marginLeft: 16,
  },
  countdownImageBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Progress card styles
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  donutBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  donutProgress: {
    position: 'absolute',
  },
  donutContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  progressStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  
  // Progress bar styles
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
  
  // Section styles
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Activity card styles
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  activityProgress: {
    width: '100%',
  },
  activityProgressText: {
    fontSize: 12,
    marginTop: 4,
  },
  activityNew: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Deadline card styles
  deadlinesList: {
    gap: 12,
  },
  deadlineCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  deadlineColorIndicator: {
    width: 6,
    height: '100%',
  },
  deadlineInfo: {
    flex: 1,
    padding: 12,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  deadlineDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineDate: {
    fontSize: 14,
  },
  deadlineDays: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  // Subject progress styles
  subjectCard: {
    borderRadius: 12,
    padding: 16,
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
  subjectPercent: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Recommended card styles
  recommendedCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  recommendedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendedDescription: {
    fontSize: 14,
  },
  recommendedImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
});