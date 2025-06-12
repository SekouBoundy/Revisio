// app/(tabs)/quizzes/[level]/index.js - FIXED IMPORTS
import React, { useContext, useState, useRef, useEffect } from 'react';
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

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';
import { QuizManager } from '../../../../utils/quizManager'; // ✅ Fixed import

export default function LevelQuizzesScreen() {
  const { level } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  
  // Quiz manager instances - ✅ Updated class name
  const [quizManager] = useState(() => new QuizManager(level));
  
  // State
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [quizStats, setQuizStats] = useState(null);
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

  const isDefLevel = level === 'DEF';

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await quizManager.getUserProgress();
      const stats = await quizManager.getStats();
      setUserProgress(progress);
      setQuizStats(stats);
    } catch (error) {
      console.error('Error loading progress:', error);
      setUserProgress({});
      setQuizStats(null);
    }
  };

  // Toggle search functionality
  const toggleSearch = () => {
    if (searchVisible) {
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

  // Get all quizzes for this level
  const getAllQuizzes = () => {
    return quizManager.getAllQuizzes();
  };

  // Filter quizzes based on search
  const filterQuizzes = (quizzes) => {
    if (!searchQuery.trim()) return quizzes;
    return quizManager.searchQuizzes(searchQuery);
  };

  const allQuizzes = getAllQuizzes();
  const filteredQuizzes = filterQuizzes(allQuizzes);
  const hasSearchResults = searchQuery.trim().length > 0;

  // Utility functions
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return '#4CAF50';
      case 'Moyen': return '#FF9800';
      case 'Difficile': return '#F44336';
      default: return theme.primary;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const handleQuizPress = (quiz) => {
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    const quizTitle = quiz.title.replace(/\s+/g, '_');
    router.push(`/quizzes/${userLevel}/${quizTitle}`);
  };

  // Enhanced Quiz Card
  const QuizCard = ({ quiz }) => (
    <TouchableOpacity 
      style={[styles.quizCard, { backgroundColor: theme.surface }]}
      onPress={() => handleQuizPress(quiz)}
    >
      <View style={[styles.quizIcon, { backgroundColor: quiz.subjectColor + '20' }]}>
        <Ionicons name={quiz.subjectIcon} size={24} color={quiz.subjectColor} />
      </View>
      
      <View style={styles.quizContent}>
        <View style={styles.quizHeader}>
          <Text style={[styles.quizTitle, { color: theme.text }]}>{quiz.title}</Text>
          {userProgress[quiz.id]?.attempts > 0 && (
            <View style={[styles.attemptsBadge, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.attemptsText, { color: theme.primary }]}>
                {userProgress[quiz.id].attempts}x
              </Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>
          {quiz.subject}
        </Text>
        
        {quiz.description && (
          <Text style={[styles.quizDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {quiz.description}
          </Text>
        )}
        
        <View style={styles.quizMeta}>
          <View style={styles.quizMetaRow}>
            <View style={styles.quizMetaItem}>
              <Ionicons name="help-circle-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.quizMetaText, { color: theme.textSecondary }]}>
                {quiz.totalQuestions || 0} questions
              </Text>
            </View>
            <View style={styles.quizMetaItem}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.quizMetaText, { color: theme.textSecondary }]}>
                {quiz.duration} min
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
                {quiz.difficulty}
              </Text>
            </View>
          </View>
          
          {userProgress[quiz.id]?.bestScore !== undefined && (
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreText, { color: getScoreColor(userProgress[quiz.id].bestScore) }]}>
                {userProgress[quiz.id].bestScore}%
              </Text>
              {userProgress[quiz.id].history?.length > 0 && (
                <Text style={[styles.lastAttemptText, { color: theme.textSecondary }]}>
                  {new Date(userProgress[quiz.id].history[userProgress[quiz.id].history.length - 1].date).toLocaleDateString('fr-FR')}
                </Text>
              )}
            </View>
          )}
        </View>
        
        {/* Progress indicator */}
        {userProgress[quiz.id]?.bestScore !== undefined && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBarContainer, { backgroundColor: theme.neutralLight }]}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${userProgress[quiz.id].bestScore}%`,
                    backgroundColor: getScoreColor(userProgress[quiz.id].bestScore)
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  // Header Component
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Quiz DEF' : `Quiz ${level}`}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Quiz Challenge
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
            <Ionicons name="filter-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Enhanced Stats Card with real data
  const StatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {quizStats?.completedQuizzes || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Terminés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {quizStats?.averageScore || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Moyenne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {quizStats?.totalQuizzes - (quizStats?.completedQuizzes || 0) || allQuizzes.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>À faire</Text>
        </View>
      </View>
      
      {/* Completion progress bar */}
      {quizStats && (
        <View style={styles.overallProgressContainer}>
          <View style={styles.overallProgressHeader}>
            <Text style={[styles.overallProgressLabel, { color: theme.text }]}>
              Progression générale
            </Text>
            <Text style={[styles.overallProgressPercent, { color: theme.primary }]}>
              {quizStats.completionRate}%
            </Text>
          </View>
          <View style={[styles.overallProgressBar, { backgroundColor: theme.neutralLight }]}>
            <View 
              style={[
                styles.overallProgressFill,
                { 
                  width: `${quizStats.completionRate}%`,
                  backgroundColor: theme.primary
                }
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );

  // Filter/Sort Options
  const FilterOptions = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.filterChipText, { color: theme.primary }]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.surface }]}>
          <Text style={[styles.filterChipText, { color: theme.text }]}>Non commencés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.surface }]}>
          <Text style={[styles.filterChipText, { color: theme.text }]}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.surface }]}>
          <Text style={[styles.filterChipText, { color: theme.text }]}>Terminés</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.surface }]}>
          <Text style={[styles.filterChipText, { color: theme.text }]}>Facile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, { backgroundColor: theme.surface }]}>
          <Text style={[styles.filterChipText, { color: theme.text }]}>Difficile</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <StatsCard />

      {/* Search Bar */}
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
                placeholder="Rechercher un quiz..."
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
                {filteredQuizzes.length} résultat{filteredQuizzes.length !== 1 ? 's' : ''}
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
            "{searchQuery}" - {filteredQuizzes.length} résultat{filteredQuizzes.length !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Options */}
      {!hasSearchResults && <FilterOptions />}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {hasSearchResults ? 'Résultats de recherche' : 'Tous les quiz'}
            </Text>
            <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
              {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.id || index} quiz={quiz} />
            ))
          ) : hasSearchResults ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun résultat</Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Essayez des mots-clés différents ou ajustez vos filtres
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
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="help-circle-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun quiz disponible</Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Les quiz pour ce niveau seront bientôt disponibles
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  
  // Enhanced Stats Card
  statsCard: {
    marginTop: -15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  overallProgressContainer: {
    marginTop: 8,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overallProgressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  overallProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  overallProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Search
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

  // Filter Options
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Content
  section: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Enhanced Quiz Card
  quizCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  quizContent: {
    flex: 1,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  attemptsBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  attemptsText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  quizSubject: {
    fontSize: 12,
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  quizMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quizMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quizMetaText: {
    fontSize: 11,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  lastAttemptText: {
    fontSize: 10,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },

  // Empty State
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