// app/(tabs)/quizzes/index.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function QuizzesIndex() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';

  const getPerformanceColor = (score) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
  };

  const getDefQuizzes = () => [
    { icon: 'calculator', title: 'Fractions', subject: 'Mathématiques', questions: 10, duration: 15, difficulty: 'Facile', score: 85 },
    { icon: 'flask', title: 'États de la matière', subject: 'Physique-Chimie', questions: 8, duration: 12, difficulty: 'Facile', score: 92 },
    { icon: 'language', title: 'Conjugaison', subject: 'Français', questions: 15, duration: 18, difficulty: 'Moyen', score: 76 },
    { icon: 'globe', title: 'Renaissance', subject: 'Histoire-Géographie', questions: 10, duration: 15, difficulty: 'Facile' },
    { icon: 'calculator', title: 'Géométrie', subject: 'Mathématiques', questions: 12, duration: 20, difficulty: 'Moyen' },
    { icon: 'leaf', title: 'Les animaux', subject: 'Sciences SVT', questions: 12, duration: 20, difficulty: 'Facile', score: 88 },
  ];

  const getBacQuizzes = () => [
    { icon: 'calculator', title: 'Intégrales', subject: 'Mathématiques', questions: 20, duration: 45, difficulty: 'Difficile', score: 78 },
    { icon: 'nuclear', title: 'Mécanique quantique', subject: 'Physique', questions: 15, duration: 35, difficulty: 'Difficile' },
    { icon: 'flask', title: 'Chimie organique', subject: 'Chimie', questions: 18, duration: 40, difficulty: 'Difficile', score: 82 },
    { icon: 'bulb', title: 'Logique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', score: 85 },
    { icon: 'desktop', title: 'Algorithmes', subject: 'Informatique', questions: 12, duration: 30, difficulty: 'Moyen' },
  ];

  const quizzes = isDefLevel ? getDefQuizzes() : getBacQuizzes();
  const completedQuizzes = quizzes.filter(q => q.score);
  const averageScore = completedQuizzes.length > 0 
    ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length) 
    : 0;

  const getRecentAttempts = () => [
    { title: 'Quiz Mathématiques', date: 'Hier', score: 85, correct: 17, total: 20, time: '23 min', improvement: 5 },
    { title: 'Quiz Sciences', date: 'Il y a 2 jours', score: 92, correct: 23, total: 25, time: '18 min' },
    { title: 'Quiz Français', date: 'Il y a 3 jours', score: 76, correct: 19, total: 25, time: '28 min', improvement: 8 },
  ];

  const getSubjectPerformance = () => {
    const subjects = {};
    quizzes.forEach(quiz => {
      if (quiz.score) {
        if (!subjects[quiz.subject]) {
          subjects[quiz.subject] = { scores: [], count: 0 };
        }
        subjects[quiz.subject].scores.push(quiz.score);
        subjects[quiz.subject].count++;
      }
    });

    return Object.entries(subjects).map(([subject, data]) => ({
      subject: subject.length > 12 ? subject.substring(0, 12) + '...' : subject,
      score: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      color: getSubjectColor(subject)
    }));
  };

  const getSubjectColor = (subject) => {
    const colorMap = {
      'Mathématiques': theme.primary,
      'Physique-Chimie': theme.success,
      'Sciences SVT': theme.success,
      'Français': theme.secondary,
      'Histoire-Géographie': theme.accent,
      'Physique': theme.warning,
      'Chimie': theme.accent,
      'Philosophie': theme.secondary,
      'Informatique': theme.info
    };
    return colorMap[subject] || theme.primary;
  };

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
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
          onPress={() => console.log('Filter')}
        >
          <Ionicons name="analytics" size={20} color="#FFFFFF" />
        </TouchableOpacity>
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

  const PerformanceCard = () => (
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
              {Math.max(...completedQuizzes.map(q => q.score))}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const QuickQuizCard = ({ quiz }) => (
    <TouchableOpacity 
      style={[styles.quickQuizCard, { backgroundColor: theme.surface }]}
      onPress={() => router.push(`/(tabs)/quizzes/${user?.level}/${quiz.title}`)}
    >
      <View style={[styles.quickQuizIcon, { backgroundColor: getSubjectColor(quiz.subject) + '15' }]}>
        <Ionicons name={quiz.icon} size={20} color={getSubjectColor(quiz.subject)} />
      </View>
      <Text style={[styles.quickQuizTitle, { color: theme.text }]}>{quiz.title}</Text>
      <Text style={[styles.quickQuizMeta, { color: theme.textSecondary }]}>
        {quiz.questions}q • {quiz.duration}min
      </Text>
      {quiz.score ? (
        <Text style={[styles.quickQuizScore, { color: getPerformanceColor(quiz.score) }]}>
          {quiz.score}%
        </Text>
      ) : (
        <View style={[styles.newBadge, { backgroundColor: theme.accent + '15' }]}>
          <Text style={[styles.newText, { color: theme.accent }]}>Nouveau</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const RecentAttemptCard = ({ attempt }) => (
    <TouchableOpacity style={[styles.attemptCard, { backgroundColor: theme.surface }]}>
      <View style={styles.attemptHeader}>
        <View>
          <Text style={[styles.attemptTitle, { color: theme.text }]}>{attempt.title}</Text>
          <Text style={[styles.attemptDate, { color: theme.textSecondary }]}>{attempt.date}</Text>
        </View>
        <View style={styles.attemptScore}>
          <Text style={[styles.attemptScoreText, { color: getPerformanceColor(attempt.score) }]}>
            {attempt.score}%
          </Text>
          {attempt.improvement && (
            <View style={styles.improvementBadge}>
              <Ionicons name="trending-up" size={12} color={theme.success} />
              <Text style={[styles.improvementText, { color: theme.success }]}>
                +{attempt.improvement}%
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.attemptDetails}>
        <Text style={[styles.attemptDetail, { color: theme.textSecondary }]}>
          {attempt.correct}/{attempt.total} correctes • {attempt.time}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const subjectPerformance = getSubjectPerformance();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Performance Overview */}
        <View style={styles.section}>
          <PerformanceCard />
        </View>

        {/* Quick Access */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Accès Rapide</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.quickQuizGrid}>
              {quizzes.slice(0, 4).map((quiz, index) => (
                <QuickQuizCard key={index} quiz={quiz} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Attempts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tentatives Récentes</Text>
            <TouchableOpacity onPress={() => console.log('History')}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>Historique</Text>
            </TouchableOpacity>
          </View>
          
          {getRecentAttempts().map((attempt, index) => (
            <RecentAttemptCard key={index} attempt={attempt} />
          ))}
        </View>

        {/* Subjects Performance */}
        {subjectPerformance.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance par Matière</Text>
            
            <View style={styles.subjectPerformanceGrid}>
              {subjectPerformance.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.subjectPerformanceCard, { backgroundColor: theme.surface }]}
                  onPress={() => console.log('Subject details', item.subject)}
                >
                  <PerformanceRing percentage={item.score} size={60} />
                  <Text style={[styles.subjectName, { color: theme.text }]}>{item.subject}</Text>
                </TouchableOpacity>
              ))}
            </View>
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  performanceCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: -20,
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
  quickQuizGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickQuizCard: {
    width: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickQuizIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickQuizTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickQuizMeta: {
    fontSize: 11,
    marginBottom: 8,
  },
  quickQuizScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newText: {
    fontSize: 10,
    fontWeight: '600',
  },
  attemptCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  attemptTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  attemptDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  attemptScore: {
    alignItems: 'flex-end',
  },
  attemptScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  improvementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  improvementText: {
    fontSize: 10,
    fontWeight: '600',
  },
  attemptDetails: {
    marginTop: 4,
  },
  attemptDetail: {
    fontSize: 12,
    fontWeight: '500',
  },
  subjectPerformanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectPerformanceCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 40,
  },
});