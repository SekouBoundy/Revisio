import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Header from '../../../components/common/Header';
import Theme from '../../../constants/Theme';

// Mock data for course details
const COURSES = {
  '1': {
    id: '1',
    title: 'Mathematics for BAC',
    category: 'bac',
    description: 'Master key mathematical concepts and problem-solving techniques essential for success in the BAC examination. This comprehensive course covers algebra, calculus, geometry, and more.',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to Functions',
        duration: '45 min',
        completed: true,
      },
      {
        id: '1-2',
        title: 'Limits and Continuity',
        duration: '60 min',
        completed: true,
      },
      {
        id: '1-3',
        title: 'Differentiation Rules',
        duration: '50 min',
        completed: true,
      },
      {
        id: '1-4',
        title: 'Applications of Derivatives',
        duration: '55 min',
        completed: false,
      },
      {
        id: '1-5',
        title: 'Integration Techniques',
        duration: '65 min',
        completed: false,
      },
      {
        id: '1-6',
        title: 'Numerical Integration',
        duration: '45 min',
        completed: false,
      },
      {
        id: '1-7',
        title: 'Vector Calculus',
        duration: '50 min',
        completed: false,
      },
    ],
    instructor: 'Dr. Ahmed Benali',
    totalQuizzes: 4,
  },
  '2': {
    id: '2',
    title: 'Physics & Chemistry',
    category: 'bac',
    description: 'A comprehensive review of physics and chemistry topics for BAC preparation, covering mechanics, electricity, thermodynamics, organic chemistry, and more.',
    lessons: [
      {
        id: '2-1',
        title: 'Mechanics: Forces and Motion',
        duration: '55 min',
        completed: true,
      },
      {
        id: '2-2',
        title: 'Electricity and Magnetism',
        duration: '60 min',
        completed: true,
      },
      {
        id: '2-3',
        title: 'Thermodynamics',
        duration: '50 min',
        completed: false,
      },
      {
        id: '2-4',
        title: 'Wave Properties',
        duration: '45 min',
        completed: false,
      },
      {
        id: '2-5',
        title: 'Atomic Structure',
        duration: '55 min',
        completed: false,
      },
    ],
    instructor: 'Prof. Fatima Zouhri',
    totalQuizzes: 3,
  },
};

// Lesson item component
const LessonItem = ({ lesson, onPress }) => (
  <TouchableOpacity
    style={[
      styles.lessonItem,
      lesson.completed && styles.lessonItemCompleted
    ]}
    onPress={onPress}
  >
    <View style={styles.lessonContent}>
      <View style={styles.lessonStatusContainer}>
        <View style={[
          styles.lessonStatusIndicator,
          lesson.completed && styles.lessonStatusCompleted
        ]} />
      </View>
      
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function CourseDetailScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    // Fetch course data (in a real app, this would be an API call)
    const fetchedCourse = COURSES[courseId];
    
    if (fetchedCourse) {
      setCourse(fetchedCourse);
      
      // Calculate completion stats
      const completed = fetchedCourse.lessons.filter(lesson => lesson.completed).length;
      setCompletedCount(completed);
      setProgressPercentage(Math.round((completed / fetchedCourse.lessons.length) * 100));
    }
  }, [courseId]);

  // Get color based on course category
  const getCategoryColor = () => {
    if (!course) return Theme.colors.primary;
    
    switch (course.category) {
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

  // Get category label
  const getCategoryLabel = () => {
    if (!course) return '';
    
    switch (course.category) {
      case 'bac':
        return 'BAC Prep';
      case 'def':
        return 'DEF Prep';
      case 'languages':
        return 'Languages';
      default:
        return course.category;
    }
  };

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading course...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header
        title={course.title}
        showBack={true}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Course header */}
        <View style={styles.courseHeader}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor() }
          ]}>
            <Text style={styles.categoryText}>{getCategoryLabel()}</Text>
          </View>
          
          <Text style={styles.courseTitle}>{course.title}</Text>
          
          <Text style={styles.instructorName}>
            Instructor: {course.instructor}
          </Text>
          
          <Text style={styles.courseDescription}>{course.description}</Text>
          
          {/* Progress section */}
          <View style={styles.progressSection}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{course.lessons.length}</Text>
                <Text style={styles.progressStatLabel}>Lessons</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{course.totalQuizzes}</Text>
                <Text style={styles.progressStatLabel}>Quizzes</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressStatValue}>{completedCount}</Text>
                <Text style={styles.progressStatLabel}>Completed</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%`, backgroundColor: getCategoryColor() }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{progressPercentage}% Complete</Text>
            </View>
          </View>
        </View>
        
        {/* Lessons section */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          
          {course.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              onPress={() => {
                // In a real app, navigate to lesson details
                console.log(`Navigate to lesson ${lesson.id}`);
              }}
            />
          ))}
        </View>
        
        {/* Quizzes card */}
        <Card
          variant="outlined"
          style={styles.quizzesCard}
          onPress={() => router.push('/quizzes')}
        >
          <View style={styles.quizzesCardContent}>
            <View>
              <Text style={styles.quizzesCardTitle}>Test Your Knowledge</Text>
              <Text style={styles.quizzesCardDescription}>
                Take quizzes to reinforce your learning
              </Text>
            </View>
            
            <Button
              variant="primary"
              size="small"
              onPress={() => router.push('/quizzes')}
            >
              View Quizzes
            </Button>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  courseHeader: {
    padding: Theme.layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Theme.layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.layout.borderRadius.small,
    marginBottom: Theme.layout.spacing.sm,
  },
  categoryText: {
    color: Theme.colors.white,
    fontSize: Theme.layout.fontSize.xs,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: Theme.layout.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.sm,
  },
  instructorName: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.md,
  },
  courseDescription: {
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textPrimary,
    lineHeight: 22,
    marginBottom: Theme.layout.spacing.lg,
  },
  progressSection: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.layout.borderRadius.medium,
    padding: Theme.layout.spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Theme.layout.spacing.md,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: Theme.layout.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
  },
  progressStatLabel: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Theme.colors.border,
    borderRadius: 4,
    marginBottom: Theme.layout.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
  lessonsSection: {
    padding: Theme.layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  lessonItem: {
    backgroundColor: Theme.colors.backgroundPrimary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.layout.borderRadius.medium,
    marginBottom: Theme.layout.spacing.md,
    overflow: 'hidden',
  },
  lessonItemCompleted: {
    borderColor: Theme.colors.success,
  },
  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.layout.spacing.md,
  },
  lessonStatusContainer: {
    marginRight: Theme.layout.spacing.md,
  },
  lessonStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.border,
  },
  lessonStatusCompleted: {
    backgroundColor: Theme.colors.success,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '500',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textLight,
  },
  quizzesCard: {
    margin: Theme.layout.spacing.lg,
    marginTop: 0,
    marginBottom: Theme.layout.spacing.xxl,
  },
  quizzesCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizzesCardTitle: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  quizzesCardDescription: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
});