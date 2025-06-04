// app/(tabs)/quizzes/index.js - Updated with curved header and search
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
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContextContext';
import { useUser } from '../../../constants/UserContext';

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

  const getDefQuizzes = () => [
    { icon: 'calculator-outline', title: 'Les Fractions', subject: 'Mathématiques', questions: 10, duration: 15, difficulty: 'Facile', score: 85, color: theme.primary },
    { icon: 'calculator-outline', title: 'Géométrie', subject: 'Mathématiques', questions: 12, duration: 20, difficulty: 'Moyen', color: theme.primary },
    { icon: 'flask-outline', title: 'États de la matière', subject: 'Physique-Chimie', questions: 8, duration: 12, difficulty: 'Facile', score: 92, color: theme.accent },
    { icon: 'language-outline', title: 'Conjugaison', subject: 'Français', questions: 15, duration: 18, difficulty: 'Moyen', score: 76, color: theme.secondary },
    { icon: 'globe-outline', title: 'La Renaissance', subject: 'Histoire-Géographie', questions: 10, duration: 15, difficulty: 'Facile', color: theme.info },
    { icon: 'leaf-outline', title: 'Les animaux', subject: 'Sciences de la Vie et de la Terre', questions: 12, duration: 20, difficulty: 'Facile', score: 88, color: theme.success },
    { icon: 'globe', title: 'Present Simple', subject: 'Anglais', questions: 8, duration: 12, difficulty: 'Facile', color: theme.neutralDark },
    { icon: 'people-outline', title: 'Droits et devoirs', subject: 'Éducation Civique et Morale', questions: 6, duration: 10, difficulty: 'Facile', score: 94, color: theme.warning }
  ];

  const getBacQuizzes = () => {
    const quizzesByTrack = {
      TSE: [
        { icon: 'calculator-outline', title: 'Intégrales', subject: 'Mathématiques', questions: 20, duration: 45, difficulty: 'Difficile', score: 78, color: theme.primary },
        { icon: 'nuclear-outline', title: 'Mécanique quantique', subject: 'Physique', questions: 15, duration: 35, difficulty: 'Difficile', color: theme.accent },
        { icon: 'flask-outline', title: 'Chimie organique', subject: 'Chimie', questions: 18, duration: 40, difficulty: 'Difficile', score: 82, color: theme.info },
        { icon: 'leaf-outline', title: 'Géologie', subject: 'Bio/Geo', questions: 12, duration: 25, difficulty: 'Moyen', color: theme.success },
        { icon: 'language-outline', title: 'Dissertation', subject: 'Français', questions: 3, duration: 60, difficulty: 'Difficile', color: theme.secondary },
        { icon: 'bulb-outline', title: 'Logique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', score: 85, color: theme.warning },
        { icon: 'globe', title: 'Advanced Grammar', subject: 'Anglais', questions: 15, duration: 20, difficulty: 'Moyen', score: 91, color: theme.neutralDark }
      ],
      TSEXP: [
        { icon: 'calculator-outline', title: 'Statistiques', subject: 'Mathématiques', questions: 16, duration: 35, difficulty: 'Difficile', score: 74, color: theme.primary },
        { icon: 'flask-outline', title: 'Analyses chimiques', subject: 'Physique/Chimie', questions: 14, duration: 30, difficulty: 'Difficile', color: theme.accent },
        { icon: 'leaf-outline', title: 'Écologie', subject: 'Bio', questions: 12, duration: 28, difficulty: 'Moyen', score: 88, color: theme.success },
        { icon: 'globe-outline', title: 'Environnement', subject: 'Geo', questions: 10, duration: 20, difficulty: 'Moyen', color: theme.warning },
        { icon: 'bulb-outline', title: 'Éthique scientifique', subject: 'Philosophie', questions: 8, duration: 25, difficulty: 'Moyen', color: theme.info },
        { icon: 'globe', title: 'Scientific English', subject: 'Anglais', questions: 12, duration: 18, difficulty: 'Moyen', score: 89, color: theme.neutralDark }
      ],
      TSECO: [
        { icon: 'trending-up-outline', title: 'Microéconomie', subject: 'Économie', questions: 20, duration: 40, difficulty: 'Moyen', score: 88, color: theme.success },
        { icon: 'briefcase-outline', title: 'Management', subject: 'Gestion', questions: 15, duration: 30, difficulty: 'Moyen', color: theme.neutralDark },
        { icon: 'document-text-outline', title: 'Droit commercial', subject: 'Droit', questions: 18, duration: 35, difficulty: 'Moyen', score: 79, color: theme.warning },
        { icon: 'calculator-outline', title: 'Statistiques économiques', subject: 'Mathématiques appliquées', questions: 14, duration: 25, difficulty: 'Moyen', color: theme.primary },
        { icon: 'language-outline', title: 'Communication professionnelle', subject: 'Français', questions: 12, duration: 30, difficulty: 'Moyen', score: 85, color: theme.secondary },
        { icon: 'bulb-outline', title: 'Philosophie politique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', color: theme.info },
        { icon: 'globe', title: 'Business English', subject: 'Anglais', questions: 12, duration: 20, difficulty: 'Moyen', score: 87, color: theme.accent },
        { icon: 'globe-outline', title: 'Géographie économique', subject: 'Histoire-Géographie', questions: 15, duration: 25, difficulty: 'Facile', score: 92, color: theme.error },
        { icon: 'people-outline', title: 'Citoyenneté', subject: 'Éducation Civique', questions: 8, duration: 15, difficulty: 'Facile', score: 96, color: theme.neutralLight }
      ]
    };

    return quizzesByTrack[user?.level] || quizzesByTrack.TSE;
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

  const QuizCard = ({ icon, title, subject, questions, duration, difficulty, score, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.quizCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.quizIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      
      <View style={styles.quizContent}>
        <Text style={[styles.quizTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.quizSubject, { color: theme.text + '80' }]}>{subject}</Text>
        
        <View style={styles.quizInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="help-circle-outline" size={14} color={theme.text + '60'} />
              <Text style={[styles.infoText, { color: theme.text + '60' }]}>{questions} questions</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={theme.text + '60'} />
              <Text style={[styles.infoText, { color: theme.text + '60' }]}>{duration} min</Text>
            </View>
          </View>
          
          <View style={styles.quizMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>
                {difficulty}
              </Text>
            </View>
            {score !== undefined && (
              <Text style={[styles.scoreText, { color: getPerformanceColor(score) }]}>
                {score}%
              </Text>
            )}
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
    </TouchableOpacity>
  );

  const quizzesData = isDefLevel ? getDefQuizzes() : getBacQuizzes();
  const filteredQuizzes = filterQuizzes(quizzesData);
  const hasSearchResults = searchQuery.trim().length > 0;

  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            Performance
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Quiz Dashboard
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
            <Ionicons name="analytics" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const PerformanceRing = ({ percentage, size = 80 }) => (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <View style={[styles.ringBackground, { 
        width: size, 
        height: size, 
        borderRadius: size/2,
        borderColor: theme.neutralLight 
      }]}>
        <View style={[styles.ringFill, { 
          width: size, 
          height: size, 
          borderRadius: size/2,
          borderTopColor: getPerformanceColor(percentage),
          borderRightColor: getPerformanceColor(percentage),
          transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
        }]} />
        <View style={[styles.ringInner, { 
          width: size - 16, 
          height: size - 16, 
          borderRadius: (size - 16)/2,
          backgroundColor: theme.surface
        }]}>
          <Text style={[styles.ringText, { color: theme.text, fontSize: size * 0.2 }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );

  const PerformanceCard = () => {
    const completedQuizzes = quizzesData.filter(q => q.score);
    const averageScore = completedQuizzes.length > 0 
      ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length) 
      : 0;

    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.surface }]}>
        <View style={styles.performanceHeader}>
          <Text style={[styles.performanceTitle, { color: theme.text }]}>Performance Globale</Text>
          <TouchableOpacity onPress={() => console.log('Details')}>
            <Text style={[styles.detailsLink, { color: theme.primary }]}>Détails</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.performanceContent}>
          <PerformanceRing percentage={averageScore} size={100} />
          
          <View style={styles.performanceStats}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Quiz terminés</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{completedQuizzes.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Temps moyen</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>23 min</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Meilleur score</Text>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {completedQuizzes.length > 0 ? Math.max(...completedQuizzes.map(q => q.score)) : 0}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Performance Overview */}
        <View style={styles.performanceSection}>
          <PerformanceCard />
        </View>

        {/* Quiz List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isDefLevel ? 'Quiz DEF' : `Quiz ${user?.level}`}
            </Text>
          </View>
          
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <QuizCard
                key={index}
                icon={quiz.icon}
                title={quiz.title}
                subject={quiz.subject}
                questions={quiz.questions}
                duration={quiz.duration}
                difficulty={quiz.difficulty}
                score={quiz.score}
                color={quiz.color}
                onPress={() => console.log(`Start quiz: ${quiz.title}`)}
              />
            ))
          ) : hasSearchResults ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>Aucun résultat</Text>
              <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
                Essayez des mots-clés différents
              </Text>
            </View>
          ) : null}
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
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  performanceSection: {
    marginBottom: 24,
  },
  performanceCard: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: -15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  performanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringContainer: {
    marginRight: 24,
  },
  ringBackground: {
    borderWidth: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringFill: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: 'transparent',
  },
  ringInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    fontWeight: 'bold',
  },
  performanceStats: {
    flex: 1,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    fontWeight: '600',
    marginBottom: 2,
  },
  quizSubject: {
    fontSize: 12,
    marginBottom: 8,
  },
  quizInfo: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  },
  bottomPadding: {
    height: 40,
  },
});