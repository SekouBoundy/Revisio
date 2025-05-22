// File: app/quizzes/DEF/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

// Mock DEF quizzes data
const DEF_QUIZZES = [
  {
    id: 'def-quiz-integrals',
    title: 'Quiz Intégrales',
    questionsCount: 10,
    progress: 0.3,
    color: '#3B82F6',
    icon: 'help-circle-outline',
  },
  {
    id: 'def-quiz-forces',
    title: 'Quiz Forces',
    questionsCount: 12,
    progress: 0,
    color: '#EC4899',
    icon: 'help-circle-outline',
  },
  {
    id: 'def-quiz-lit',
    title: 'Quiz Littérature',
    questionsCount: 8,
    progress: 0.5,
    color: '#F59E0B',
    icon: 'help-circle-outline',
  },
];

export default function DEFQuizzesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();

  const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressBarContainer}>
      <View
        style={[
          styles.progressBar,
          { width: `${Math.round(progress * 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
  );

  const QuizCard = ({ quiz }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/quizzes/${quiz.id}`)}
    >
      <View
        style={[
          styles.cardHeader,
          { backgroundColor: isDarkMode ? quiz.color + '30' : quiz.color + '15' },
        ]}
      >
        <Ionicons name={quiz.icon} size={28} color={quiz.color} />
        <Text style={[styles.cardTitle, { color: theme.text }]}>{quiz.title}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.statText, { color: theme.textSecondary }]}>   
          {quiz.questionsCount} questions
        </Text>
        <ProgressBar progress={quiz.progress} color={quiz.color} />

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: quiz.color }]}
            onPress={() => router.push(`/quizzes/${quiz.id}`)}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Quiz DEF</Text>
        <View style={styles.cardsList}>
          {DEF_QUIZZES.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  cardsList: {},

  card: { borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  cardBody: { padding: 16 },
  statText: { fontSize: 14, marginBottom: 8 },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: { height: '100%', borderRadius: 4 },

  cardFooter: { alignItems: 'flex-end', marginTop: 8 },
  button: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
