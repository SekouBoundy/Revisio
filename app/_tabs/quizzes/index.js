import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Card from '../../../components/common/Card';
import Theme from '../../../constants/Theme';

// Mock data for quizzes
const QUIZZES = [
  {
    id: '1',
    title: 'Mathematics: Calculus',
    courseId: '1',
    category: 'bac',
    description: 'Test your knowledge of derivatives and integrals',
    questions: 10,
    timeLimit: 15, // in minutes
    completed: false,
    locked: false,
  },
  {
    id: '2',
    title: 'Physics: Mechanics',
    courseId: '2',
    category: 'bac',
    description: 'Test your understanding of forces and motion',
    questions: 8,
    timeLimit: 12,
    completed: true,
    score: 85,
    locked: false,
  },
  {
    id: '3',
    title: 'English: Grammar Rules',
    courseId: '3',
    category: 'languages',
    description: 'Test your knowledge of English grammar',
    questions: 15,
    timeLimit: 20,
    completed: true,
    score: 92,
    locked: false,
  },
  {
    id: '4',
    title: 'Arabic: Vocabulary',
    courseId: '4',
    category: 'languages',
    description: 'Test your knowledge of Arabic vocabulary',
    questions: 12,
    timeLimit: 15,
    completed: false,
    locked: false,
  },
  {
    id: '5',
    title: 'Literature Analysis',
    courseId: '5',
    category: 'def',
    description: 'Test your literary analysis skills',
    questions: 10,
    timeLimit: 20,
    completed: false,
    locked: true,
  },
  {
    id: '6',
    title: 'History: Key Events',
    courseId: '6',
    category: 'def',
    description: 'Test your knowledge of important historical events',
    questions: 15,
    timeLimit: 18,
    completed: false,
    locked: true,
  },
];

// Quiz card component
const QuizCard = ({ quiz, onPress }) => {
  // Get color based on quiz category
  const getCategoryColor = () => {
    switch (quiz.category) {
      case 'bac':
        return Theme.colors.bac;
      case 'def':
        return Theme.colors.def;
      case 'languages':
        return Theme.colors.languages;
      default:
        return Theme.colors.primary;
    }
  };

  // Get status label and color
  const getStatusInfo = () => {
    if (quiz.locked) {
      return {
        label: 'Locked',
        color: Theme.colors.textLight,
        icon: '🔒',
      };
    } else if (quiz.completed) {
      return {
        label: `Score: ${quiz.score}%`,
        color: Theme.colors.success,
        icon: '✓',
      };
    } else {
      return {
        label: 'Available',
        color: getCategoryColor(),
        icon: '▶',
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card
      variant="default"
      style={[
        styles.quizCard,
        quiz.locked && styles.quizCardLocked
      ]}
      onPress={quiz.locked ? null : onPress}
    >
      <View style={styles.quizHeader}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
          <Text style={styles.statusText}>{statusInfo.label}</Text>
        </View>
      </View>
      
      <Text style={styles.quizDescription}>{quiz.description}</Text>
      
      <View style={styles.quizMetaContainer}>
        <View style={styles.quizMetaItem}>
          <Text style={styles.quizMetaValue}>{quiz.questions}</Text>
          <Text style={styles.quizMetaLabel}>Questions</Text>
        </View>
        
        <View style={styles.quizMetaItem}>
          <Text style={styles.quizMetaValue}>{quiz.timeLimit}m</Text>
          <Text style={styles.quizMetaLabel}>Time Limit</Text>
        </View>
        
        <View style={styles.quizMetaItem}>
          <Text style={styles.quizMetaValue}>{getCategoryColor() === Theme.colors.bac ? 'BAC' : getCategoryColor() === Theme.colors.def ? 'DEF' : 'Lang'}</Text>
          <Text style={styles.quizMetaLabel}>Category</Text>
        </View>
      </View>
    </Card>
  );
};

// Filter button component
const FilterButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.filterButton,
      active && styles.filterButtonActive
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        active && styles.filterButtonTextActive
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function QuizzesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filter quizzes based on active filter
  const getFilteredQuizzes = () => {
    switch (activeFilter) {
      case 'completed':
        return QUIZZES.filter(quiz => quiz.completed);
      case 'available':
        return QUIZZES.filter(quiz => !quiz.completed && !quiz.locked);
      case 'locked':
        return QUIZZES.filter(quiz => quiz.locked);
      default:
        return QUIZZES;
    }
  };

  const filteredQuizzes = getFilteredQuizzes();

  // Navigate to quiz details
  const handleQuizPress = (quizId) => {
    router.push(`/quizzes/${quizId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Quizzes</Text>
        
        {/* Filter buttons */}
        <View style={styles.filtersContainer}>
          <FilterButton
            title="All"
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterButton
            title="Completed"
            active={activeFilter === 'completed'}
            onPress={() => setActiveFilter('completed')}
          />
          <FilterButton
            title="Available"
            active={activeFilter === 'available'}
            onPress={() => setActiveFilter('available')}
          />
          <FilterButton
            title="Locked"
            active={activeFilter === 'locked'}
            onPress={() => setActiveFilter('locked')}
          />
        </View>
      </View>
      
      {/* Quiz list */}
      <ScrollView
        style={styles.quizzesContainer}
        contentContainerStyle={styles.quizzesContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onPress={() => handleQuizPress(quiz.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No quizzes found</Text>
            <Text style={styles.emptySubText}>
              {activeFilter === 'completed' ? 'You haven\'t completed any quizzes yet.' :
               activeFilter === 'available' ? 'No available quizzes right now. Complete more lessons to unlock quizzes.' :
               activeFilter === 'locked' ? 'No locked quizzes. All quizzes are available.' :
               'No quizzes available at the moment.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Theme.layout.spacing.lg,
    backgroundColor: Theme.colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.layout.spacing.md,
  },
  screenTitle: {
    fontSize: Theme.layout.fontSize.xxl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.layout.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: Theme.layout.spacing.sm,
    borderRadius: Theme.layout.borderRadius.medium,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  filterButtonText: {
    color: Theme.colors.textSecondary,
    fontWeight: '500',
    fontSize: Theme.layout.fontSize.sm,
  },
  filterButtonTextActive: {
    color: Theme.colors.white,
  },
  quizzesContainer: {
    flex: 1,
  },
  quizzesContent: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
  },
  quizCard: {
    marginBottom: Theme.layout.spacing.lg,
  },
  quizCardLocked: {
    opacity: 0.7,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.layout.spacing.sm,
  },
  quizTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    flex: 1,
    marginRight: Theme.layout.spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.layout.borderRadius.small,
  },
  statusIcon: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.white,
    marginRight: 4,
  },
  statusText: {
    color: Theme.colors.white,
    fontSize: Theme.layout.fontSize.xs,
    fontWeight: '600',
  },
  quizDescription: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.md,
  },
  quizMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: Theme.layout.spacing.sm,
    borderRadius: Theme.layout.borderRadius.small,
  },
  quizMetaItem: {
    alignItems: 'center',
    flex: 1,
  },
  quizMetaValue: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  quizMetaLabel: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.layout.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.sm,
  },
  emptySubText: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textLight,
    textAlign: 'center',
  },
});