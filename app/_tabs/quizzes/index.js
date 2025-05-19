// app/_tabs/quizzes/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Card from '../../../components/common/Card';
import * as Theme from '../../../constants/Theme';

// Dummy quiz data - in a real app, this would come from an API
const QUIZZES = [
  {
    id: 'quiz-bac-math-1',
    title: 'Algebra Quiz',
    description: 'Test your knowledge of algebraic concepts',
    courseId: 'bac-math',
    courseName: 'BAC Mathematics',
    type: 'BAC',
    questions: 10,
    timeLimit: 15, // minutes
    completed: false,
    score: null
  },
  {
    id: 'quiz-bac-math-2',
    title: 'Calculus Fundamentals',
    description: 'Essential calculus concepts for BAC',
    courseId: 'bac-math',
    courseName: 'BAC Mathematics',
    type: 'BAC',
    questions: 15,
    timeLimit: 20,
    completed: true,
    score: 85
  },
  {
    id: 'quiz-def-science-1',
    title: 'Physics Basics',
    description: 'Test your understanding of basic physics',
    courseId: 'def-science',
    courseName: 'DEF Science',
    type: 'DEF',
    questions: 12,
    timeLimit: 18,
    completed: true,
    score: 92
  },
  {
    id: 'quiz-english-1',
    title: 'English Vocabulary',
    description: 'Basic English vocabulary test',
    courseId: 'english-beginner',
    courseName: 'English for Beginners',
    type: 'LANGUAGE',
    questions: 20,
    timeLimit: 15,
    completed: false,
    score: null
  },
  {
    id: 'quiz-arabic-1',
    title: 'Arabic Grammar',
    description: 'Test your Arabic grammar knowledge',
    courseId: 'arabic-intermediate',
    courseName: 'Intermediate Arabic',
    type: 'LANGUAGE',
    questions: 15,
    timeLimit: 20,
    completed: false,
    score: null
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', label: 'All Quizzes' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' }
];

export default function QuizzesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Filter quizzes based on selected category
  const filteredQuizzes = QUIZZES.filter(quiz => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'pending') return !quiz.completed;
    if (selectedCategory === 'completed') return quiz.completed;
    return true;
  });

  // Render a quiz card
  const renderQuizCard = ({ item }) => (
    <Card
      title={item.title}
      subtitle={item.description}
      onPress={() => router.push(`/_tabs/quizzes/${item.id}`)}
      style={styles.quizCard}
    >
      <View style={styles.quizCardContent}>
        <View style={styles.quizMetaRow}>
          <View style={styles.quizMetaItem}>
            <Text style={[styles.quizMetaLabel, { color: theme.colors.text + '80' }]}>
              Course
            </Text>
            <Text style={[styles.quizMetaValue, { color: theme.colors.text }]}>
              {item.courseName}
            </Text>
          </View>
          
          <View style={styles.quizInfoContainer}>
            <View style={styles.quizInfoItem}>
              <Ionicons name="help-circle-outline" size={16} color={theme.colors.text + '80'} />
              <Text style={[styles.quizInfoText, { color: theme.colors.text }]}>
                {item.questions} Questions
              </Text>
            </View>
            
            <View style={styles.quizInfoItem}>
              <Ionicons name="time-outline" size={16} color={theme.colors.text + '80'} />
              <Text style={[styles.quizInfoText, { color: theme.colors.text }]}>
                {item.timeLimit} Minutes
              </Text>
            </View>
          </View>
        </View>
        
        {item.completed ? (
          <View style={styles.quizResultContainer}>
            <View 
              style={[
                styles.scoreContainer, 
                { 
                  backgroundColor: item.score >= 70 ? '#10B981' : '#F59E0B',
                  opacity: 0.9
                }
              ]}
            >
              <Text style={styles.scoreText}>{item.score}%</Text>
            </View>
            <Text style={[styles.completedText, { color: theme.colors.text + '80' }]}>
              Completed
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push(`/_tabs/quizzes/${item.id}`)}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Quizzes
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary
                },
                selectedCategory !== item.id && {
                  borderColor: theme.colors.border,
                  backgroundColor: 'transparent'
                }
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  { 
                    color: selectedCategory === item.id 
                      ? '#FFFFFF' 
                      : theme.colors.text
                  }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>
      
      <FlatList
        data={filteredQuizzes}
        keyExtractor={item => item.id}
        renderItem={renderQuizCard}
        contentContainerStyle={styles.quizzesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No quizzes found for this category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  quizzesList: {
    padding: 16,
    paddingBottom: 32,
  },
  quizCard: {
    marginBottom: 16,
  },
  quizCardContent: {
    marginTop: 8,
  },
  quizMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quizMetaItem: {
    flex: 1,
  },
  quizMetaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  quizMetaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  quizInfoContainer: {
    flexDirection: 'row',
  },
  quizInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quizInfoText: {
    fontSize: 13,
    marginLeft: 4,
  },
  quizResultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 14,
    marginLeft: 8,
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});