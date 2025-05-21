// app/_tabs/courses/index.js
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

// Level-specific content components
const DEFOnly = ({ children }) => {
  const userContext = useContext(UserContext);
  const studentLevel = userContext?.studentLevel;
  return studentLevel === 'DEF' ? <>{children}</> : null;
};

const BACOnly = ({ children }) => {
  const userContext = useContext(UserContext);
  const studentLevel = userContext?.studentLevel;
  return studentLevel === 'BAC' ? <>{children}</> : null;
};

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

const BAC_COURSES = [
  {
    id: 'bac-math',
    title: 'Mathématiques',
    description: 'Fonctions, dérivées et intégrales pour le BAC',
    lessonsCount: 18,
    progress: 0.3,
    color: '#3B82F6',
    icon: 'calculator-outline'
  },
  {
    id: 'bac-physics',
    title: 'Physique',
    description: 'Mécanique, électricité et optique pour le BAC',
    lessonsCount: 16,
    progress: 0.2,
    color: '#EC4899',
    icon: 'flask-outline'
  },
  {
    id: 'bac-french',
    title: 'Littérature',
    description: 'Analyse de texte et dissertation pour le BAC',
    lessonsCount: 14,
    progress: 0.6,
    color: '#F59E0B',
    icon: 'book-outline'
  }
];

export default function CoursesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const userContext = useContext(UserContext);
  const studentLevel = userContext?.studentLevel || 'BAC';
  
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
  
  // BAC Course Card - More detailed
  const BACCourseCard = ({ course }) => (
    <TouchableOpacity
      style={[styles.bacCourseCard, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}
      onPress={() => router.push(`/_tabs/courses/${course.id}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.bacCourseHeader, { backgroundColor: isDarkMode ? course.color + '30' : course.color + '15' }]}>
        <Ionicons name={course.icon} size={30} color={course.color} />
        <Text style={[styles.bacCourseTitle, { color: theme.text }]}>{course.title}</Text>
      </View>
      
      <View style={styles.bacCourseContent}>
        <Text style={[styles.bacCourseDesc, { color: theme.textSecondary }]}>
          {course.description}
        </Text>
        
        <View style={styles.bacCourseStats}>
          <Text style={[styles.bacCourseLessons, { color: theme.textSecondary }]}>
            {course.lessonsCount} leçons
          </Text>
          <Text style={[styles.bacCourseProgress, { color: course.color }]}>
            {Math.round(course.progress * 100)}% terminé
          </Text>
        </View>
        
        <ProgressBar progress={course.progress} color={course.color} />
        
        <View style={styles.bacCourseButtons}>
          <TouchableOpacity 
            style={[styles.bacCourseButton, { backgroundColor: course.color }]}
            onPress={() => router.push(`/_tabs/courses/${course.id}`)}
          >
            <Text style={styles.bacCourseButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* DEF Student View - Simpler, more visual */}
        <DEFOnly>
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
        </DEFOnly>
        
        {/* BAC Student View - More academic */}
        <BACOnly>
          <View style={styles.bacHeader}>
            <Text style={[styles.bacTitle, { color: theme.text }]}>Programme de cours</Text>
            
            <View style={styles.bacFilterButtons}>
              <TouchableOpacity style={[styles.bacFilterButton, { backgroundColor: theme.primary }]}>
                <Text style={styles.bacFilterButtonTextActive}>Tous</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.bacFilterButton, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.bacFilterButtonText, { color: theme.textSecondary }]}>En cours</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.bacFilterButton, { backgroundColor: theme.cardBackground }]}>
                <Text style={[styles.bacFilterButtonText, { color: theme.textSecondary }]}>Terminés</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.bacProgress}>
            <Text style={[styles.bacProgressTitle, { color: theme.text }]}>Votre progression</Text>
            <View style={[styles.bacProgressBar, { backgroundColor: isDarkMode ? '#333' : '#E5E7EB' }]}>
              <View style={[styles.bacProgressFill, { width: '42%', backgroundColor: theme.primary }]} />
            </View>
            <Text style={[styles.bacProgressText, { color: theme.textSecondary }]}>42% du programme complété</Text>
          </View>
          
          <View style={styles.bacCoursesContainer}>
            {BAC_COURSES.map(course => (
              <BACCourseCard key={course.id} course={course} />
            ))}
          </View>
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
  
  // BAC Styles - More academic
  bacHeader: {
    marginBottom: 24,
  },
  bacTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bacFilterButtons: {
    flexDirection: 'row',
  },
  bacFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  bacFilterButtonText: {
    fontSize: 14,
  },
  bacFilterButtonTextActive: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bacProgress: {
    marginBottom: 24,
  },
  bacProgressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bacProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  bacProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  bacProgressText: {
    fontSize: 14,
  },
  bacCoursesContainer: {
    marginBottom: 16,
  },
  bacCourseCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bacCourseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  bacCourseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  bacCourseContent: {
    padding: 16,
  },
  bacCourseDesc: {
    fontSize: 14,
    marginBottom: 12,
  },
  bacCourseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bacCourseLessons: {
    fontSize: 14,
  },
  bacCourseProgress: {
    fontSize: 14,
    fontWeight: '500',
  },
  bacCourseButtons: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  bacCourseButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bacCourseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});