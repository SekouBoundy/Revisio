// app/_tabs/quizzes/DEF/index.js
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

// Mock quiz data for DEF
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

export default function DEFQuizzesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
  }
});