// app/(tabs)/quizzes/[level]/[quizId].js - Full Quiz Taking Interface
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

export default function QuizTakingScreen() {
  const { level, quizId } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Get quiz data based on quizId
  const getQuizData = () => {
    const quizTitle = quizId.replace(/_/g, ' ');
    
    // Sample quiz questions - replace with real data
    const quizMap = {
      'Les Fractions': {
        title: 'Les Fractions',
        subject: 'Mathématiques',
        duration: 15,
        difficulty: 'Facile',
        questions: [
          {
            id: 1,
            question: 'Combien fait 1/2 + 1/4 ?',
            options: ['1/6', '2/6', '3/4', '1/8'],
            correct: 2,
            explanation: '1/2 = 2/4, donc 2/4 + 1/4 = 3/4'
          },
          {
            id: 2,
            question: 'Quelle fraction est équivalente à 50% ?',
            options: ['1/4', '1/2', '3/4', '2/3'],
            correct: 1,
            explanation: '50% = 50/100 = 1/2'
          },
          {
            id: 3,
            question: 'Simplifiez 4/8',
            options: ['1/2', '2/4', '1/4', '8/4'],
            correct: 0,
            explanation: '4/8 = 1/2 (divisé par 4)'
          }
        ]
      },
      'États de la matière': {
        title: 'États de la matière',
        subject: 'Physique-Chimie',
        duration: 12,
        difficulty: 'Facile',
        questions: [
          {
            id: 1,
            question: 'Quels sont les trois états principaux de la matière ?',
            options: ['Solide, Liquide, Gaz', 'Chaud, Froid, Tiède', 'Dur, Mou, Flexible', 'Grand, Moyen, Petit'],
            correct: 0,
            explanation: 'Les trois états principaux sont : solide, liquide et gazeux.'
          },
          {
            id: 2,
            question: 'Que se passe-t-il quand on chauffe un solide ?',
            options: ['Il devient plus dur', 'Il peut fondre', 'Il devient plus froid', 'Rien ne se passe'],
            correct: 1,
            explanation: 'La chaleur peut faire fondre un solide et le transformer en liquide.'
          }
        ]
      }
    };

    return quizMap[quizTitle] || {
      title: quizTitle,
      subject: 'Quiz',
      duration: 10,
      difficulty: 'Moyen',
      questions: [
        {
          id: 1,
          question: 'Question d\'exemple',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: 'Ceci est une question d\'exemple.'
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

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(quizData.duration * 60); // Convert minutes to seconds
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizData.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / quizData.questions.length) * 100);
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

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen
          options={{
            title: quizData.title,
            headerStyle: { backgroundColor: theme.primary },
            headerTintColor: '#fff',
          }}
        />
        
        <ScrollView contentContainerStyle={styles.startContainer}>
          <View style={[styles.quizCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.quizIcon, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="help-circle" size={48} color={theme.primary} />
            </View>
            
            <Text style={[styles.quizTitle, { color: theme.text }]}>
              {quizData.title}
            </Text>
            <Text style={[styles.quizSubject, { color: theme.textSecondary }]}>
              {quizData.subject}
            </Text>
            
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
                <Ionicons name="trending-up" size={20} color={theme.primary} />
                <Text style={[styles.statText, { color: theme.text }]}>
                  {quizData.difficulty}
                </Text>
              </View>
            </View>
            
            <View style={styles.instructions}>
              <Text style={[styles.instructionTitle, { color: theme.text }]}>
                Instructions:
              </Text>
              <Text style={[styles.instructionText, { color: theme.textSecondary }]}>
                • Lisez chaque question attentivement{'\n'}
                • Sélectionnez la meilleure réponse{'\n'}
                • Vous pouvez revenir aux questions précédentes{'\n'}
                • Le temps est limité à {quizData.duration} minutes
              </Text>
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
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: `Question ${currentQuestion + 1}/${quizData.questions.length}`,
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: '#fff',
          headerLeft: () => (
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
              style={{ padding: 8 }}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Timer and Progress */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={20} color={timeRemaining < 60 ? theme.error : theme.primary} />
          <Text style={[
            styles.timerText, 
            { color: timeRemaining < 60 ? theme.error : theme.text }
          ]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.neutralLight }]}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%`, backgroundColor: theme.primary }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      </View>

      <ScrollView style={styles.questionContainer}>
        <View style={[styles.questionCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.questionNumber, { color: theme.primary }]}>
            Question {currentQuestion + 1}
          </Text>
          <Text style={[styles.questionText, { color: theme.text }]}>
            {currentQ.question}
          </Text>
          
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: selectedAnswers[currentQ.id] === index 
                      ? theme.primary + '20' 
                      : theme.background,
                    borderColor: selectedAnswers[currentQ.id] === index 
                      ? theme.primary 
                      : theme.neutralLight,
                  }
                ]}
                onPress={() => handleAnswerSelect(currentQ.id, index)}
              >
                <View style={[
                  styles.optionCircle,
                  {
                    backgroundColor: selectedAnswers[currentQ.id] === index 
                      ? theme.primary 
                      : 'transparent',
                    borderColor: theme.primary,
                  }
                ]}>
                  {selectedAnswers[currentQ.id] === index && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[
                  styles.optionText,
                  { color: selectedAnswers[currentQ.id] === index ? theme.primary : theme.text }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

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
            style={[styles.navButton, { backgroundColor: theme.primary }]}
            onPress={nextQuestion}
          >
            <Text style={[styles.navButtonText, { color: '#fff' }]}>Suivant</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
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
          <View style={[styles.resultsHeader, { backgroundColor: theme.primary }]}>
            <Text style={styles.resultsTitle}>Résultats du Quiz</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.resultsContainer}>
            <View style={[styles.scoreCard, { backgroundColor: theme.surface }]}>
              <View style={[
                styles.scoreCircle, 
                { borderColor: getScoreColor(calculateScore()) }
              ]}>
                <Text style={[
                  styles.scoreText, 
                  { color: getScoreColor(calculateScore()) }
                ]}>
                  {calculateScore()}%
                </Text>
              </View>
              
              <Text style={[styles.scoreLabel, { color: theme.text }]}>
                {calculateScore() >= 80 ? 'Excellent !' : 
                 calculateScore() >= 60 ? 'Bien joué !' : 'Continuez vos efforts !'}
              </Text>
              
              <View style={styles.scoreDetails}>
                <Text style={[styles.scoreDetail, { color: theme.textSecondary }]}>
                  {Object.keys(selectedAnswers).filter(id => 
                    selectedAnswers[id] === quizData.questions.find(q => q.id == id)?.correct
                  ).length} / {quizData.questions.length} bonnes réponses
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: theme.primary }]}
              onPress={() => router.back()}
            >
              <Text style={styles.reviewButtonText}>Retour aux Quiz</Text>
            </TouchableOpacity>
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
  startContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '80%',
  },
  quizCard: {
    padding: 30,
    borderRadius: 20,
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
    marginBottom: 24,
    textAlign: 'center',
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
  instructions: {
    width: '100%',
    marginBottom: 24,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 100,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  resultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  scoreCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 12,
  },
  scoreDetails: {
    alignItems: 'center',
  },
  scoreDetail: {
    fontSize: 16,
  },
  reviewButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});