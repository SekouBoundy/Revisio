import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Card from '../../../components/common/Card';
import Theme from '../../../constants/Theme';

// Mock data for courses
const COURSES = [
  {
    id: '1',
    title: 'Mathematics for BAC',
    category: 'bac',
    description: 'Key concepts and practice problems for BAC mathematics',
    lessons: 24,
    progress: 35,
  },
  {
    id: '2',
    title: 'Physics & Chemistry',
    category: 'bac',
    description: 'Comprehensive review of physics and chemistry topics',
    lessons: 18,
    progress: 62,
  },
  {
    id: '3',
    title: 'English Communication',
    category: 'languages',
    description: 'Improve your English speaking and writing skills',
    lessons: 30,
    progress: 15,
  },
  {
    id: '4',
    title: 'Arabic Fundamentals',
    category: 'languages',
    description: 'Master the basics of Arabic grammar and vocabulary',
    lessons: 20,
    progress: 0,
  },
  {
    id: '5',
    title: 'Literature for DEF',
    category: 'def',
    description: 'Essential literature texts and analysis for DEF exam',
    lessons: 15,
    progress: 70,
  },
  {
    id: '6',
    title: 'History & Geography',
    category: 'def',
    description: 'Comprehensive review of key historical events and geography',
    lessons: 22,
    progress: 40,
  },
];

// Course card component
const CourseCard = ({ course, onPress }) => {
  // Get color based on course category
  const getCategoryColor = () => {
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

  return (
    <Card
      variant="default"
      style={styles.courseCard}
      onPress={onPress}
    >
      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
        <Text style={styles.categoryText}>{getCategoryLabel()}</Text>
      </View>
      
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.courseDescription}>{course.description}</Text>
      
      <View style={styles.courseMetaContainer}>
        <Text style={styles.lessonsCount}>{course.lessons} Lessons</Text>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${course.progress}%`, backgroundColor: getCategoryColor() }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{course.progress}%</Text>
        </View>
      </View>
    </Card>
  );
};

// Category tab component
const CategoryTab = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryTab,
      active && styles.categoryTabActive
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.categoryTabText,
        active && styles.categoryTabTextActive
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function CoursesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState(COURSES);

  // Filter courses based on search query and active category
  useEffect(() => {
    let result = COURSES;
    
    // Filter by category if not 'all'
    if (activeCategory !== 'all') {
      result = result.filter(course => course.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCourses(result);
  }, [searchQuery, activeCategory]);

  // Navigate to course details
  const handleCoursePress = (courseId) => {
    router.push(`/courses/${courseId}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.screenTitle}>My Courses</Text>
        
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor={Theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <CategoryTab
            title="All"
            active={activeCategory === 'all'}
            onPress={() => setActiveCategory('all')}
          />
          <CategoryTab
            title="BAC Prep"
            active={activeCategory === 'bac'}
            onPress={() => setActiveCategory('bac')}
          />
          <CategoryTab
            title="DEF Prep"
            active={activeCategory === 'def'}
            onPress={() => setActiveCategory('def')}
          />
          <CategoryTab
            title="Languages"
            active={activeCategory === 'languages'}
            onPress={() => setActiveCategory('languages')}
          />
        </ScrollView>
      </View>
      
      {/* Course list */}
      <ScrollView
        style={styles.coursesContainer}
        contentContainerStyle={styles.coursesContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => handleCoursePress(course.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses found</Text>
            <Text style={styles.emptySubText}>
              Try adjusting your search or category filters
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
  searchContainer: {
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.layout.borderRadius.medium,
    paddingHorizontal: Theme.layout.spacing.md,
    marginBottom: Theme.layout.spacing.md,
  },
  searchInput: {
    height: 40,
    color: Theme.colors.textPrimary,
    fontSize: Theme.layout.fontSize.md,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: Theme.layout.spacing.sm,
  },
  categoriesContent: {
    paddingRight: Theme.layout.spacing.lg,
  },
  categoryTab: {
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: Theme.layout.spacing.sm,
    marginRight: Theme.layout.spacing.sm,
    borderRadius: Theme.layout.borderRadius.medium,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  categoryTabActive: {
    backgroundColor: Theme.colors.primary,
  },
  categoryTabText: {
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: Theme.colors.white,
  },
  coursesContainer: {
    flex: 1,
  },
  coursesContent: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
  },
  courseCard: {
    marginBottom: Theme.layout.spacing.lg,
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
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.xs,
  },
  courseDescription: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.md,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonsCount: {
    fontSize: Theme.layout.fontSize.xs,
    color: Theme.colors.textLight,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: 3,
    marginRight: Theme.layout.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
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