// app/_tabs/courses/[courseId].js
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Header from '../../../components/common/Header';
import * as Theme from '../../../constants/Theme';

// Dummy course data - in a real app, this would come from an API or local database
const COURSES = {
  'bac-math': {
    id: 'bac-math',
    title: 'BAC Mathematics',
    description: 'Advanced mathematics course for BAC preparation covering algebra, calculus, and geometry.',
    level: 'Advanced',
    duration: '12 weeks',
    modules: [
      {
        id: 'module-1',
        title: 'Algebra Fundamentals',
        lessons: [
          { id: 'lesson-1', title: 'Polynomials', duration: '30 min', completed: false },
          { id: 'lesson-2', title: 'Equations', duration: '45 min', completed: false },
          { id: 'lesson-3', title: 'Inequalities', duration: '35 min', completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Calculus',
        lessons: [
          { id: 'lesson-4', title: 'Limits', duration: '40 min', completed: false },
          { id: 'lesson-5', title: 'Derivatives', duration: '50 min', completed: false },
          { id: 'lesson-6', title: 'Integrals', duration: '55 min', completed: false }
        ]
      }
    ]
  },
  'def-science': {
    id: 'def-science',
    title: 'DEF Science',
    description: 'Comprehensive science course for DEF preparation covering physics, chemistry, and biology.',
    level: 'Intermediate',
    duration: '10 weeks',
    modules: [
      {
        id: 'module-1',
        title: 'Physics Basics',
        lessons: [
          { id: 'lesson-1', title: 'Mechanics', duration: '35 min', completed: false },
          { id: 'lesson-2', title: 'Electricity', duration: '40 min', completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Chemistry',
        lessons: [
          { id: 'lesson-3', title: 'Elements', duration: '30 min', completed: false },
          { id: 'lesson-4', title: 'Reactions', duration: '45 min', completed: false }
        ]
      }
    ]
  },
  'english-beginner': {
    id: 'english-beginner',
    title: 'English for Beginners',
    description: 'Foundational English language course covering vocabulary, grammar, and conversation.',
    level: 'Beginner',
    duration: '8 weeks',
    modules: [
      {
        id: 'module-1',
        title: 'Basic Vocabulary',
        lessons: [
          { id: 'lesson-1', title: 'Greetings', duration: '20 min', completed: false },
          { id: 'lesson-2', title: 'Numbers', duration: '25 min', completed: false }
        ]
      },
      {
        id: 'module-2',
        title: 'Grammar',
        lessons: [
          { id: 'lesson-3', title: 'Present Tense', duration: '30 min', completed: false },
          { id: 'lesson-4', title: 'Past Tense', duration: '35 min', completed: false }
        ]
      }
    ]
  }
};

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  
  const theme = Theme.createTheme(false); // Pass true for dark mode

  useEffect(() => {
    // In a real app, you would fetch the course data from an API
    // For now, we're using the dummy data
    setCourse(COURSES[courseId]);
    
    // Initialize all modules as expanded
    if (COURSES[courseId]) {
      const modules = COURSES[courseId].modules;
      const initialExpanded = {};
      modules.forEach(module => {
        initialExpanded[module.id] = true; // Set all modules to expanded initially
      });
      setExpandedModules(initialExpanded);
    }
  }, [courseId]);

  // Toggle module expansion
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (!course) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Course Details" />
        <View style={styles.centerContent}>
          <Text style={{ color: theme.colors.text }}>Loading course...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <Header title={course.title} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card
          elevated
          style={styles.courseInfoCard}
        >
          <Text style={[styles.courseDescription, { color: theme.colors.text }]}>
            {course.description}
          </Text>
          
          <View style={styles.courseMetaContainer}>
            <View style={styles.courseMetaItem}>
              <Text style={[styles.courseMetaLabel, { color: theme.colors.text + '80' }]}>
                Level
              </Text>
              <Text style={[styles.courseMetaValue, { color: theme.colors.text }]}>
                {course.level}
              </Text>
            </View>
            
            <View style={styles.courseMetaItem}>
              <Text style={[styles.courseMetaLabel, { color: theme.colors.text + '80' }]}>
                Duration
              </Text>
              <Text style={[styles.courseMetaValue, { color: theme.colors.text }]}>
                {course.duration}
              </Text>
            </View>
          </View>
          
          <Button
            label="Start Learning"
            variant="primary"
            style={styles.startButton}
          />
        </Card>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Course Content
        </Text>
        
        {course.modules.map((module, index) => (
          <Card
            key={module.id}
            variant="outlined"
            style={styles.moduleCard}
          >
            <TouchableOpacity
              style={styles.moduleHeader}
              onPress={() => toggleModule(module.id)}
            >
              <View style={styles.moduleHeaderContent}>
                <Text style={[styles.moduleNumber, { color: theme.colors.primary }]}>
                  Module {index + 1}
                </Text>
                <Text style={[styles.moduleTitle, { color: theme.colors.text }]}>
                  {module.title}
                </Text>
                <Text style={[styles.lessonCount, { color: theme.colors.text + '80' }]}>
                  {module.lessons.length} lessons
                </Text>
              </View>
              
              <Text style={{ color: theme.colors.primary, fontSize: 20 }}>
                {expandedModules[module.id] ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedModules[module.id] && (
              <View style={styles.lessonsList}>
                {module.lessons.map((lesson, lessonIndex) => (
                  <TouchableOpacity
                    key={lesson.id}
                    style={[
                      styles.lessonItem,
                      lessonIndex < module.lessons.length - 1 && styles.lessonItemBorder,
                      { borderColor: theme.colors.border }
                    ]}
                    onPress={() => {
                      // Navigate to lesson screen
                      // router.push(`/lessons/${lesson.id}`);
                    }}
                  >
                    <View style={styles.lessonInfo}>
                      <Text style={[styles.lessonTitle, { color: theme.colors.text }]}>
                        {lesson.title}
                      </Text>
                      <Text style={[styles.lessonDuration, { color: theme.colors.text + '80' }]}>
                        {lesson.duration}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.lessonStatus,
                        { 
                          backgroundColor: lesson.completed 
                            ? theme.colors.primary 
                            : theme.colors.card 
                        }
                      ]}
                    >
                      {lesson.completed && (
                        <Text style={{ color: '#FFFFFF', fontSize: 12 }}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
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
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseInfoCard: {
    marginBottom: 24,
  },
  courseDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseMetaItem: {
    marginRight: 24,
  },
  courseMetaLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  courseMetaValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  moduleCard: {
    marginBottom: 12,
    padding: 0,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  moduleHeaderContent: {
    flex: 1,
  },
  moduleNumber: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonCount: {
    fontSize: 12,
  },
  lessonsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  lessonItemBorder: {
    borderBottomWidth: 1,
  },
  lessonInfo: {
    flex: 1,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
  },
  lessonStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});