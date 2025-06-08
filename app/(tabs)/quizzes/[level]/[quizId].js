// app/(tabs)/quizzes/[level]/[quizId].js - ENHANCED MVP VERSION
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
  Dimensions,
  Vibration,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

const { width, height } = Dimensions.get('window');

export default function EnhancedQuizTakingScreen() {
  const { level, quizId } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [showHints, setShowHints] = useState(false);

  // Animations
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const questionAnimation = useRef(new Animated.Value(1)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Enhanced quiz data
  const getQuizData = () => {
    const quizTitle = quizId.replace(/_/g, ' ');
    
    const quizMap = {
      'Les Fractions': {
        title: 'Les Fractions',
        subject: 'Mathématiques',
        duration: 15,
        difficulty: 'Facile',
        description: 'Maîtrisez les opérations avec les fractions',
        tips: ['Trouvez un dénominateur commun', 'Simplifiez toujours le résultat', 'Visualisez avec des diagrammes'],
        questions: [
          {
            id: 1,
            question: 'Combien fait 1/2 + 1/4 ?',
            options: ['1/6', '2/6', '3/4', '1/8'],
            correct: 2,
            explanation: '1/2 = 2/4, donc 2/4 + 1/4 = 3/4. Pour additionner des fractions, il faut d\'abord les mettre au même dénominateur.',
            hint: 'Convertissez 1/2 en quarts pour avoir le même dénominateur.',
            timeLimit: 45,
            points: 10
          },
          {
            id: 2,
            question: 'Quelle fraction est équivalente à 50% ?',
            options: ['1/4', '1/2', '3/4', '2/3'],
            correct: 1,
            explanation: '50% = 50/100 = 1/2. Pour convertir un pourcentage en fraction, divisez par 100 et simplifiez.',
            hint: '50% signifie 50 sur 100, quelle fraction cela donne-t-il ?',
            timeLimit: 30,
            points: 10
          },
          {
            id: 3,
            question: 'Simplifiez 4/8',
            options: ['1/2', '2/4', '1/4', '8/4'],
            correct: 0,
            explanation: '4/8 = 1/2 car 4 et 8 ont un diviseur commun de 4. 4÷4 = 1 et 8÷4 = 2.',
            hint: 'Cherchez le plus grand diviseur commun de 4 et 8.',
            timeLimit: 30,
            points: 10
          },
          {
            id: 4,
            question: 'Calculez 2/3 × 3/4',
            options: ['6/12', '5/7', '1/2', '6/7'],
            correct: 0,
            explanation: '2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2. Pour multiplier des fractions, multipliez les numérateurs ensemble et les dénominateurs ensemble.',
            hint: 'Multipliez numérateur avec numérateur, dénominateur avec dénominateur.',
            timeLimit: 60,
            points: 15
          },
          {
            id: 5,
            question: 'Quelle est la fraction la plus grande ?',
            options: ['2/5', '3/7', '4/9', '5/11'],
            correct: 1,
            explanation: '3/7 ≈ 0.429, 2/5 = 0.4, 4/9 ≈ 0.444, 5/11 ≈ 0.455. Donc 5/11 est la plus grande.',
            hint: 'Convertissez en décimales ou trouvez un dénominateur commun.',
            timeLimit: 90,
            points: 20
          }
        ]
      },
      'États de la matière': {
        title: 'États de la matière',
        subject: 'Physique-Chimie',
        duration: 12,
        difficulty: 'Facile',
        description: 'Découvrez les différents états de la matière et leurs propriétés',
        tips: ['Pensez aux exemples du quotidien', 'Considérez les changements d\'état', 'Rappelez-vous des propriétés de chaque état'],
        questions: [
          {
            id: 1,
            question: 'Quels sont les trois états principaux de la matière ?',
            options: ['Solide, Liquide, Gaz', 'Chaud, Froid, Tiède', 'Dur, Mou, Flexible', 'Grand, Moyen, Petit'],
            correct: 0,
            explanation: 'Les trois états principaux de la matière sont : solide (forme et volume définis), liquide (volume défini, forme variable) et gazeux (forme et volume variables).',
            hint: 'Pensez à l\'eau sous ses différentes formes.',
            timeLimit: 30,
            points: 10
          },
          {
            id: 2,
            question: 'Que se passe-t-il quand on chauffe un solide ?',
            options: ['Il devient plus dur', 'Il peut fondre', 'Il devient plus froid', 'Rien ne se passe'],
            correct: 1,
            explanation: 'Quand on chauffe un solide, ses particules bougent plus vite. À la température de fusion, il devient liquide.',
            hint: 'Que se passe-t-il avec un glaçon au soleil ?',
            timeLimit: 30,
            points: 10
          },
          {
            id: 3,
            question: 'À quelle température l\'eau bout-elle ?',
            options: ['0°C', '50°C', '100°C', '200°C'],
            correct: 2,
            explanation: 'L\'eau bout à 100°C au niveau de la mer. C\'est le point d\'ébullition où elle passe de l\'état liquide à l\'état gazeux.',
            hint: 'C\'est la température de l\'eau bouillante dans une casserole.',
            timeLimit: 20,
            points: 10
          }
        ]
      }
    };

    return quizMap[quizTitle] || {
      title: quizTitle,
      subject: 'Quiz',
      duration: 10,
      difficulty: 'Moyen',
      description: 'Quiz de révision',
      tips: ['Lisez attentivement', 'Prenez votre temps', 'Réfléchissez avant de répondre'],
      questions: [
        {
          id: 1,
          question: 'Question d\'exemple',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: 'Ceci est une question d\'exemple.',
          hint: 'Choisissez la première option.',
          timeLimit: 30,
          points: 10
        }
      ]
    };
  };

  const quizData = getQuizData();

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

  // Progress animation effect
  useEffect(() => {
    if (quizStarted) {
      const progress = (currentQuestion + 1) / quizData.questions.length;
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestion, quizStarted]);

  // Question transition animation
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

  // Pulse animation for timer
  useEffect(() => {
    if (timeRemaining <= 30 && timeRemaining > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [timeRemaining]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quizData.duration * 60);
    setQuestionStartTime(Date.now());
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (selectedAnswers[questionId] !== undefined) return; // Already answered

    const timeSpent = questionStartTime ? Date.now() - questionStartTime : 0;
    setQuestionTimes(prev => [...prev, timeSpent]);

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    const currentQ = quizData.questions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;

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
    if (currentQuestion < quizData.questions.length - 1) {
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
      animateQuestionTransition();
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setQuestionStartTime(Date.now());
      }, 200);
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    quizData.questions.forEach(question => {
      totalPoints += question.points || 10;
      if (selectedAnswers[question.id] === question.correct) {
        correct++;
        earnedPoints += question.points || 10;
      }
    });

    return {
      percentage: Math.round((correct / quizData.questions.length) * 100),
      correct,
      total: quizData.questions.length,
      points: earnedPoints,
      maxPoints: totalPoints
    };
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

  // Enhanced Quiz Start Screen
  if (!quizStarted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        
        <ScrollView contentContainerStyle={styles.startContainer}>
          {/* Header */}
          <View style={[styles.startHeader, { backgroundColor: theme.primary }]}>
            <TouchableOpacity 
              style={styles.backButton}
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
              {quizData.title}
            </Text>
            <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>
              {quizData.subject}
            </Text>
            <Text style={[styles.quizDescription, { color: theme.textSecondary }]}>
              {quizData.description}
            </Text>
            
            {/* Stats */}
            <View style={styles.quizStats}>
              <View style={styles.statItem}>
                <Ionicons name="help-circle-outline" size={20} color={theme.primary} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quizData.questions.length} questions
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={20} color={theme.primary} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quizData.duration} minutes
                </Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={20} color={getDifficultyColor(quizData.difficulty)} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quizData.difficulty}
                </Text>
              </View>
            </View>
            
            {/* Tips */}
            <View style={styles.tipsSection}>
              <Text style={[styles.tipsTitle, { color: theme.text }]}>
                💡 Conseils :
              </Text>
              {quizData.tips.map((tip, index) => (
                <Text key={index} style={[styles.tipText, { color: theme.textSecondary }]}>
                  • {tip}
                </Text>
              ))}
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

  const currentQ = quizData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.questions.length);
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const isCorrect = isAnswered && selectedAnswers[currentQ.id] === currentQ.correct;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Enhanced Header */}
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
              {currentQuestion + 1} / {quizData.questions.length}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowHints(!showHints)}
            style={[styles.headerButton, { backgroundColor: showHints ? theme.primary + '20' : theme.neutralLight }]}
          >
            <Ionicons name="bulb" size={20} color={showHints ? theme.primary : theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Enhanced Progress Bar */}
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
          
          <Animated.View style={[
            styles.timerContainer,
            { 
              backgroundColor: timeRemaining <= 30 ? theme.error + '20' : theme.neutralLight,
              transform: [{ scale: timeRemaining <= 30 ? pulseAnimation : 1 }]
            }
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
          </Animated.View>
        </View>
      </View>

      {/* Hint Panel */}
      {showHints && (
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
                if (index === currentQ.correct) {
                  optionStyle.push({ 
                    backgroundColor: theme.success + '20',
                    borderColor: theme.success 
                  });
                  textStyle.push({ color: theme.success });
                  iconName = 'checkmark-circle';
                  iconColor = theme.success;
                } else if (index === selectedAnswers[currentQ.id]) {
                  optionStyle.push({ 
                    backgroundColor: theme.error + '20',
                    borderColor: theme.error 
                  });
                  textStyle.push({ color: theme.error });
                  iconName = 'close-circle';
                  iconColor = theme.error;
                }
              } else if (selectedAnswers[currentQ.id] === index) {
                optionStyle.push({ 
                  backgroundColor: theme.primary + '20',
                  borderColor: theme.primary 
                });
                textStyle.push({ color: theme.primary });
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
        {showExplanation && isAnswered && (
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

        {currentQuestion === quizData.questions.length - 1 ? (
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

      {/* Enhanced Results Modal */}
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
            <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
              <View style={[
                styles.scoreCircle, 
                { borderColor: getScoreColor(calculateScore().percentage) }
              ]}>
                <Text style={[
                  styles.scoreText, 
                  { color: getScoreColor(calculateScore().percentage) }
                ]}>
                  {calculateScore().percentage}%
                </Text>
              </View>
              
              <Text style={[styles.scoreLabel, { color: theme.text }]}>
                {calculateScore().percentage >= 80 ? 'Excellent ! 🎉' : 
                 calculateScore().percentage >= 60 ? 'Bien joué ! 👏' : 'Continuez vos efforts ! 💪'}
              </Text>
              
              <View style={styles.scoreDetails}>
                <View style={styles.scoreDetailRow}>
                  <Text style={[styles.scoreDetailLabel, { color: theme.textSecondary }]}>
                    Bonnes réponses :
                  </Text>
                  <Text style={[styles.scoreDetailValue, { color: theme.text }]}>
                    {calculateScore().correct} / {calculateScore().total}
                  </Text>
                </View>
                <View style={styles.scoreDetailRow}>
                  <Text style={[styles.scoreDetailLabel, { color: theme.textSecondary }]}>
                    Points obtenus :
                  </Text>
                  <Text style={[styles.scoreDetailValue, { color: theme.text }]}>
                    {calculateScore().points} / {calculateScore().maxPoints}
                  </Text>
                </View>
                <View style={styles.scoreDetailRow}>
                  <Text style={[styles.scoreDetailLabel, { color: theme.textSecondary }]}>
                    Temps moyen par question :
                  </Text>
                  <Text style={[styles.scoreDetailValue, { color: theme.text }]}>
                    {questionTimes.length > 0 
                      ? Math.round(questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length / 1000) 
                      : 0}s
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  // Restart quiz
                  setQuizStarted(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers({});
                  setShowResults(false);
                  setQuizCompleted(false);
                  setQuestionTimes([]);
                }}
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
  container: {
    flex: 1,
  },
  
  // Start Screen
  startContainer: {
    flexGrow: 1,
  },
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
  backButton: {
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
  placeholder: {
    width: 40,
  },
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
  tipsSection: {
    width: '100%',
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
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

  // Quiz Taking Screen
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
  resultsContainer: {
    flexGrow: 1,
  },
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
    width: '100%',
    gap: 8,
  },
  scoreDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreDetailLabel: {
    fontSize: 14,
  },
  scoreDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
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