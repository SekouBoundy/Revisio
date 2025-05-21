// app/_tabs/quizzes/BAC/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../constants/ThemeContext';

// Simple ProgressBar component
const ProgressBar = ({ progress, height = 8, color, showPercentage = false }) => {
  return (
    <View style={{ height, backgroundColor: '#E5E7EB', borderRadius: height/2, overflow: 'hidden', marginVertical: 4 }}>
      <View style={{ 
        height: '100%', 
        width: `${progress}%`, 
        backgroundColor: color || '#4361FF',
        borderRadius: height/2
      }} />
      {showPercentage && (
        <Text style={{fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'right'}}>{Math.round(progress)}%</Text>
      )}
    </View>
  );
};

// Mock quiz data
const BAC_QUIZZES = [
  {
    id: 'quiz-bac-1',
    title: 'Physique Quantique',
    course: 'Sciences Physiques',
    questionCount: 15,
    duration: 25,
    difficulty: 'Difficile',
    completed: false,
    color: '#3B82F6',
    icon: 'flask-outline'
  },
  {
    id: 'quiz-bac-2',
    title: 'Fonctions Dérivées',
    course: 'Mathématiques',
    questionCount: 20,
    duration: 30,
    difficulty: 'Moyen',
    completed: false,
    color: '#8B5CF6',
    icon: 'calculator-outline'
  },
  {
    id: 'quiz-bac-3',
    title: 'Littérature du XVIe siècle',
    course: 'Français',
    questionCount: 25,
    duration: 40,
    difficulty: 'Moyen',
    completed: true,
    color: '#F59E0B',
    icon: 'book-outline'
  }
];

export default function BACQuizzesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  
  // BAC Quiz Card Component - More academic design
  const BACQuizCard = ({ quiz }) => (
    <TouchableOpacity
      style={[styles.bacQuizCard, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}
      onPress={() => router.push(`/_tabs/quizzes/${quiz.id}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.bacQuizIconContainer, { backgroundColor: isDarkMode ? quiz.color + '30' : quiz.color + '15' }]}>
        <Ionicons name={quiz.icon} size={24} color={quiz.color} />
      </View>
      
      <View style={styles.bacQuizContent}>
        <View style={styles.bacQuizHeader}>
          <Text style={[styles.bacQuizTitle, { color: theme.text }]}>{quiz.title}</Text>
          {quiz.completed && (
            <View style={[styles.bacCompletedBadge, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <Text style={[styles.bacQuizCourse, { color: theme.textSecondary }]}>{quiz.course}</Text>
        
        <View style={styles.bacQuizDetails}>
          <View style={styles.bacQuizDetailItem}>
            <Ionicons name="help-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.bacQuizDetailText, { color: theme.textSecondary }]}>{quiz.questionCount} questions</Text>
          </View>
          
          <View style={styles.bacQuizDetailItem}>
            <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.bacQuizDetailText, { color: theme.textSecondary }]}>{quiz.duration} min</Text>
          </View>
          
          <View style={styles.bacQuizDetailItem}>
            <Ionicons name="stats-chart-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.bacQuizDetailText, { color: theme.textSecondary }]}>{quiz.difficulty}</Text>
          </View>
        </View>
        
        <View style={styles.bacStartQuiz}>
          <TouchableOpacity 
            style={[styles.bacStartButton, { backgroundColor: quiz.color }]}
            onPress={() => router.push(`/_tabs/quizzes/${quiz.id}`)}
          >
            <Text style={styles.bacStartButtonText}>
              {quiz.completed ? 'Refaire' : 'Commencer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // BAC Analytics Component
  const QuizAnalytics = () => (
    <View style={[styles.bacAnalyticsCard, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}>
      <Text style={[styles.bacAnalyticsTitle, { color: theme.text }]}>Performance Globale</Text>
      
      <View style={styles.bacAnalyticsGrid}>
        <View style={styles.bacAnalyticsItem}>
          <Text style={[styles.bacAnalyticsValue, { color: theme.primary }]}>73%</Text>
          <Text style={[styles.bacAnalyticsLabel, { color: theme.textSecondary }]}>Score Moyen</Text>
        </View>
        
        <View style={styles.bacAnalyticsItem}>
          <Text style={[styles.bacAnalyticsValue, { color: theme.primary }]}>8</Text>
          <Text style={[styles.bacAnalyticsLabel, { color: theme.textSecondary }]}>Quiz Terminés</Text>
        </View>
        
        <View style={styles.bacAnalyticsItem}>
          <Text style={[styles.bacAnalyticsValue, { color: theme.primary }]}>12</Text>
          <Text style={[styles.bacAnalyticsLabel, { color: theme.textSecondary }]}>Heures d'Étude</Text>
        </View>
      </View>
      
      <View style={styles.bacAnalyticsProgress}>
        <View style={styles.bacProgressRow}>
          <Text style={[styles.bacProgressLabel, { color: theme.text }]}>Sciences</Text>
          <ProgressBar progress={80} height={8} color="#3B82F6" />
        </View>
        
        <View style={styles.bacProgressRow}>
          <Text style={[styles.bacProgressLabel, { color: theme.text }]}>Mathématiques</Text>
          <ProgressBar progress={65} height={8} color="#8B5CF6" />
        </View>
        
        <View style={styles.bacProgressRow}>
          <Text style={[styles.bacProgressLabel, { color: theme.text }]}>Français</Text>
          <ProgressBar progress={90} height={8} color="#EC4899" />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.bacSectionTitle, { color: theme.text }]}>Évaluations</Text>
        
        <QuizAnalytics />
        
        <View style={styles.bacQuizzesHeader}>
          <Text style={[styles.bacQuizzesTitle, { color: theme.text }]}>Quiz Disponibles</Text>
          <Text style={[styles.bacQuizzesCount, { color: theme.primary }]}>
            {BAC_QUIZZES.length} quiz
          </Text>
        </View>
        
        {BAC_QUIZZES.map(quiz => (
          <BACQuizCard key={quiz.id} quiz={quiz} />
        ))}
        
        <TouchableOpacity 
          style={[styles.bacViewAllButton, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}
          onPress={() => {}}
        >
          <Text style={[styles.bacViewAllText, { color: theme.primary }]}>
            Voir tous les quiz
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  
  // BAC Styles - More academic
  bacSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bacAnalyticsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  bacAnalyticsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bacAnalyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bacAnalyticsItem: {
    alignItems: 'center',
    flex: 1,
  },
  bacAnalyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bacAnalyticsLabel: {
    fontSize: 12,
  },
  bacAnalyticsProgress: {
    marginTop: 8,
  },
  bacProgressRow: {
    marginBottom: 12,
  },
  bacProgressLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  bacQuizzesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bacQuizzesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bacQuizzesCount: {
    fontSize: 16,
    fontWeight: '500',
  },
  bacQuizCard: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bacQuizIconContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bacQuizContent: {
    flex: 1,
    padding: 16,
  },
  bacQuizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bacQuizTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    flex: 1,
    paddingRight: 8,
  },
  bacCompletedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bacQuizCourse: {
    fontSize: 14,
    marginBottom: 12,
  },
  bacQuizDetails: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  bacQuizDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  bacQuizDetailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  bacStartQuiz: {
    alignItems: 'flex-end',
  },
  bacStartButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  bacStartButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bacViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  bacViewAllText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  }
});