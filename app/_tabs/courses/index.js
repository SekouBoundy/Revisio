// app/_tabs/courses/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Card from '../../../components/common/Card';
import * as Theme from '../../../constants/Theme';

// Dummy course data - in a real app, this would come from an API or local database
const COURSES = [
  {
    id: 'bac-math',
    title: 'BAC Mathematics',
    description: 'Advanced mathematics course for BAC preparation',
    level: 'Advanced',
    type: 'BAC',
    progress: 0.2,
    imageUrl: null // You can add actual images later
  },
  {
    id: 'bac-physics',
    title: 'BAC Physics',
    description: 'Comprehensive physics course for BAC preparation',
    level: 'Advanced',
    type: 'BAC',
    progress: 0.1,
    imageUrl: null
  },
  {
    id: 'def-science',
    title: 'DEF Science',
    description: 'Science fundamentals for DEF preparation',
    level: 'Intermediate',
    type: 'DEF',
    progress: 0.5,
    imageUrl: null
  },
  {
    id: 'def-math',
    title: 'DEF Mathematics',
    description: 'Core mathematics concepts for DEF preparation',
    level: 'Intermediate',
    type: 'DEF',
    progress: 0.3,
    imageUrl: null
  },
  {
    id: 'english-beginner',
    title: 'English for Beginners',
    description: 'Start your journey with English language basics',
    level: 'Beginner',
    type: 'LANGUAGE',
    progress: 0.8,
    imageUrl: null
  },
  {
    id: 'arabic-intermediate',
    title: 'Intermediate Arabic',
    description: 'Build upon your Arabic language foundations',
    level: 'Intermediate',
    type: 'LANGUAGE',
    progress: 0.4,
    imageUrl: null
  }
];

// Categories for filtering
const CATEGORIES = [
  { id: 'all', label: 'All Courses' },
  { id: 'BAC', label: 'BAC Preparation' },
  { id: 'DEF', label: 'DEF Preparation' },
  { id: 'LANGUAGE', label: 'Language Learning' }
];

export default function CoursesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Filter courses based on search query and selected category
  const filteredCourses = COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Render a progress bar
  const ProgressBar = ({ progress }) => {
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${progress * 100}%`,
              backgroundColor: theme.colors.primary
            }
          ]} 
        />
      </View>
    );
  };

  // Render a course card
  const renderCourseCard = ({ item }) => (
    <Card
      title={item.title}
      subtitle={item.description}
      onPress={() => router.push(`/_tabs/courses/${item.id}`)}
      style={styles.courseCard}
    >
      <View style={styles.courseCardContent}>
        <View style={styles.courseMetaRow}>
          <View style={styles.courseMetaItem}>
            <Text style={[styles.courseMetaLabel, { color: theme.colors.text + '80' }]}>
              Level
            </Text>
            <Text style={[styles.courseMetaValue, { color: theme.colors.text }]}>
              {item.level}
            </Text>
          </View>
          
          <View style={styles.courseMetaItem}>
            <Text style={[styles.courseMetaLabel, { color: theme.colors.text + '80' }]}>
              Progress
            </Text>
            <Text style={[styles.courseMetaValue, { color: theme.colors.text }]}>
              {Math.round(item.progress * 100)}%
            </Text>
          </View>
        </View>
        
        <ProgressBar progress={item.progress} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Courses
        </Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View 
          style={[
            styles.searchInputContainer,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search courses..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary
                },
                selectedCategory !== item.id && {
                  borderColor: theme.colors.border,
                  backgroundColor: 'transparent'
                }
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  { 
                    color: selectedCategory === item.id 
                      ? '#FFFFFF' 
                      : theme.colors.text
                  }
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>
      
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        renderItem={renderCourseCard}
        contentContainerStyle={styles.coursesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              No courses found for your search.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  coursesList: {
    padding: 16,
    paddingBottom: 32,
  },
  courseCard: {
    marginBottom: 16,
  },
  courseCardContent: {
    marginTop: 8,
  },
  courseMetaRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseMetaItem: {
    marginRight: 24,
  },
  courseMetaLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  courseMetaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});