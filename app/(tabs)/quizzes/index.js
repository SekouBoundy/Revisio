// app/(tabs)/quizzes/index.js - ENHANCED MVP VERSION
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
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

const { width } = Dimensions.get('window');

export default function QuizzesIndex() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Search state
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

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

  // Enhanced quiz data with better organization
  const getQuizData = () => {
    if (isDefLevel) {
      return {
        recommended: [
          { id: 'def_fractions', icon: 'calculator-outline', title: 'Les Fractions', subject: 'Mathématiques', questions: 10, duration: 15, difficulty: 'Facile', score: 85, color: '#2196F3', isRecommended: true, reason: 'Basé sur vos résultats récents' },
          { id: 'def_conjugaison', icon: 'language-outline', title: 'Conjugaison', subject: 'Français', questions: 15, duration: 18, difficulty: 'Moyen', color: '#FF9800', isRecommended: true, reason: 'Sujet populaire cette semaine' },
        ],
        recentlyTaken: [
          { id: 'def_etats_matiere', icon: 'flask-outline', title: 'États de la matière', subject: 'Physique-Chimie', questions: 8, duration: 12, difficulty: 'Facile', score: 92, color: '#E91E63', takenAt: '2024-01-15' },
          { id: 'def_animaux', icon: 'leaf-outline', title: 'Les animaux', subject: 'Sciences de la Vie et de la Terre', questions: 12, duration: 20, difficulty: 'Facile', score: 88, color: '#4CAF50', takenAt: '2024-01-14' },
        ],
        subjects: {
          'Mathématiques': [
            { id: 'def_fractions', icon: 'calculator-outline', title: 'Les Fractions', questions: 10, duration: 15, difficulty: 'Facile', score: 85, color: '#2196F3' },
            { id: 'def_geometrie', icon: 'calculator-outline', title: 'Géométrie', questions: 12, duration: 20, difficulty: 'Moyen', color: '#2196F3' },
            { id: 'def_pourcentages', icon: 'calculator-outline', title: 'Pourcentages', questions: 8, duration: 12, difficulty: 'Facile', color: '#2196F3' },
          ],
          'Français': [
            { id: 'def_conjugaison', icon: 'language-outline', title: 'Conjugaison', questions: 15, duration: 18, difficulty: 'Moyen', score: 76, color: '#FF9800' },
            { id: 'def_orthographe', icon: 'language-outline', title: 'Orthographe', questions: 20, duration: 25, difficulty: 'Moyen', color: '#FF9800' },
            { id: 'def_vocabulaire', icon: 'language-outline', title: 'Vocabulaire', questions: 12, duration: 15, difficulty: 'Facile', score: 91, color: '#FF9800' },
          ],
          'Physique-Chimie': [
            { id: 'def_etats_matiere', icon: 'flask-outline', title: 'États de la matière', questions: 8, duration: 12, difficulty: 'Facile', score: 92, color: '#E91E63' },
            { id: 'def_forces', icon: 'flask-outline', title: 'Forces et mouvements', questions: 10, duration: 18, difficulty: 'Moyen', color: '#E91E63' },
          ],
          'Histoire-Géographie': [
            { id: 'def_renaissance', icon: 'globe-outline', title: 'La Renaissance', questions: 10, duration: 15, difficulty: 'Facile', color: '#9C27B0' },
            { id: 'def_geographie_europe', icon: 'globe-outline', title: 'Géographie de l\'Europe', questions: 12, duration: 20, difficulty: 'Moyen', color: '#9C27B0' },
          ],
        }
      };
    } else {
      // BAC level data
      return {
        recommended: [
          { id: 'bac_integrales', icon: 'calculator-outline', title: 'Intégrales', subject: 'Mathématiques', questions: 20, duration: 45, difficulty: 'Difficile', score: 78, color: '#2196F3', isRecommended: true, reason: 'Préparez-vous pour l\'examen' },
          { id: 'bac_mecanique', icon: 'nuclear-outline', title: 'Mécanique quantique', subject: 'Physique', questions: 15, duration: 35, difficulty: 'Difficile', color: '#E91E63', isRecommended: true, reason: 'Chapitre important' },
        ],
        recentlyTaken: [
          { id: 'bac_chimie_org', icon: 'flask-outline', title: 'Chimie organique', subject: 'Chimie', questions: 18, duration: 40, difficulty: 'Difficile', score: 82, color: '#9C27B0', takenAt: '2024-01-15' },
          { id: 'bac_logique', icon: 'bulb-outline', title: 'Logique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', score: 85, color: '#795548', takenAt: '2024-01-14' },
        ],
        subjects: {
          'Mathématiques': [
            { id: 'bac_integrales', icon: 'calculator-outline', title: 'Intégrales', questions: 20, duration: 45, difficulty: 'Difficile', score: 78, color: '#2196F3' },
            { id: 'bac_derivees', icon: 'calculator-outline', title: 'Dérivées', questions: 18, duration: 40, difficulty: 'Difficile', color: '#2196F3' },
            { id: 'bac_limites', icon: 'calculator-outline', title: 'Limites', questions: 15, duration: 35, difficulty: 'Difficile', score: 84, color: '#2196F3' },
          ],
          'Physique': [
            { id: 'bac_mecanique', icon: 'nuclear-outline', title: 'Mécanique quantique', questions: 15, duration: 35, difficulty: 'Difficile', color: '#E91E63' },
            { id: 'bac_thermodynamique', icon: 'nuclear-outline', title: 'Thermodynamique', questions: 12, duration: 30, difficulty: 'Difficile', score: 79, color: '#E91E63' },
          ],
          'Chimie': [
            { id: 'bac_chimie_org', icon: 'flask-outline', title: 'Chimie organique', questions: 18, duration: 40, difficulty: 'Difficile', score: 82, color: '#9C27B0' },
            { id: 'bac_cinetique', icon: 'flask-outline', title: 'Cinétique chimique', questions: 14, duration: 32, difficulty: 'Difficile', color: '#9C27B0' },
          ],
        }
      };
    }
  };

  const quizData = getQuizData();

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

  const navigateToQuiz = (quiz) => {
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    const quizTitle = quiz.title.replace(/\s+/g, '_');
    router.push(`/quizzes/${userLevel}/${quizTitle}`);
  };

  // Enhanced Components
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

  const StreakCard = () => {
    const currentStreak = 5; // This would come from user data
    const todayCompleted = 2;
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
            // Navigate to a quick 5-question quiz
            const randomQuiz = quizData.recommended[0];
            if (randomQuiz) navigateToQuiz(randomQuiz);
          }}
        />
        <QuickActionCard
          icon="school"
          title="Révisions"
          subtitle="Sujets faibles"
          color={theme.info}
          onPress={() => {
            // Navigate to review mode
            console.log('Review weak subjects');
          }}
        />
        <QuickActionCard
          icon="trophy"
          title="Défi"
          subtitle="Difficile"
          color={theme.accent}
          onPress={() => {
            // Navigate to challenge mode
            const difficultQuizzes = Object.values(quizData.subjects).flat()
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
          badge="2"
          onPress={() => {
            // Navigate to failed quizzes
            console.log('Retake failed quizzes');
          }}
        />
      </View>
    </View>
  );

  const RecommendedQuizCard = ({ quiz }) => (
    <TouchableOpacity 
      style={[styles.recommendedCard, { backgroundColor: theme.surface }]}
      onPress={() => navigateToQuiz(quiz)}
    >
      <View style={[styles.recommendedIcon, { backgroundColor: quiz.color + '20' }]}>
        <Ionicons name={quiz.icon} size={28} color={quiz.color} />
      </View>
      
      <View style={styles.recommendedContent}>
        <View style={styles.recommendedHeader}>
          <Text style={[styles.recommendedTitle, { color: theme.text }]}>{quiz.title}</Text>
          <View style={[styles.recommendedBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.recommendedBadgeText, { color: theme.primary }]}>Recommandé</Text>
          </View>
        </View>
        
        <Text style={[styles.recommendedSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
        <Text style={[styles.recommendedReason, { color: theme.textSecondary }]}>{quiz.reason}</Text>
        
        <View style={styles.recommendedMeta}>
          <View style={styles.recommendedMetaItem}>
            <Ionicons name="help-circle-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.recommendedMetaText, { color: theme.textSecondary }]}>
              {quiz.questions} questions
            </Text>
          </View>
          <View style={styles.recommendedMetaItem}>
            <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.recommendedMetaText, { color: theme.textSecondary }]}>
              {quiz.duration} min
            </Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
              {quiz.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const RecentQuizCard = ({ quiz }) => (
    <TouchableOpacity 
      style={[styles.recentCard, { backgroundColor: theme.surface }]}
      onPress={() => navigateToQuiz(quiz)}
    >
      <View style={[styles.recentIcon, { backgroundColor: quiz.color + '20' }]}>
        <Ionicons name={quiz.icon} size={20} color={quiz.color} />
      </View>
      
      <View style={styles.recentContent}>
        <Text style={[styles.recentTitle, { color: theme.text }]}>{quiz.title}</Text>
        <Text style={[styles.recentSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
      </View>
      
      <View style={styles.recentScore}>
        <Text style={[styles.recentScoreText, { color: getPerformanceColor(quiz.score) }]}>
          {quiz.score}%
        </Text>
      </View>
    </TouchableOpacity>
  );

  const SubjectCard = ({ subjectName, quizzes }) => {
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizzes.filter(q => q.score !== undefined).length;
    const averageScore = completedQuizzes > 0 
      ? Math.round(quizzes.filter(q => q.score !== undefined).reduce((acc, q) => acc + q.score, 0) / completedQuizzes)
      : 0;

    return (
      <TouchableOpacity 
        style={[styles.subjectCard, { backgroundColor: theme.surface }]}
        onPress={() => {
          // Navigate to subject-specific quiz list
          router.push({
            pathname: '/quizzes/[level]/subject',
            params: { level: isDefLevel ? 'DEF' : user?.level, subject: subjectName }
          });
        }}
      >
        <View style={styles.subjectHeader}>
          <View style={[styles.subjectIcon, { backgroundColor: quizzes[0]?.color + '20' || theme.primary + '20' }]}>
            <Ionicons name={quizzes[0]?.icon || 'book'} size={20} color={quizzes[0]?.color || theme.primary} />
          </View>
          <Text style={[styles.subjectName, { color: theme.text }]}>{subjectName}</Text>
        </View>
        
        <View style={styles.subjectStats}>
          <Text style={[styles.subjectProgress, { color: theme.textSecondary }]}>
            {completedQuizzes}/{totalQuizzes} quiz terminés
          </Text>
          {averageScore > 0 && (
            <Text style={[styles.subjectAverage, { color: getPerformanceColor(averageScore) }]}>
              Moyenne: {averageScore}%
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Filter quizzes based on search
  const filterQuizzes = (quizzes) => {
    if (!searchQuery.trim()) return quizzes;
    const query = searchQuery.toLowerCase();
    return quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(query) ||
      quiz.subject.toLowerCase().includes(query) ||
      quiz.difficulty.toLowerCase().includes(query)
    );
  };

  const allQuizzes = Object.values(quizData.subjects).flat();
  const filteredQuizzes = filterQuizzes(allQuizzes);
  const hasSearchResults = searchQuery.trim().length > 0;

  const QuizCard = ({ quiz }) => (
    <TouchableOpacity 
      style={[styles.quizCard, { backgroundColor: theme.surface }]}
      onPress={() => navigateToQuiz(quiz)}
    >
      <View style={[styles.quizIcon, { backgroundColor: quiz.color + '20' }]}>
        <Ionicons name={quiz.icon} size={24} color={quiz.color} />
      </View>
      
      <View style={styles.quizContent}>
        <Text style={[styles.quizTitle, { color: theme.text }]}>{quiz.title}</Text>
        <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>{quiz.subject}</Text>
        
        <View style={styles.quizMeta}>
          <View style={styles.quizMetaRow}>
            <View style={styles.quizMetaItem}>
              <Ionicons name="help-circle-outline" size={12} color={theme.textSecondary} />
              <Text style={[styles.quizMetaText, { color: theme.textSecondary }]}>{quiz.questions}q</Text>
            </View>
            <View style={styles.quizMetaItem}>
              <Ionicons name="time-outline" size={12} color={theme.textSecondary} />
              <Text style={[styles.quizMetaText, { color: theme.textSecondary }]}>{quiz.duration}m</Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
                {quiz.difficulty}
              </Text>
            </View>
          </View>
          {quiz.score !== undefined && (
            <Text style={[styles.quizScore, { color: getPerformanceColor(quiz.score) }]}>
              {quiz.score}%
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Recommandé pour vous
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: theme.primary }]}>Voir tout</Text>
                </TouchableOpacity>
              </View>
              
              {quizData.recommended.map((quiz, index) => (
                <RecommendedQuizCard key={index} quiz={quiz} />
              ))}
            </View>

            {/* Recently Taken */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Récemment terminés
              </Text>
              
              {quizData.recentlyTaken.map((quiz, index) => (
                <RecentQuizCard key={index} quiz={quiz} />
              ))}
            </View>

            {/* Browse by Subject */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Explorer par matière
              </Text>
              
              {Object.entries(quizData.subjects).map(([subject, quizzes]) => (
                <SubjectCard key={subject} subjectName={subject} quizzes={quizzes} />
              ))}
            </View>
          </>
        ) : (
          // Search Results
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Résultats de recherche
            </Text>
            
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz, index) => (
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

  // Layout
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Streak Card
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

  // Recommended Quiz Card
  recommendedCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendedSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  recommendedReason: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendedMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recommendedMetaText: {
    fontSize: 12,
  },

  // Recent Quiz Card
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  recentSubject: {
    fontSize: 12,
  },
  recentScore: {
    alignItems: 'flex-end',
  },
  recentScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
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

  // Standard Quiz Card (for search results)
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginBottom: 8,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quizMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quizMetaText: {
    fontSize: 11,
  },
  quizScore: {
    fontSize: 14,
    fontWeight: 'bold',
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