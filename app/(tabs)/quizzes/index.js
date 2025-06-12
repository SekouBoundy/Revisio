// app/(tabs)/quizzes/index.js - UNIFIED QUIZ SYSTEM
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';
import { UnifiedQuizManager } from '../../../utils/unifiedQuizManager';

export default function UnifiedQuizzesIndex() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Quiz manager instance
  const [quizManager] = useState(() => new UnifiedQuizManager(isDefLevel ? 'DEF' : user?.level));
  
  // State
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

  // Load data on mount
  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      
      // Load all quiz data
      const [progress, quizStats, quizRecommendations] = await Promise.all([
        quizManager.getUserProgress(),
        quizManager.getStats(),
        quizManager.getRecommendations(3)
      ]);
      
      const subjectsData = quizManager.getSubjects();
      const allQuizzesData = quizManager.getAllQuizzes();
      
      setUserProgress(progress);
      setStats(quizStats);
      setSubjects(subjectsData);
      setAllQuizzes(allQuizzesData);
      setRecommendations(quizRecommendations);
    } catch (error) {
      console.error('Error loading quiz data:', error);
    } finally {
      setLoading(false);
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

  const navigateToQuiz = (quiz) => {
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    const quizTitle = quiz.title.replace(/\s+/g, '_');
    router.push(`/quizzes/${userLevel}/${quizTitle}`);
  };

  const navigateToSubject = (subject) => {
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    router.push(`/quizzes/${userLevel}?subject=${subject.name}`);
  };

  // Get time-based greeting
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Search functionality
  const searchResults = searchQuery ? quizManager.searchQuizzes(searchQuery) : [];
  const hasSearchResults = searchQuery.trim().length > 0;

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Chargement des quiz...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Header Component
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {getTimeOfDayGreeting()}, {user?.name?.split(' ')[0] || 'Étudiant'}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Prêt pour un quiz ?
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
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
      </View>
    </View>
  );

  // Stats Card
  const StatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {stats?.completedQuizzes || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Terminés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {stats?.averageScore || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Moyenne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {(stats?.totalQuizzes || 0) - (stats?.completedQuizzes || 0)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>À faire</Text>
        </View>
      </View>
      
      <View style={styles.overallProgressContainer}>
        <View style={styles.overallProgressHeader}>
          <Text style={[styles.overallProgressLabel, { color: theme.text }]}>
            Progression générale
          </Text>
          <Text style={[styles.overallProgressPercent, { color: theme.primary }]}>
            {stats?.completionRate || 0}%
          </Text>
        </View>
        <View style={[styles.overallProgressBar, { backgroundColor: theme.neutralLight }]}>
          <View 
            style={[
              styles.overallProgressFill,
              { 
                width: `${stats?.completionRate || 0}%`,
                backgroundColor: theme.primary
              }
            ]}
          />
        </View>
      </View>
    </View>
  );

  // Quiz Card Component
  const QuizCard = ({ quiz }) => {
    const progress = userProgress[quiz.id];
    const hasProgress = progress && progress.attempts > 0;
    
    return (
      <TouchableOpacity 
        style={[styles.quizCard, { backgroundColor: theme.surface }]}
        onPress={() => navigateToQuiz(quiz)}
      >
        <View style={[styles.quizIcon, { backgroundColor: quiz.subjectColor + '20' }]}>
          <Ionicons name={quiz.subjectIcon} size={24} color={quiz.subjectColor} />
        </View>
        
        <View style={styles.quizContent}>
          <Text style={[styles.quizTitle, { color: theme.text }]}>{quiz.title}</Text>
          <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
          <Text style={[styles.quizDescription, { color: theme.textSecondary }]} numberOfLines={2}>
            {quiz.description}
          </Text>
          
          <View style={styles.quizMeta}>
            <View style={styles.quizMetaItem}>
              <Ionicons name="help-circle-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.quizMetaText, { color: theme.textSecondary }]}>
                {quiz.totalQuestions} questions
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
          
          {hasProgress && (
            <View style={styles.progressContainer}>
              <Text style={[styles.scoreText, { color: getScoreColor(progress.bestScore) }]}>
                Meilleur score: {progress.bestScore}%
              </Text>
              <View style={[styles.progressBar, { backgroundColor: theme.neutralLight }]}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${progress.bestScore}%`,
                      backgroundColor: getScoreColor(progress.bestScore)
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
  };

  // Subject Card Component
  const SubjectCard = ({ subject }) => {
    const subjectQuizzes = allQuizzes.filter(q => q.subjectName === subject.name);
    const completedQuizzes = subjectQuizzes.filter(q => {
      const progress = userProgress[q.id];
      return progress && progress.attempts > 0;
    }).length;
    
    return (
      <TouchableOpacity 
        style={[styles.subjectCard, { backgroundColor: theme.surface }]}
        onPress={() => navigateToSubject(subject)}
      >
        <View style={styles.subjectHeader}>
          <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
            <Ionicons name={subject.icon} size={20} color={subject.color} />
          </View>
          <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
        </View>
        
        <Text style={[styles.subjectDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {subject.description}
        </Text>
        
        <View style={styles.subjectStats}>
          <Text style={[styles.subjectProgress, { color: theme.textSecondary }]}>
            {completedQuizzes}/{subjectQuizzes.length} quiz terminés
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />

      {/* Search Bar */}
      {searchVisible && (
        <Animated.View 
          style={[
            styles.searchContainer, 
            { 
              backgroundColor: theme.surface,
              height: searchAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 70],
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
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!hasSearchResults ? (
          <>
            {/* Stats Card */}
            <View style={styles.section}>
              <StatsCard />
            </View>

            {/* Recommended Quizzes */}
            {recommendations.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Recommandé pour vous
                </Text>
                {recommendations.map((quiz, index) => (
                  <QuizCard key={index} quiz={quiz} />
                ))}
              </View>
            )}

            {/* Browse by Subject */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Explorer par matière
              </Text>
              
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </View>

            {/* All Quizzes */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Tous les quiz
              </Text>
              
              {allQuizzes.map((quiz, index) => (
                <QuizCard key={index} quiz={quiz} />
              ))}
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Résultats de recherche ({searchResults.length})
            </Text>
            
            {searchResults.length > 0 ? (
              searchResults.map((quiz, index) => (
                <QuizCard key={index} quiz={quiz} />
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
                <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun résultat</Text>
                <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                  Essayez des mots-clés différents
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Search styles
  searchContainer: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },

  // Layout
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  // Stats Card
  statsCard: {
    marginTop: -15,
    borderRadius: 20,
    padding: 20,
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

  // Quiz Card
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
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
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
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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
  progressContainer: {
    marginTop: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Subject Card
  subjectCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  subjectStats: {
    marginTop: 4,
  },
  subjectProgress: {
    fontSize: 12,
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
  },
  bottomPadding: {
    height: 40,
  },
});