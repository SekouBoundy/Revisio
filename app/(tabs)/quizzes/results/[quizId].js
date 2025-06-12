// app/(tabs)/quizzes/results/[quizId].js - COMPLETE WORKING VERSION
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';
import { QuizManager } from '../../../../utils/quizManager';

const { width } = Dimensions.get('window');

export default function QuizResultsScreen() {
  const { quizId } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  
  const [quizManager] = useState(() => new QuizManager(user?.level || 'DEF'));
  const [quizProgress, setQuizProgress] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    loadQuizData();
    startAnimation();
  }, []);

  const loadQuizData = async () => {
    try {
      const progress = await quizManager.getUserProgress();
      const quizData = quizManager.getQuizById(quizId);
      setQuizProgress(progress[quizId]);
      setQuiz(quizData);
    } catch (error) {
      console.error('Error loading quiz data:', error);
    }
  };

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  if (!quiz) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Quiz introuvable
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Default values if no progress exists
  const lastAttempt = quizProgress?.history?.[quizProgress.history.length - 1];
  const score = lastAttempt?.score || quizProgress?.bestScore || 0;
  const timeSpent = lastAttempt?.timeSpent || 0;
  const correctAnswers = lastAttempt?.correctAnswers || 0;
  const totalQuestions = quiz.questions?.length || 0;

  const getScoreColor = (score) => {
    if (score >= 90) return theme.success;
    if (score >= 70) return theme.warning;
    return theme.error;
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return { title: "Excellent !", message: "Performance exceptionnelle 🎉", icon: "trophy" };
    if (score >= 80) return { title: "Très bien !", message: "Très bonne maîtrise 👏", icon: "star" };
    if (score >= 70) return { title: "Bien !", message: "Bon travail, continuez 💪", icon: "thumbs-up" };
    if (score >= 60) return { title: "Passable", message: "Peut mieux faire 📚", icon: "school" };
    return { title: "À revoir", message: "Révisez et recommencez 🔄", icon: "refresh" };
  };

  const performance = getPerformanceMessage(score);

  const OverviewTab = () => (
    <View style={styles.tabContent}>
      {/* Score Circle */}
      <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
        <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
          <Animated.Text 
            style={[
              styles.scoreText, 
              { 
                color: getScoreColor(score),
                transform: [{
                  scale: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  })
                }]
              }
            ]}
          >
            {score}%
          </Animated.Text>
        </View>
        
        <Text style={[styles.performanceTitle, { color: theme.text }]}>
          {performance.title}
        </Text>
        <Text style={[styles.performanceMessage, { color: theme.textSecondary }]}>
          {performance.message}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={[styles.statsGrid, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {correctAnswers}/{totalQuestions}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Bonnes réponses
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="time" size={24} color={theme.primary} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {Math.round(timeSpent / 1000 / 60) || 0}min
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Temps total
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={24} color={theme.warning} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {quizProgress?.attempts || 1}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Tentatives
          </Text>
        </View>
      </View>

      {/* Recommendations */}
      <View style={[styles.recommendationsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Recommandations
        </Text>
        
        {score >= 80 ? (
          <View style={styles.recommendation}>
            <Ionicons name="star" size={20} color={theme.success} />
            <Text style={[styles.recommendationText, { color: theme.text }]}>
              Excellent travail ! Essayez des quiz plus difficiles.
            </Text>
          </View>
        ) : score >= 60 ? (
          <View style={styles.recommendation}>
            <Ionicons name="book" size={20} color={theme.warning} />
            <Text style={[styles.recommendationText, { color: theme.text }]}>
              Révisez les questions manquées et refaites le quiz.
            </Text>
          </View>
        ) : (
          <View style={styles.recommendation}>
            <Ionicons name="school" size={20} color={theme.error} />
            <Text style={[styles.recommendationText, { color: theme.text }]}>
              Étudiez le cours avant de recommencer le quiz.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const DetailsTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.detailsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Détails du quiz
        </Text>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Quiz
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {quiz.title}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Matière
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {quiz.subject}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Difficulté
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {quiz.difficulty}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Date de completion
          </Text>
          <Text style={[styles.detailValue, { color: theme.text }]}>
            {new Date(lastAttempt?.date || Date.now()).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </View>
    </View>
  );

  const TabButton = ({ id, title, icon }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedTab === id && { backgroundColor: theme.primary + '20' }
      ]}
      onPress={() => setSelectedTab(id)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={selectedTab === id ? theme.primary : theme.textSecondary} 
      />
      <Text style={[
        styles.tabButtonText,
        { color: selectedTab === id ? theme.primary : theme.textSecondary }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: getScoreColor(score) }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Résultats</Text>
            <Text style={styles.headerSubtitle}>{quiz.title}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => {/* Share functionality */}}
          >
            <Ionicons name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.surface }]}>
        <TabButton id="overview" title="Vue d'ensemble" icon="analytics" />
        <TabButton id="details" title="Détails" icon="list" />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' ? <OverviewTab /> : <DetailsTab />}
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionContainer, { backgroundColor: theme.surface }]}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => {
            router.push(`/quizzes/${user?.level || 'DEF'}/${quiz.title.replace(/\s+/g, '_')}`);
          }}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Refaire</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.success }]}
          onPress={() => router.push('/quizzes')}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Accueil Quiz</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { fontSize: 16, marginBottom: 20 },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)' },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  tabButtonText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20 },
  tabContent: { paddingVertical: 16 },
  scoreCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: { fontSize: 32, fontWeight: 'bold' },
  performanceTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  performanceMessage: { fontSize: 16, textAlign: 'center' },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
  statLabel: { fontSize: 12, textAlign: 'center' },
  recommendationsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recommendationText: { flex: 1, fontSize: 14, lineHeight: 20 },
  detailsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});