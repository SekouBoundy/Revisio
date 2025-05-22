// File: app/courses/BAC/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

// Mock BAC course data
const BAC_COURSES = [
  {
    id: 'bac-integrals',
    title: 'Intégrales',
    description: 'Étude des intégrales et applications',
    lessonsCount: 18,
    progress: 0.65,
    color: '#3B82F6',
    icon: 'calculator-outline',
  },
  {
    id: 'bac-physics',
    title: 'Forces',
    description: 'Mécanique, électricité et optique',
    lessonsCount: 16,
    progress: 0,
    color: '#EC4899',
    icon: 'flask-outline',
  },
  {
    id: 'bac-literature',
    title: 'Littérature',
    description: 'Analyse de texte et méthodologie de dissertation',
    lessonsCount: 14,
    progress: 0,
    color: '#F59E0B',
    icon: 'book-outline',
  },
];

export default function BACCoursesScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useContext(ThemeContext);

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

  const CourseCard = ({ course }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
      activeOpacity={0.7}
      onPress={() => router.push(`/courses/${course.id}`)}
    >
      <View
        style={[
          styles.cardHeader,
          { backgroundColor: isDarkMode ? course.color + '30' : course.color + '15' },
        ]}
      >
        <Ionicons name={course.icon} size={28} color={course.color} />
        <Text style={[styles.cardTitle, { color: theme.text }]}>{course.title}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>  
          {course.description}
        </Text>
        <View style={styles.cardStats}>
          <Text style={[styles.statText, { color: theme.textSecondary }]}>  
            {course.lessonsCount} leçons
          </Text>
          <Text style={[styles.statText, { color: course.color }]}>  
            {Math.round(course.progress * 100)}% terminé
          </Text>
        </View>
        <ProgressBar progress={course.progress} color={course.color} />
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: course.color }]}
            onPress={() => router.push(`/courses/${course.id}`)}
          >
            <Text style={styles.buttonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Programme de cours</Text>
        </View>

        <View style={styles.overallProgressSection}>
          <Text style={[styles.overallTitle, { color: theme.text }]}>Votre progression</Text>
          <View
            style={[
              styles.overallBarBackground,
              { backgroundColor: isDarkMode ? '#333' : '#E5E7EB' },
            ]}
          >
            <View
              style={[
                styles.overallBarFill,
                { width: '65%', backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.overallText, { color: theme.textSecondary }]}>65% du programme complété</Text>
        </View>

        <View style={styles.coursesList}>
          {BAC_COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 16, paddingBottom: 80 },

  headerSection: { marginBottom: 24 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },

  overallProgressSection: { marginBottom: 24 },
  overallTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  overallBarBackground: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  overallBarFill: { height: '100%', borderRadius: 4 },
  overallText: { fontSize: 14 },

  coursesList: { marginBottom: 16 },
  card: { borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  cardBody: { padding: 16 },
  cardDesc: { fontSize: 14, marginBottom: 12 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statText: { fontSize: 14 },

  progressBarContainer: { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#E5E7EB', marginVertical: 8 },
  progressBar: { height: '100%', borderRadius: 4 },

  cardFooter: { marginTop: 16, alignItems: 'flex-end' },
  button: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  buttonText: { color: '#FFF', fontWeight: '600', fontSize: 14 },
});
