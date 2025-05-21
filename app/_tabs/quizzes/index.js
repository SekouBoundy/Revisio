// app/_tabs/quizzes/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';
import { UserContext } from '../../../constants/UserContext';

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

// Level-based content components
const DEFOnly = ({ children }) => {
  let studentLevel;
  
  try {
    const user = useContext(UserContext);
    studentLevel = user?.studentLevel;
  } catch (error) {
    console.log("Context error:", error);
    studentLevel = "BAC"; // Default fallback
  }
  
  return studentLevel === 'DEF' ? <>{children}</> : null;
};

const BACOnly = ({ children }) => {
  let studentLevel;
  
  try {
    const user = useContext(UserContext);
    studentLevel = user?.studentLevel;
  } catch (error) {
    console.log("Context error:", error);
    studentLevel = "BAC"; // Default fallback
  }
  
  return studentLevel === 'BAC' ? <>{children}</> : null;
};
// Mock data for quizzes
const DEF_QUIZZES = [
  {
    id: 'quiz-def-1',
    title: 'Les Bases Scientifiques',
    emoji: '🧪',
    color: '#10B981',
    questionCount: 10,
    difficulty: 'Facile',
    completed: false
  },
  {
    id: 'quiz-def-2',
    title: 'Mathématiques Fondamentales',
    emoji: '🧮',
    color: '#8B5CF6',
    questionCount: 8,
    difficulty: 'Moyen',
    completed: false
  },
  {
    id: 'quiz-def-3',
    title: 'Vocabulaire Français',
    emoji: '📚',
    color: '#EC4899',
    questionCount: 12,
    difficulty: 'Facile',
    completed: true
  }
];

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

export default function QuizzesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  let studentLevel;
  try {
    const user = useContext(UserContext);
    studentLevel = user?.studentLevel || "BAC";
  } catch (error) {
    studentLevel = "BAC"; // Default fallback
  }
  // const { studentLevel } = useUser();

  // DEF Quiz Card Component - More playful design
  const DEFQuizCard = ({ quiz }) => (
    <TouchableOpacity
      style={[styles.defQuizCard, { backgroundColor: quiz.color + '20' }]}
      onPress={() => router.push(`/_tabs/quizzes/${quiz.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.defQuizContent}>
        <Text style={styles.defQuizEmoji}>{quiz.emoji}</Text>
        <Text style={[styles.defQuizTitle, { color: theme.text }]}>{quiz.title}</Text>
        
        <View style={styles.defQuizInfo}>
          <Text style={[styles.defQuizInfoText, { color: theme.textSecondary }]}>
            {quiz.questionCount} questions • {quiz.difficulty}
          </Text>
        </View>
        
        <View style={[styles.defStartButton, { backgroundColor: quiz.color }]}>
          <Text style={styles.defStartText}>
            {quiz.completed ? 'Refaire le Quiz' : 'Commencer'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
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
        {/* DEF level interface - More playful, simpler */}
        <DEFOnly>
          <View style={styles.defHeader}>
            <Text style={[styles.defTitle, { color: theme.text }]}>Quiz Aventure</Text>
            <Text style={[styles.defSubtitle, { color: theme.textSecondary }]}>
              Teste tes connaissances pour gagner des points!
            </Text>
          </View>
          
          <View style={styles.defProgressContainer}>
            <View style={[styles.defProgressCard, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}>
              <View style={styles.defProgressHeader}>
                <Text style={[styles.defProgressTitle, { color: theme.text }]}>Mon progrès</Text>
                <Text style={[styles.defProgressValue, { color: theme.primary }]}>60%</Text>
              </View>
              
              <ProgressBar progress={60} height={16} color={theme.primary} showPercentage={false} />
              
              <Text style={[styles.defProgressText, { color: theme.textSecondary }]}>
                Continue pour débloquer plus de quiz!
              </Text>
            </View>
          </View>
          
          <View style={styles.defQuizzesContainer}>
            {DEF_QUIZZES.map(quiz => (
              <DEFQuizCard key={quiz.id} quiz={quiz} />
            ))}
          </View>
        </DEFOnly>
        
        {/* BAC level interface - More academic */}
        <BACOnly>
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
        </BACOnly>
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
  // DEF Styles - More playful
  defHeader: {
    marginBottom: 20,
  },
  defTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  defSubtitle: {
    fontSize: 16,
  },
  defProgressContainer: {
    marginBottom: 24,
  },
  defProgressCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  defProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  defProgressTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  defProgressValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  defProgressText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  defQuizzesContainer: {
    marginBottom: 16,
  },
  defQuizCard: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  defQuizContent: {
    padding: 20,
    alignItems: 'center',
  },
  defQuizEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  defQuizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  defQuizInfo: {
    marginBottom: 16,
  },
  defQuizInfoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  defStartButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  defStartText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
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