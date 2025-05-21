// app/_tabs/courses/DEF/index.js
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../constants/ThemeContext';

// Mock course data
const DEF_COURSES = [
  {
    id: 'def-math',
    title: 'Mathématiques',
    emoji: '🧮',
    lessonsCount: 12,
    progress: 0.4,
    color: '#8B5CF6'
  },
  {
    id: 'def-science',
    title: 'Sciences',
    emoji: '🧪',
    lessonsCount: 10,
    progress: 0.7,
    color: '#10B981'
  },
  {
    id: 'def-french',
    title: 'Français',
    emoji: '📚',
    lessonsCount: 15,
    progress: 0.2,
    color: '#F59E0B'
  }
];

export default function DEFCoursesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Simple progress bar component
  const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
  
  // DEF Course Card - Simple and colorful
  const DEFCourseCard = ({ course }) => (
    <TouchableOpacity
      style={[styles.defCourseCard, { backgroundColor: course.color + '20' }]}
      onPress={() => router.push(`/_tabs/courses/${course.id}`)}
      activeOpacity={0.8}
    >
      <Text style={styles.defCourseEmoji}>{course.emoji}</Text>
      <Text style={[styles.defCourseTitle, { color: theme.text }]}>{course.title}</Text>
      
      <View style={styles.defCourseInfo}>
        <Text style={[styles.defCourseLessons, { color: theme.textSecondary }]}>
          {course.lessonsCount} leçons
        </Text>
        <ProgressBar progress={course.progress} color={course.color} />
        <Text style={[styles.defCourseProgress, { color: theme.textSecondary }]}>
          {Math.round(course.progress * 100)}% terminé
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.defHeader}>
          <Text style={[styles.defTitle, { color: theme.text }]}>Mes Cours</Text>
          <Text style={[styles.defSubtitle, { color: theme.textSecondary }]}>
            Continue ton apprentissage!
          </Text>
        </View>
        
        <View style={styles.defCoursesContainer}>
          {DEF_COURSES.map(course => (
            <DEFCourseCard key={course.id} course={course} />
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
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
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
  defCoursesContainer: {
    marginTop: 16,
  },
  defCourseCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  defCourseEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  defCourseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  defCourseInfo: {
    width: '100%',
  },
  defCourseLessons: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  defCourseProgress: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});