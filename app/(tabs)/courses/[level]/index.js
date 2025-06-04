// app/(tabs)/courses/[level]/index.js - IMPROVED WITH CURVED HEADER AND SEARCH
import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemeContext } from '../../../../constants/ThemeContextContext';
import { useUser } from '../../../../constants/UserContext';

export default function LevelCoursesScreen() {
  const { level } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

  const isDefLevel = level === 'DEF';

  // Toggle search functionality
  const toggleSearch = () => {
    if (searchVisible) {
      // Hide search
      Keyboard.dismiss();
      setSearchQuery('');
      Animated.timing(searchAnimValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
      });
    } else {
      // Show search
      setSearchVisible(true);
      Animated.timing(searchAnimValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const CourseCard = ({ icon, title, subtitle, progress, color, difficulty, lessons, onPress }) => (
    <TouchableOpacity 
      style={[styles.courseCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.courseIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      
      <View style={styles.courseContent}>
        <Text style={[styles.courseTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.courseSubtitle, { color: theme.text + '80' }]}>{subtitle}</Text>
        
        <View style={styles.courseInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="book-outline" size={14} color={theme.text + '60'} />
            <Text style={[styles.infoText, { color: theme.text + '60' }]}>{lessons} leçons</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>
              {difficulty}
            </Text>
          </View>
        </View>

        {progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: theme.text + '80' }]}>
                Progression: {progress}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} 
              />
            </View>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return '#4CAF50';
      case 'Moyen': return '#FF9800';
      case 'Difficile': return '#F44336';
      default: return theme.primary;
    }
  };

  const getDefCourses = () => [
    {
      icon: 'language-outline',
      title: 'Français',
      subtitle: 'Grammaire, littérature et expression',
      progress: 65,
      color: '#FF9800',
      difficulty: 'Moyen',
      lessons: 24
    },
    {
      icon: 'calculator-outline',
      title: 'Mathématiques',
      subtitle: 'Algèbre, géométrie et calcul',
      progress: 45,
      color: '#2196F3',
      difficulty: 'Moyen',
      lessons: 28
    },
    {
      icon: 'flask-outline',
      title: 'Physique-Chimie',
      subtitle: 'Sciences physiques et chimiques',
      progress: 30,
      color: '#E91E63',
      difficulty: 'Moyen',
      lessons: 20
    },
    {
      icon: 'globe-outline',
      title: 'Histoire-Géographie',
      subtitle: 'Histoire du monde et géographie',
      progress: 75,
      color: '#9C27B0',
      difficulty: 'Facile',
      lessons: 22
    },
    {
      icon: 'leaf-outline',
      title: 'Sciences de la Vie et de la Terre',
      subtitle: 'Biologie et sciences naturelles',
      progress: 50,
      color: '#4CAF50',
      difficulty: 'Facile',
      lessons: 18
    },
    {
      icon: 'globe',
      title: 'Anglais',
      subtitle: 'Langue anglaise et communication',
      progress: 40,
      color: '#607D8B',
      difficulty: 'Moyen',
      lessons: 16
    },
    {
      icon: 'people-outline',
      title: 'Éducation Civique et Morale',
      subtitle: 'Citoyenneté et valeurs',
      progress: 80,
      color: '#795548',
      difficulty: 'Facile',
      lessons: 12
    },
    {
      icon: 'book-outline',
      title: 'Langue Arabe',
      subtitle: 'Littérature et grammaire arabe',
      progress: 35,
      color: '#FF5722',
      difficulty: 'Moyen',
      lessons: 20
    }
  ];

  const getBacCourses = () => {
    const coursesByTrack = {
      TSE: [
        { icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Analyse, algèbre et géométrie', color: '#2196F3', difficulty: 'Difficile', lessons: 32, progress: 68 },
        { icon: 'nuclear-outline', title: 'Physique', subtitle: 'Mécanique, thermodynamique, optique', color: '#E91E63', difficulty: 'Difficile', lessons: 28, progress: 45 },
        { icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie organique et minérale', color: '#9C27B0', difficulty: 'Difficile', lessons: 24, progress: 72 },
        { icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Biologie cellulaire et génétique', color: '#4CAF50', difficulty: 'Moyen', lessons: 20, progress: 56 },
        { icon: 'desktop-outline', title: 'Informatique', subtitle: 'Programmation et algorithmes', color: '#607D8B', difficulty: 'Moyen', lessons: 16, progress: 88 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Littérature et expression écrite', color: '#FF9800', difficulty: 'Moyen', lessons: 18, progress: 83 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Pensée critique et logique', color: '#795548', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Communication avancée', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 91 }
      ],
      TSEXP: [
        { icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Statistiques et probabilités', color: '#2196F3', difficulty: 'Difficile', lessons: 28, progress: 62 },
        { icon: 'nuclear-outline', title: 'Physique', subtitle: 'Physique expérimentale', color: '#E91E63', difficulty: 'Difficile', lessons: 26, progress: 55 },
        { icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie analytique', color: '#9C27B0', difficulty: 'Difficile', lessons: 22, progress: 71 },
        { icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Écologie et environnement', color: '#4CAF50', difficulty: 'Moyen', lessons: 24, progress: 64 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Analyse littéraire', color: '#FF9800', difficulty: 'Moyen', lessons: 16, progress: 81 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Éthique et sciences', color: '#795548', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Anglais scientifique', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 88 },
        { icon: 'fitness-outline', title: 'Éducation Physique et Sportive', subtitle: 'Sport et santé', color: '#FF5722', difficulty: 'Facile', lessons: 10, progress: 95 }
      ],
      TSECO: [
        { icon: 'calculator-outline', title: 'Mathématiques appliquées', subtitle: 'Statistiques économiques', color: '#2196F3', difficulty: 'Moyen', lessons: 24, progress: 58 },
        { icon: 'trending-up-outline', title: 'Économie', subtitle: 'Microéconomie et macroéconomie', color: '#4CAF50', difficulty: 'Moyen', lessons: 28, progress: 73 },
        { icon: 'briefcase-outline', title: 'Gestion', subtitle: 'Management et organisation', color: '#607D8B', difficulty: 'Moyen', lessons: 22, progress: 64 },
        { icon: 'document-text-outline', title: 'Droit', subtitle: 'Droit commercial et civil', color: '#795548', difficulty: 'Moyen', lessons: 20 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Communication professionnelle', color: '#FF9800', difficulty: 'Moyen', lessons: 16, progress: 81 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Philosophie politique', color: '#9C27B0', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Anglais des affaires', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 87 },
        { icon: 'globe-outline', title: 'Histoire-Géographie', subtitle: 'Géographie économique', color: '#E91E63', difficulty: 'Facile', lessons: 18, progress: 92 },
        { icon: 'people-outline', title: 'Éducation Civique', subtitle: 'Citoyenneté et société', color: '#FF5722', difficulty: 'Facile', lessons: 10, progress: 96 }
      ]
    };

    return coursesByTrack[level] || coursesByTrack.TSE;
  };

  // Filter courses based on search query
  const filterCourses = (courses) => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(course => 
      course.title.toLowerCase().includes(query) ||
      course.subtitle.toLowerCase().includes(query) ||
      course.difficulty.toLowerCase().includes(query)
    );
  };

  const coursesData = isDefLevel ? getDefCourses() : getBacCourses();
  const filteredCourses = filterCourses(coursesData);
  const hasSearchResults = searchQuery.trim().length > 0;

  // Header Component - with curved design like dashboard and schedule
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Cours DEF' : `Cours ${level}`}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Catalogue de Cours
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[
              styles.searchButton, 
              { backgroundColor: searchVisible ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)' }
            ]}
            onPress={toggleSearch}
          >
            <Ionicons 
              name={searchVisible ? "close" : "search"} 
              size={20} 
              color={searchVisible ? theme.primary : "#FFFFFF"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={() => console.log('Filter')}
          >
            <Ionicons name="filter" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Stats Card - overlapping like other screens
  const StatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {coursesData.filter(c => c.progress).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>En cours</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {Math.round(coursesData.filter(c => c.progress).reduce((acc, c) => acc + c.progress, 0) / coursesData.filter(c => c.progress).length) || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Progression</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.accent }]}>
            {coursesData.length - coursesData.filter(c => c.progress).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>À commencer</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <StatsCard />

      {/* Search Bar - slides down like course detail screen */}
      {searchVisible && (
        <Animated.View 
          style={[
            styles.searchContainer, 
            { 
              backgroundColor: theme.surface,
              height: searchAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 80],
              }),
              opacity: searchAnimValue,
            }
          ]}
        >
          <View style={styles.searchContent}>
            <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Rechercher un cours..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {hasSearchResults && (
              <Text style={[styles.searchResultsText, { color: theme.textSecondary }]}>
                {filteredCourses.length} résultat{filteredCourses.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </Animated.View>
      )}

      {/* Search Results Banner */}
      {hasSearchResults && (
        <View style={[styles.searchResultsBanner, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="search" size={16} color={theme.primary} />
          <Text style={[styles.searchResultsBannerText, { color: theme.primary }]}>
            "{searchQuery}" - {filteredCourses.length} résultat{filteredCourses.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <CourseCard
                key={index}
                icon={course.icon}
                title={course.title}
                subtitle={course.subtitle}
                progress={course.progress}
                color={course.color}
                difficulty={course.difficulty}
                lessons={course.lessons}
                onPress={() => {
                  const courseName = course.title.replace(/\s+/g, '_').replace(/\//g, '_');
                  router.push(`/courses/${level}/${courseName}`);
                }}
              />
            ))
          ) : hasSearchResults ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun résultat</Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Essayez des mots-clés différents
              </Text>
              <TouchableOpacity 
                style={[styles.clearSearchButton, { backgroundColor: theme.primary + '15' }]}
                onPress={clearSearch}
              >
                <Text style={[styles.clearSearchText, { color: theme.primary }]}>
                  Effacer la recherche
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredCourses.map((course, index) => (
              <CourseCard
                key={index}
                icon={course.icon}
                title={course.title}
                subtitle={course.subtitle}
                progress={course.progress}
                color={course.color}
                difficulty={course.difficulty}
                lessons={course.lessons}
                onPress={() => {
                  const courseName = course.title.replace(/\s+/g, '_').replace(/\//g, '_');
                  router.push(`/courses/${level}/${courseName}`);
                }}
              />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Curved header like dashboard and schedule
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stats card - overlapping like other screens
  statsCard: {
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Search functionality
  searchContainer: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultsText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'center',
  },
  searchResultsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  searchResultsBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 20,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  clearSearchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});