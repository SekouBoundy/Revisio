// app/_tabs/courses/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as Theme from '../../../constants/Theme';

// Mock data for courses
const COURSES = [
  {
    id: 'bac-math',
    title: 'BAC Mathematics',
    description: 'Advanced mathematics course for BAC preparation',
    category: 'BAC',
    image: null, // We'll use placeholder colors instead of images
    progress: 0.2,
    lessonsCount: 12,
    color: '#4361FF'
  },
  {
    id: 'bac-physics',
    title: 'BAC Physics',
    description: 'Comprehensive physics course for BAC preparation',
    category: 'BAC',
    image: null,
    progress: 0.35,
    lessonsCount: 10,
    color: '#F59E0B'
  },
  {
    id: 'def-science',
    title: 'DEF Science',
    description: 'Science fundamentals for DEF preparation',
    category: 'DEF',
    image: null,
    progress: 0.7,
    lessonsCount: 8,
    color: '#10B981'
  },
  {
    id: 'english-basics',
    title: 'English Basics',
    description: 'Fundamental English language skills',
    category: 'LANGUAGE',
    image: null,
    progress: 0.5,
    lessonsCount: 15,
    color: '#8B5CF6'
  },
  {
    id: 'arabic-intermediate',
    title: 'Arabic Intermediate',
    description: 'Improve your Arabic language proficiency',
    category: 'LANGUAGE',
    image: null,
    progress: 0.1,
    lessonsCount: 12,
    color: '#EC4899'
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'BAC', label: 'BAC' },
  { id: 'DEF', label: 'DEF' },
  { id: 'LANGUAGE', label: 'Languages' }
];

// Featured Courses
const FEATURED_COURSES = COURSES.slice(0, 2);

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const router = useRouter();
  
  // Use try-catch in case Theme functions are undefined
  let theme;
  try {
    theme = Theme.createTheme(false); // Pass true for dark mode
  } catch (error) {
    console.error('Error creating theme:', error);
    // Fallback theme in case theme creation fails
    theme = {
      colors: {
        background: '#FFFFFF',
        text: '#000000',
        primary: '#4361FF',
        card: '#F5F5F5',
        border: '#E0E0E0'
      }
    };
  }
  
  // Filter courses based on search and category
  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Render Progress Bar
  const ProgressBar = ({ progress, color }) => {
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: color || theme.colors.primary
            }
          ]} 
        />
      </View>
    );
  };
  
  // Render Course Card
  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push(`/_tabs/courses/${item.id}`)}
      activeOpacity={0.7}
    >
      <View 
        style={[
          styles.courseImageContainer,
          { backgroundColor: item.color + '20' } // Use course color with transparency
        ]}
      >
        <Ionicons 
          name={
            item.category === 'BAC' ? 'calculator-outline' : 
            item.category === 'DEF' ? 'flask-outline' : 
            'language-outline'
          } 
          size={30} 
          color={item.color} 
        />
      </View>
      
      <View style={styles.courseContent}>
        <Text style={styles.courseTitle} numberOfLines={1}>
          {item.title}
        </Text>
        
        <Text style={styles.courseLessons}>
          {item.lessonsCount} lessons
        </Text>
        
        <ProgressBar progress={item.progress} color={item.color} />
        
        <View style={styles.courseFooter}>
          <Text style={styles.courseProgress}>
            {Math.round(item.progress * 100)}% complete
          </Text>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Render Featured Course
  const renderFeaturedCourse = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.featuredCourse, { backgroundColor: item.color + '10' }]}
      onPress={() => router.push(`/_tabs/courses/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.featuredContent}>
        <View 
          style={[
            styles.featuredIcon,
            { backgroundColor: item.color + '20' }
          ]}
        >
          <Ionicons 
            name={
              item.category === 'BAC' ? 'calculator-outline' : 
              item.category === 'DEF' ? 'flask-outline' : 
              'language-outline'
            }
            size={24} 
            color={item.color} 
          />
        </View>
        
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Featured</Text>
        </View>
        
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredDesc} numberOfLines={2}>{item.description}</Text>
        
        <ProgressBar progress={item.progress} color={item.color} />
        
        <View style={styles.featuredFooter}>
          <Text style={styles.featuredProgress}>{Math.round(item.progress * 100)}% complete</Text>
          <Text style={styles.featuredLessons}>{item.lessonsCount} lessons</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Featured Courses */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Courses</Text>
          <View style={styles.featuredContainer}>
            {FEATURED_COURSES.map(course => renderFeaturedCourse(course))}
          </View>
        </View>
        
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text 
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && styles.categoryButtonTextActive
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* All Courses */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Courses' : `${selectedCategory} Courses`}
          </Text>
          
          {filteredCourses.length > 0 ? (
            <View style={styles.coursesGrid}>
              {filteredCourses.map(course => (
                <View key={course.id} style={styles.courseCardWrapper}>
                  {renderCourseCard({ item: course })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No courses found</Text>
              <Text style={styles.emptySubtext}>Try a different search term or category</Text>
            </View>
          )}
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
  searchContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#1F2937',
  },
  featuredContainer: {
    paddingHorizontal: 16,
  },
  featuredCourse: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featuredContent: {
    padding: 16,
  },
  featuredIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featuredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4361FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 16,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  featuredProgress: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  featuredLessons: {
    fontSize: 13,
    color: '#4B5563',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
  },
  categoryButtonActive: {
    backgroundColor: '#4361FF',
  },
  categoryButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  courseCardWrapper: {
    width: '50%',
    padding: 8,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courseImageContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseLessons: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  courseProgress: {
    fontSize: 11,
    color: '#4B5563',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#4B5563',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
  }
});