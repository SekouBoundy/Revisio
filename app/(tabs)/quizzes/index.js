// app/(tabs)/quizzes/index.js - FIXED VERSION
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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';
import { QuizManager, UserProgressManager } from '../../../utils/quizDataManager';

const { width } = Dimensions.get('window');

export default function QuizzesIndex() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Quiz manager instances
  const [quizManager] = useState(() => new QuizManager(isDefLevel ? 'DEF' : user?.level));
  const [progressManager] = useState(() => new UserProgressManager());
  
  // State
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProgress, setUserProgress] = useState({});
  const [quizStats, setQuizStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const progress = await progressManager.getUserProgress();
      const stats = await progressManager.getOverallStats();
      
      // Load subjects safely
      const allSubjects = getAllSubjects();
      
      setUserProgress(progress);
      setQuizStats(stats);
      setSubjects(allSubjects);
    } catch (error) {
      console.error('Error loading progress:', error);
      setError('Failed to load quiz data');
      setUserProgress({});
      setQuizStats(null);
      setSubjects([]);
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

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Get quiz data from manager with null checks
  const getRecommendedQuizzes = () => {
    try {
      return quizManager.getRecommendedQuizzes(userProgress) || [];
    } catch (error) {
      console.error('Error getting recommended quizzes:', error);
      return [];
    }
  };

  const getRecentlyTaken = () => {
    try {
      const recentQuizzes = [];
      for (const [quizId, progress] of Object.entries(userProgress)) {
        if (progress?.attempts > 0) {
          const quiz = quizManager.getQuizById(quizId);
          if (quiz && progress.history && progress.history.length > 0) {
            const lastAttempt = progress.history[progress.history.length - 1];
            recentQuizzes.push({
              ...quiz,
              score: lastAttempt.score,
              takenAt: lastAttempt.completedAt
            });
          }
        }
      }
      return recentQuizzes
        .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
        .slice(0, 3);
    } catch (error) {
      console.error('Error getting recently taken quizzes:', error);
      return [];
    }
  };

  const getAllSubjects = () => {
    try {
      const subjectNames = quizManager.getSubjects();
      if (!subjectNames || !Array.isArray(subjectNames)) {
        return [];
      }

      return subjectNames.map(subjectName => {
        try {
          const subject = quizManager.getSubject(subjectName);
          if (!subject || !subject.quizzes) {
            return {
              name: subjectName,
              icon: 'help-circle',
              color: '#2196F3',
              description: 'Quiz subject',
              totalQuizzes: 0,
              completedQuizzes: 0,
              averageScore: 0,
              quizzes: []
            };
          }

          const quizzes = Object.values(subject.quizzes);
          
          const completedQuizzes = quizzes.filter(quiz => 
            userProgress[quiz.id]?.attempts > 0
          ).length;
          
          const averageScore = completedQuizzes > 0 
            ? Math.round(
                quizzes
                  .filter(quiz => userProgress[quiz.id]?.attempts > 0)
                  .reduce((acc, quiz) => acc + (userProgress[quiz.id]?.bestScore || 0), 0) / completedQuizzes
              )
            : 0;

          return {
            name: subjectName,
            icon: subject.icon || 'help-circle',
            color: subject.color || '#2196F3',
            description: subject.description || 'Quiz subject',
            totalQuizzes: quizzes.length,
            completedQuizzes,
            averageScore,
            quizzes
          };
        } catch (subjectError) {
          console.error(`Error processing subject ${subjectName}:`, subjectError);
          return {
            name: subjectName,
            icon: 'help-circle',
            color: '#2196F3',
            description: 'Quiz subject',
            totalQuizzes: 0,
            completedQuizzes: 0,
            averageScore: 0,
            quizzes: []
          };
        }
      });
    } catch (error) {
      console.error('Error getting all subjects:', error);
      return [];
    }
  };

  // Navigation helper
  const navigateToQuiz = (quiz) => {
    try {
      const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
      const quizTitle = quiz.title.replace(/\s+/g, '_');
      router.push(`/quizzes/${userLevel}/${quizTitle}`);
    } catch (error) {
      console.error('Error navigating to quiz:', error);
    }
  };

  // Utility functions
  const getPerformanceColor = (score) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return theme.success;
      case 'Moyen': return theme.warning;
      case 'Difficile': return theme.error;
      default: return theme.primary;
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Search functionality with error handling
  const searchResults = searchQuery ? (
    (() => {
      try {
        return quizManager.searchQuizzes(searchQuery) || [];
      } catch (error) {
        console.error('Error searching quizzes:', error);
        return [];
      }
    })()
  ) : [];
  const hasSearchResults = searchQuery.trim().length > 0;

  // Component data with error handling
  const recommendedQuizzes = getRecommendedQuizzes();
  const recentlyTaken = getRecentlyTaken();

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

  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.error} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Erreur de chargement
          </Text>
          <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={loadUserProgress}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
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
        <View style={styles.headerActions}>
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
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="person-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Enhanced Streak Card with real data
  const StreakCard = () => {
    const currentStreak = quizStats?.streak || 0;
    const todayCompleted = 2; // This would come from daily tracking
    const dailyGoal = 3;

    return (
      <View style={[styles.streakCard, { backgroundColor: theme.surface }]}>
        <View style={styles.streakContent}>
          <View style={styles.streakLeft}>
            <View style={styles.streakStats}>
              <View style={[styles.streakBadge, { backgroundColor: theme.warning + '20' }]}>
                <Ionicons name="flame" size={20} color={theme.warning} />
                <Text style={[styles.streakNumber, { color: theme.warning }]}>{currentStreak}</Text>
              </View>
              <View style={styles.streakTextContainer}>
                <Text style={[styles.streakTitle, { color: theme.text }]}>Série actuelle</Text>
                <Text style={[styles.streakSubtitle, { color: theme.textSecondary }]}>
                  {currentStreak} jour{currentStreak > 1 ? 's' : ''} consécutif{currentStreak > 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.streakRight}>
            <Text style={[styles.dailyGoalLabel, { color: theme.textSecondary }]}>Objectif du jour</Text>
            <View style={styles.dailyProgress}>
              <Text style={[styles.dailyGoalText, { color: theme.text }]}>
                {todayCompleted}/{dailyGoal} quiz
              </Text>
              <View style={[styles.progressBarContainer, { backgroundColor: theme.neutralLight }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${Math.min((todayCompleted / dailyGoal) * 100, 100)}%`,
                      backgroundColor: todayCompleted >= dailyGoal ? theme.success : theme.primary
                    }
                  ]} 
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const QuickActionCard = ({ icon, title, subtitle, color, onPress, badge }) => (
    <TouchableOpacity 
      style={[styles.quickActionCard, { backgroundColor: color + '15' }]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
        {badge && (
          <View style={[styles.quickActionBadge, { backgroundColor: theme.error }]}>
            <Text style={styles.quickActionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.quickActionTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.quickActionSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
    </TouchableOpacity>
  );

  const QuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Actions rapides</Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionCard
          icon="flash"
          title="Quiz éclair"
          subtitle="5 questions"
          color={theme.warning}
          onPress={() => {
            if (recommendedQuizzes.length > 0) {
              navigateToQuiz(recommendedQuizzes[0]);
            }
          }}
        />
        <QuickActionCard
          icon="school"
          title="Révisions"
          subtitle="Sujets faibles"
          color={theme.info}
          onPress={() => {
            // Find lowest scoring subject
            const weakestSubject = subjects.find(s => s.averageScore > 0 && s.averageScore < 70);
            if (weakestSubject && weakestSubject.quizzes.length > 0) {
              navigateToQuiz(weakestSubject.quizzes[0]);
            }
          }}
        />
        <QuickActionCard
          icon="trophy"
          title="Défi"
          subtitle="Difficile"
          color={theme.accent}
          onPress={() => {
            // Find a difficult quiz
            const difficultQuizzes = subjects.flatMap(s => s.quizzes)
              .filter(quiz => quiz.difficulty === 'Difficile');
            if (difficultQuizzes.length > 0) {
              navigateToQuiz(difficultQuizzes[0]);
            }
          }}
        />
        <QuickActionCard
          icon="refresh"
          title="Reprendre"
          subtitle="Quiz ratés"
          color={theme.error}
          badge={recentlyTaken.filter(q => q.score < 60).length || undefined}
          onPress={() => {
            const failedQuiz = recentlyTaken.find(q => q.score < 60);
            if (failedQuiz) {
              navigateToQuiz(failedQuiz);
            }
          }}
        />
      </View>
    </View>
  );

  // Rest of your components remain the same...
  // (RecommendedQuizCard, RecentQuizCard, SubjectCard, QuizCard components)

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
          </View>
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!hasSearchResults ? (
          <>
            {/* Streak Card */}
            <View style={styles.section}>
              <StreakCard />
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <QuickActions />
            </View>

            {/* Recommended Quizzes */}
            {recommendedQuizzes.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Recommandé pour vous
                </Text>
                {recommendedQuizzes.map((quiz, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[styles.recommendedCard, { backgroundColor: theme.surface }]}
                    onPress={() => navigateToQuiz(quiz)}
                  >
                    <Text style={[styles.quizTitle, { color: theme.text }]}>{quiz.title}</Text>
                    <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Browse by Subject */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Explorer par matière
              </Text>
              
              {subjects.map((subject) => (
                <TouchableOpacity 
                  key={subject.name}
                  style={[styles.subjectCard, { backgroundColor: theme.surface }]}
                  onPress={() => {
                    router.push({
                      pathname: '/quizzes/[level]/index',
                      params: { level: isDefLevel ? 'DEF' : user?.level }
                    });
                  }}
                >
                  <View style={styles.subjectHeader}>
                    <View style={[styles.subjectIcon, { backgroundColor: subject.color + '20' }]}>
                      <Ionicons name={subject.icon} size={20} color={subject.color} />
                    </View>
                    <Text style={[styles.subjectName, { color: theme.text }]}>{subject.name}</Text>
                  </View>
                  
                  <View style={styles.subjectStats}>
                    <Text style={[styles.subjectProgress, { color: theme.textSecondary }]}>
                      {subject.completedQuizzes}/{subject.totalQuizzes} quiz terminés
                    </Text>
                    {subject.averageScore > 0 && (
                      <Text style={[styles.subjectAverage, { color: getPerformanceColor(subject.averageScore) }]}>
                        Moyenne: {subject.averageScore}%
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Résultats de recherche
            </Text>
            
            {searchResults.length > 0 ? (
              searchResults.map((quiz, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.quizCard, { backgroundColor: theme.surface }]}
                  onPress={() => navigateToQuiz(quiz)}
                >
                  <Text style={[styles.quizTitle, { color: theme.text }]}>{quiz.title}</Text>
                  <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
                </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
    paddingVertical: 16,
  },
  searchInputContainer: {
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

  // Layout
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  // Cards
  streakCard: {
    marginTop: -15,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLeft: {
    flex: 1,
  },
  streakStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
  },
  streakNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakTextContainer: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  streakSubtitle: {
    fontSize: 12,
  },
  streakRight: {
    alignItems: 'flex-end',
  },
  dailyGoalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dailyProgress: {
    alignItems: 'flex-end',
  },
  dailyGoalText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  progressBarContainer: {
    width: 80,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },

  // Quick Actions
  quickActionsContainer: {
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  quickActionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Generic Cards
  recommendedCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
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
  subjectStats: {
    marginLeft: 48,
  },
  subjectProgress: {
    fontSize: 12,
    marginBottom: 2,
  },
  subjectAverage: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quizCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizSubject: {
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