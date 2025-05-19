// app/_tabs/quizzes/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Mock data for quizzes
const QUIZZES = [
  {
    id: 'quiz-1',
    title: 'Science Basics',
    course: 'DEF Science',
    questionCount: 10,
    duration: 15, // minutes
    completed: false,
    color: '#10B981'
  },
  {
    id: 'quiz-2',
    title: 'Math Fundamentals',
    course: 'DEF Mathematics',
    questionCount: 15,
    duration: 20,
    completed: false,
    color: '#8B5CF6'
  },
  {
    id: 'quiz-3',
    title: 'English Vocabulary',
    course: 'English Basics',
    questionCount: 20,
    duration: 25,
    completed: false,
    color: '#EC4899'
  }
];

export default function QuizzesScreen() {
  const router = useRouter();

  // If no quizzes are available
  if (QUIZZES.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Quizzes</Text>
          <Text style={styles.emptyMessage}>Your quizzes will appear here</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Available Quizzes</Text>
        
        {QUIZZES.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            style={styles.quizCard}
            onPress={() => router.push(`/_tabs/quizzes/${quiz.id}`)}
            activeOpacity={0.9}
          >
            <View style={[styles.quizIconContainer, { backgroundColor: quiz.color + '15' }]}>
              <Ionicons name="help-circle-outline" size={24} color={quiz.color} />
            </View>
            
            <View style={styles.quizContent}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <Text style={styles.quizCourse}>{quiz.course}</Text>
              
              <View style={styles.quizDetails}>
                <View style={styles.quizDetailItem}>
                  <Ionicons name="help-outline" size={16} color="#6B7280" />
                  <Text style={styles.quizDetailText}>{quiz.questionCount} questions</Text>
                </View>
                
                <View style={styles.quizDetailItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.quizDetailText}>{quiz.duration} minutes</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={[styles.startButton, { backgroundColor: quiz.color }]}
                onPress={() => router.push(`/_tabs/quizzes/${quiz.id}`)}
              >
                <Text style={styles.startButtonText}>Start Quiz</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  quizCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  quizIconContainer: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizContent: {
    flex: 1,
    padding: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  quizCourse: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quizDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quizDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quizDetailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  startButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});