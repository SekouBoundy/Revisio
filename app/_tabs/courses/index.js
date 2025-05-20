// app/_tabs/courses/index.js - with level-based filtering
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';
import { STUDENT_LEVELS, useUser } from '../../../constants/UserContext';

// Complete mock data for courses with level information
const ALL_COURSES = [
  {
    id: 'def-science',
    title: 'DEF Science',
    category: 'DEF',
    progress: 0.7,
    lessonsCount: 8,
    color: '#10B981',
    icon: 'flask-outline',
    levels: [STUDENT_LEVELS.DEF] // Only for DEF students
  },
  {
    id: 'def-math',
    title: 'DEF Mathematics',
    category: 'DEF',
    progress: 0.45,
    lessonsCount: 14,
    color: '#8B5CF6',
    icon: 'calculator-outline',
    levels: [STUDENT_LEVELS.DEF] // Only for DEF students
  },
  {
    id: 'bac-math',
    title: 'BAC Mathematics',
    category: 'BAC',
    progress: 0.3,
    lessonsCount: 18,
    color: '#3B82F6',
    icon: 'calculator-outline',
    levels: [STUDENT_LEVELS.BAC] // Only for BAC students
  },
  {
    id: 'bac-physics',
    title: 'BAC Physics',
    category: 'BAC',
    progress: 0.2,
    lessonsCount: 16,
    color: '#EC4899',
    icon: 'flask-outline',
    levels: [STUDENT_LEVELS.BAC] // Only for BAC students
  },
  {
    id: 'english-basics',
    title: 'English Basics',
    category: 'LANGUAGE',
    progress: 0.5,
    lessonsCount: 15,
    color: '#F59E0B',
    icon: 'language-outline',
    levels: [STUDENT_LEVELS.LANGUAGE] // Only for language students
  },
  {
    id: 'arabic-basics',
    title: 'Arabic Basics',
    category: 'LANGUAGE',
    progress: 0.25,
    lessonsCount: 12,
    color: '#10B981',
    icon: 'language-outline',
    levels: [STUDENT_LEVELS.LANGUAGE] // Only for language students
  },
  {
    id: 'study-skills',
    title: 'Study Skills',
    category: 'GENERAL',
    progress: 0.6,
    lessonsCount: 8,
    color: '#6366F1',
    icon: 'book-outline',
    levels: [] // For all students (empty array means available to all)
  }
];

export default function CoursesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const { studentLevel } = useUser();
  
  // Filter courses based on user's level
  const filteredCourses = useMemo(() => {
    return ALL_COURSES.filter(course => {
      // If course has no level restrictions, show to everyone
      if (!course.levels || course.levels.length === 0) return true;
      
      // Otherwise, only show if user's level is included
      return course.levels.includes(studentLevel);
    });
  }, [studentLevel]);

  // Render Progress Bar
  const ProgressBar = ({ progress, color }) => {
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: color || '#10B981'
            }
          ]} 
        />
        <View style={styles.progressBarBackground} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {filteredCourses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              No courses available for your level yet. Check back soon!
            </Text>
          </View>
        ) : (
          filteredCourses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              style={[styles.courseCard, { backgroundColor: theme.cardBackground }]}
              onPress={() => router.push(`/_tabs/courses/${course.id}`)}
              activeOpacity={0.9}
            >
              {/* Course Icon Area */}
              <View 
                style={[
                  styles.courseIconContainer, 
                  { backgroundColor: isDarkMode ? course.color + '30' : course.color + '15' }
                ]}
              >
                <Ionicons name={course.icon} size={42} color={course.color} />
              </View>
              
              {/* Course Info Area */}
              <View style={[styles.courseInfoContainer, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.courseTitle, { color: theme.text }]}>{course.title}</Text>
                <Text style={[styles.courseLessons, { color: theme.textSecondary }]}>
                  {course.lessonsCount} lessons
                </Text>
                
                <ProgressBar progress={course.progress} color={course.color} />
                
                <View style={styles.courseFooter}>
                  <Text style={[styles.courseProgress, { color: theme.textSecondary }]}>
                    {Math.round(course.progress * 100)}% complete
                  </Text>
                  <View style={[styles.categoryBadge, { backgroundColor: isDarkMode ? '#333' : '#F3F4F6' }]}>
                    <Text style={[styles.categoryText, { color: theme.textSecondary }]}>
                      {course.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    paddingBottom: 100, // Extra padding at the bottom to prevent content from being hidden by the tab bar
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  courseCard: {
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
    overflow: 'hidden',
  },
  courseIconContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseInfoContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseLessons: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseProgress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  }
});