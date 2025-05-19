// app/_tabs/courses/index.js
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

// Mock data for courses
const COURSES = [
  {
    id: 'def-science',
    title: 'DEF Science',
    category: 'DEF',
    progress: 0.7,
    lessonsCount: 8,
    color: '#10B981',
    icon: 'flask-outline'
  },
  {
    id: 'def-math',
    title: 'DEF Mathematics',
    category: 'DEF',
    progress: 0.45,
    lessonsCount: 14,
    color: '#8B5CF6',
    icon: 'calculator-outline'
  },
  {
    id: 'english-basics',
    title: 'English Basics',
    category: 'LANGUAGE',
    progress: 0.5,
    lessonsCount: 15,
    color: '#EC4899',
    icon: 'language-outline'
  }
];

export default function CoursesScreen() {
  const router = useRouter();
  
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {COURSES.map((course, index) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => router.push(`/_tabs/courses/${course.id}`)}
            activeOpacity={0.9}
          >
            {/* Course Icon Area */}
            <View 
              style={[
                styles.courseIconContainer, 
                { backgroundColor: course.color + '15' }  // Light background based on course color
              ]}
            >
              <Ionicons name={course.icon} size={42} color={course.color} />
            </View>
            
            {/* Course Info Area */}
            <View style={styles.courseInfoContainer}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseLessons}>{course.lessonsCount} lessons</Text>
              
              <ProgressBar progress={course.progress} color={course.color} />
              
              <View style={styles.courseFooter}>
                <Text style={styles.courseProgress}>
                  {Math.round(course.progress * 100)}% complete
                </Text>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{course.category}</Text>
                </View>
              </View>
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
    paddingBottom: 100, // Extra padding at the bottom to prevent content from being hidden by the tab bar
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