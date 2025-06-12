// app/(tabs)/quizzes/[level]/[quizId].js - FIXED IMPORTS
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Animated,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';
import { QuizManager } from '../../../../utils/quizManager'; // ✅ Fixed import

export default function QuizTakingScreen() {
  const { level, quizId } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  // Quiz manager - ✅ Updated class name
  const [quizManager] = useState(() => new QuizManager(level));
  
  // Quiz state
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [results, setResults] = useState(null);

  // Animations
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const questionAnimation = useRef(new Animated.Value(1)).current;

  // Load quiz data
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !quizCompleted) {
      handleFinishQuiz();
    }
  }, [quizStarted, timeRemaining, quizCompleted]);

  // Progress animation
  useEffect(() => {
    if (quizStarted && quiz) {
      const progress = (currentQuestion + 1) / quiz.questions.length;
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestion, quizStarted, quiz]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const loadedQuiz = quizManager.prepareQuiz(quizId, { shuffle: true });
      
      if (!loadedQuiz) {
        Alert.alert('Erreur', 'Quiz introuvable', [
          { text: 'OK', onPress: () => router.back() }
        ]);
        return;
      }

      setQuiz(loadedQuiz);
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Erreur', 'Impossible de charger le quiz', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quiz.duration * 60);
    setQuestionStartTime(Date.now());
    setQuizStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (answers[questionId] !== undefined) return; // Already answered

    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    const currentQ = quiz.questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctIndex;

    // Haptic feedback
    if (isCorrect) {
      Vibration.vibrate(100);
    } else {
      Vibration.vibrate([50, 100, 50]);
    }

    // Show explanation after a delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setShowHints(false);
    
    if (currentQuestion < quiz.questions.length - 1) {
      animateQuestionTransition();
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setQuestionStartTime(Date.now());
      }, 200);
    } else {
      handleFinishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setShowExplanation(false);
      setShowHints(false);
      animateQuestionTransition();
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setQuestionStartTime(Date.now());
      }, 200);
    }
  };

  const animateQuestionTransition = () => {
    Animated.sequence([
      Animated.timing(questionAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(questionAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleFinishQuiz = async () => {
    if (quizCompleted) return;
    
    setQuizCompleted(true);
    const endTime = Date.now();
    const quizResults = quizManager.calculateResults(quiz, answers, quizStartTime, endTime);
    
    if (quizResults) {
      // Save progress
      await quizManager.updateQuizResult(quizId, quizResults);
      setResults(quizResults);
    }
    
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setShowResults(false);
    setShowExplanation(false);
    setShowHints(false);
    setResults(null);
    
    // Reload quiz with new shuffle
    loadQuiz();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
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

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Chargement du quiz...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!quiz) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.text }]}>Quiz introuvable</Text>
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

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <ScrollView contentContainerStyle={styles.startContainer}>
          {/* Header */}
          <View style={[styles.startHeader, { backgroundColor: theme.primary }]}>
            <TouchableOpacity 
              style={styles.headerBackButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.startHeaderTitle}>Quiz Challenge</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Quiz Info Card */}
          <View style={[styles.quizInfoCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.quizIcon, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="help-circle" size={48} color={theme.primary} />
            </View>
            
            <Text style={[styles.quizTitle, { color: theme.text }]}>
              {quiz.title}
            </Text>
            <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>
              {quiz.subject}
            </Text>
            <Text style={[styles.quizDescription, { color: theme.textSecondary }]}>
              {quiz.description}
            </Text>
            
            {/* Stats */}
            <View style={styles.quizStats}>
              <View style={styles.statItem}>
                <Ionicons name="help-circle-outline" size={20} color={theme.primary} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quiz.questions.length} questions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={theme.primary} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quiz.duration} minutes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={20} color={getDifficultyColor(quiz.difficulty)} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quiz.difficulty}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.primary }]}
              onPress={startQuiz}
            >
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.startButtonText}>Commencer le Quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;
  const isCorrect = isAnswered && answers[currentQ.id] === currentQ.correctIndex;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Quiz Header */}
      <View style={[styles.quizHeader, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Quitter le quiz',
                'Êtes-vous sûr de vouloir quitter ? Votre progression sera perdue.',
                [
                  { text: 'Continuer', style: 'cancel' },
                  { text: 'Quitter', style: 'destructive', onPress: () => router.back() }
                ]
              );
            }}
            style={[styles.headerButton, { backgroundColor: theme.neutralLight }]}
          >
            <Ionicons name="close" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={styles.questionCounter}>
            <Text style={[styles.questionCounterText, { color: theme.text }]}>
              {currentQuestion + 1} / {quiz.questions.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowHints(!showHints)}
            style={[
              styles.headerButton, 
              { backgroundColor: showHints ? theme.primary + '20' : theme.neutralLight }
            ]}
          >
            <Ionicons 
              name="bulb" 
              size={20} 
              color={showHints ? theme.primary : theme.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={[styles.progressBarContainer, { backgroundColor: theme.neutralLight }]}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: theme.primary 
                }
              ]} 
            />
          </View>
          
          <View style={[
            styles.timerContainer,
            { backgroundColor: timeRemaining <= 30 ? theme.error + '20' : theme.neutralLight }
          ]}>
            <Ionicons 
              name="time" 
              size={16} 
              color={timeRemaining <= 30 ? theme.error : theme.textSecondary} 
            />
            <Text style={[
              styles.timerText, 
              { color: timeRemaining <= 30 ? theme.error : theme.text }
            ]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Hint Panel */}
      {showHints && currentQ.hint && (
        <View style={[styles.hintPanel, { backgroundColor: theme.primary + '10' }]}>
          <Ionicons name="bulb" size={16} color={theme.primary} />
          <Text style={[styles.hintText, { color: theme.primary }]}>
            {currentQ.hint}
          </Text>
        </View>
      )}

      <Animated.ScrollView 
        style={[styles.questionContainer, { opacity: questionAnimation }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Card */}
        <View style={[styles.questionCard, { backgroundColor: theme.surface }]}>
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNumber, { color: theme.primary }]}>
              Question {currentQuestion + 1}
            </Text>
            <View style={[styles.pointsBadge, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="star" size={12} color={theme.warning} />
              <Text style={[styles.pointsText, { color: theme.warning }]}>
                {currentQ.points || 10} pts
              </Text>
            </View>
          </View>
          
          <Text style={[styles.questionText, { color: theme.text }]}>
            {currentQ.question}
          </Text>
          
          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              let optionStyle = [styles.optionButton, { 
                backgroundColor: theme.surface,
                borderColor: theme.neutralLight 
              }];
              let textStyle = [styles.optionText, { color: theme.text }];
              let iconName = null;
              let iconColor = theme.textSecondary;

              if (isAnswered) {
                if (index === currentQ.correctIndex) {
                  optionStyle.push({ 
                    backgroundColor: theme.success + '20',
                    borderColor: theme.success 
                  });
                  textStyle.push({ color: theme.success });
                  iconName = 'checkmark-circle';
                  iconColor = theme.success;
                } else if (index === answers[currentQ.id]) {
                  optionStyle.push({ 
                    backgroundColor: theme.error + '20',
                    borderColor: theme.error 
                  });
                  textStyle.push({ color: theme.error });
                  iconName = 'close-circle';
                  iconColor = theme.error;
                }
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(currentQ.id, index)}
                  disabled={isAnswered}
                >
                  <View style={styles.optionContent}>
                    <Text style={textStyle}>{option}</Text>
                    {iconName && (
                      <Ionicons name={iconName} size={20} color={iconColor} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Explanation */}
        {showExplanation && isAnswered && currentQ.explanation && (
          <View style={[styles.explanationCard, { backgroundColor: theme.surface }]}>
            <View style={styles.explanationHeader}>
              <Ionicons 
                name={isCorrect ? "checkmark-circle" : "close-circle"} 
                size={24} 
                color={isCorrect ? theme.success : theme.error} 
              />
              <Text style={[
                styles.explanationTitle, 
                { color: isCorrect ? theme.success : theme.error }
              ]}>
                {isCorrect ? 'Correct !' : 'Incorrect'}
              </Text>
            </View>
            <Text style={[styles.explanationText, { color: theme.text }]}>
              {currentQ.explanation}
            </Text>
          </View>
        )}
      </Animated.ScrollView>

      {/* Navigation */}
      <View style={[styles.navigation, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { 
              backgroundColor: currentQuestion > 0 ? theme.neutralLight : theme.neutralLight + '50',
              opacity: currentQuestion > 0 ? 1 : 0.5 
            }
          ]}
          onPress={previousQuestion}
          disabled={currentQuestion === 0}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
          <Text style={[styles.navButtonText, { color: theme.text }]}>Précédent</Text>
        </TouchableOpacity>

        {currentQuestion === quiz.questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.finishButton, { backgroundColor: theme.success }]}
            onPress={handleFinishQuiz}
          >
            <Text style={styles.finishButtonText}>Terminer</Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextButton, 
              { 
                backgroundColor: isAnswered ? theme.primary : theme.neutralLight,
                opacity: isAnswered ? 1 : 0.5
              }
            ]}
            onPress={nextQuestion}
            disabled={!isAnswered}
          >
            <Text style={[
              styles.navButtonText, 
              { color: isAnswered ? '#fff' : theme.textSecondary }
            ]}>
              Suivant
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isAnswered ? '#fff' : theme.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <ScrollView contentContainerStyle={styles.resultsContainer}>
            {/* Results Header */}
            <View style={[styles.resultsHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.resultsTitle}>Résultats du Quiz</Text>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Score Card */}
            {results && (
              <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
                <View style={[
                  styles.scoreCircle, 
                  { borderColor: getScoreColor(results.score) }
                ]}>
                  <Text style={[
                    styles.scoreText, 
                    { color: getScoreColor(results.score) }
                  ]}>
                    {results.score}%
                  </Text>
                </View>
                
                <Text style={[styles.scoreLabel, { color: theme.text }]}>
                  {results.score >= 80 ? 'Excellent ! 🎉' : 
                   results.score >= 60 ? 'Bien joué ! 👏' : 'Continuez vos efforts ! 💪'}
                </Text>
                
                <View style={styles.scoreDetails}>
                  <Text style={[styles.scoreDetailText, { color: theme.textSecondary }]}>
                    {results.correctAnswers} / {results.totalQuestions} bonnes réponses
                  </Text>
                  <Text style={[styles.scoreDetailText, { color: theme.textSecondary }]}>
                    {results.earnedPoints} / {results.totalPoints} points
                  </Text>
                  <Text style={[styles.scoreDetailText, { color: theme.textSecondary }]}>
                    Temps: {Math.round(results.timeSpent / 1000 / 60)} minutes
                  </Text>
                </View>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={restartQuiz}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Refaire le Quiz</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.success }]}
                onPress={() => router.back()}
              >
                <Ionicons name="home" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Retour aux Quiz</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  errorText: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
  },
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
  
  // Start Screen
  startContainer: { flexGrow: 1 },
  startHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: { width: 40 },
  quizInfoCard: {
    margin: 20,
    marginTop: -10,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  quizIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  quizSubject: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  quizDescription: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  quizStats: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Quiz Header
  quizHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCounter: {
    flex: 1,
    alignItems: 'center',
  },
  questionCounterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Hint Panel
  hintPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Question
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },

  // Explanation
  explanationCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Navigation
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Results
  resultsContainer: { flexGrow: 1 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreCard: {
    margin: 20,
    marginTop: -10,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
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
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreDetails: {
    alignItems: 'center',
    gap: 8,
  },
  scoreDetailText: {
    fontSize: 14,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});