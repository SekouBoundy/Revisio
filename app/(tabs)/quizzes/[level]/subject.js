// app/(tabs)/quizzes/[level]/subject.js - SUBJECT-SPECIFIC QUIZZES
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';
import { QuizManager, UserProgressManager } from '../../../../utils/quizDataManager';

export default function SubjectQuizzesScreen() {
  const { level, subject } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  
  const [quizManager] = useState(() => new QuizManager(level));
  const [progressManager] = useState(() => new UserProgressManager());
  const [userProgress, setUserProgress] = useState({});
  const [subjectData, setSubjectData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    loadSubjectData();
    loadUserProgress();
  }, [subject, level]);

  const loadSubjectData = () => {
    const subjectInfo = quizManager.getSubject(subject);
    const subjectQuizzes = quizManager.getQuizzesBySubject(subject);
    
    setSubjectData(subjectInfo);
    setQuizzes(subjectQuizzes);
  };

  const loadUserProgress = async () => {
    try {
      const progress = await progressManager.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const navigateToQuiz = (quiz) => {
    const quizTitle = quiz.title.replace(/\s+/g, '_');
    router.push(`/quizzes/${level}/${quizTitle}`);
  };

  const getQuizProgress = (quizId) => {
    return userProgress[quizId] || { attempts: 0, bestScore: 0 };
  };

  const getProgressColor = (score) => {
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

  // Calculate subject statistics
  const subjectStats = quizzes.reduce((stats, quiz) => {
    const progress = getQuizProgress(quiz.id);
    if (progress.attempts > 0) {
      stats.completed++;
      stats.totalScore += progress.bestScore;
    }
    stats.total++;
    return stats;
  }, { completed: 0, total: 0, totalScore: 0 });

  const averageScore = subjectStats.completed > 0 
    ? Math.round(subjectStats.totalScore / subjectStats.completed) 
    : 0;

  const QuizCard = ({ quiz, index }) => {
    const progress = getQuizProgress(quiz.id);
    const isCompleted = progress.attempts > 0;
    const isNew = progress.attempts === 0;

    return (
      <TouchableOpacity 
        style={[styles.quizCard, { backgroundColor: theme.surface }]}
        onPress={() => navigateToQuiz(quiz)}
      >
        <View style={styles.quizCardHeader}>
          <View style={styles.quizCardLeft}>
            <View style={[styles.quizNumber, { backgroundColor: theme.primary + '20' }]}>
              <Text style={[styles.quizNumberText, { color: theme.primary }]}>
                {index + 1}
              </Text>
            </View>
            
            <View style={styles.quizInfo}>
              <Text style={[styles.quizTitle, { color: theme.text }]}>
                {quiz.title}
              </Text>
              <Text style={[styles.quizDescription, { color: theme.textSecondary }]}>
                {quiz.description || 'Quiz de révision'}
              </Text>
            </View>
          </View>

          <View style={styles.quizCardRight}>
            {isNew && (
              <View style={[styles.newBadge, { backgroundColor: theme.accent + '20' }]}>
                <Text style={[styles.newBadgeText, { color: theme.accent }]}>
                  Nouveau
                </Text>
              </View>
            )}
            {isCompleted && (
              <View style={styles.scoreContainer}>
                <Text style={[styles.scoreText, { color: getProgressColor(progress.bestScore) }]}>
                  {progress.bestScore}%
                </Text>
                <View style={[styles.completedIcon, { backgroundColor: theme.success + '20' }]}>
                  <Ionicons name="checkmark" size={16} color={theme.success} />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.quizMeta}>
          <View style={styles.quizMetaLeft}>
            <View style={styles.metaItem}>
              <Ionicons name="help-circle-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {quiz.questions?.length || 0} questions
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {quiz.duration} min
              </Text>
            </View>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
                {quiz.difficulty}
              </Text>
            </View>
          </View>
          
          {progress.attempts > 0 && (
            <Text style={[styles.attemptsText, { color: theme.textSecondary }]}>
              {progress.attempts} tentative{progress.attempts > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {isCompleted && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.neutralLight }]}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress.bestScore}%`,
                    backgroundColor: getProgressColor(progress.bestScore)
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: subjectData?.color || theme.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {subjectData?.name || subject}
            </Text>
            <Text style={styles.headerSubtitle}>
              {level} • {quizzes.length} quiz{quizzes.length > 1 ? 's' : ''}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Card */}
      <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>
          Votre progression
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {subjectStats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Terminés
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.success }]}>
              {averageScore}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Moyenne
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.warning }]}>
              {subjectStats.total - subjectStats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Restants
            </Text>
          </View>
        </View>

        {/* Overall Progress Bar */}
        <View style={styles.overallProgress}>
          <View style={styles.overallProgressHeader}>
            <Text style={[styles.overallProgressLabel, { color: theme.text }]}>
              Progression globale
            </Text>
            <Text style={[styles.overallProgressValue, { color: theme.primary }]}>
              {Math.round((subjectStats.completed / subjectStats.total) * 100)}%
            </Text>
          </View>
          <View style={[styles.overallProgressBar, { backgroundColor: theme.neutralLight }]}>
            <View 
              style={[
                styles.overallProgressFill,
                { 
                  width: `${Math.round((subjectStats.completed / subjectStats.total) * 100)}%`,
                  backgroundColor: theme.primary
                }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Quiz List */}
      <ScrollView style={styles.quizList} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={[styles.listTitle, { color: theme.text }]}>
            Tous les quiz
          </Text>
          <Text style={[styles.listSubtitle, { color: theme.textSecondary }]}>
            {subjectData?.description || 'Sélectionnez un quiz pour commencer'}
          </Text>
        </View>

        {quizzes.map((quiz, index) => (
          <QuizCard key={quiz.id} quiz={quiz} index={index} />
        ))}

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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Card
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
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
  overallProgress: {
    marginTop: 16,
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
  overallProgressValue: {
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

  // Quiz List
  quizList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Quiz Card
  quizCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quizCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quizCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  quizNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  quizCardRight: {
    alignItems: 'flex-end',
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Quiz Meta
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quizMetaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
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
  attemptsText: {
    fontSize: 11,
    fontStyle: 'italic',
  },

  // Progress
  progressContainer: {
    marginTop: 8,
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

  bottomPadding: {
    height: 40,
  },
});