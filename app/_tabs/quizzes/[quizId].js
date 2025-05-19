/**
 * File: app/_tabs/quizzes/[quizId].js
 * Quiz detail screen with quiz information, questions, and results
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Header from '../../../components/common/Header';
import Theme from '../../../constants/Theme';

// Mock data for quizzes
const QUIZZES = {
  '1': {
    id: '1',
    title: 'Mathematics: Calculus',
    courseId: '1',
    category: 'bac',
    description: 'Test your knowledge of derivatives and integrals',
    instructions: 'Select the correct answer for each question. You have 15 minutes to complete this quiz.',
    questions: 10,
    timeLimit: 15, // in minutes
    completed: false,
    locked: false,
    questionsList: [
      {
        id: 'q1',
        question: 'What is the derivative of f(x) = x²?',
        options: [
          { id: 'a', text: 'f\'(x) = x' },
          { id: 'b', text: 'f\'(x) = 2x' },
          { id: 'c', text: 'f\'(x) = 2' },
          { id: 'd', text: 'f\'(x) = x²' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q2',
        question: 'What is ∫ 2x dx?',
        options: [
          { id: 'a', text: 'x² + C' },
          { id: 'b', text: '2x² + C' },
          { id: 'c', text: 'x² + 2 + C' },
          { id: 'd', text: '2 ln|x| + C' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 'q3',
        question: 'The derivative of sin(x) is:',
        options: [
          { id: 'a', text: 'cos(x)' },
          { id: 'b', text: '-sin(x)' },
          { id: 'c', text: 'tan(x)' },
          { id: 'd', text: '-cos(x)' },
        ],
        correctAnswer: 'a',
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Physics: Mechanics',
    courseId: '2',
    category: 'bac',
    description: 'Test your understanding of forces and motion',
    instructions: 'Select the correct answer for each question. You have 12 minutes to complete this quiz.',
    questions: 8,
    timeLimit: 12,
    completed: true,
    score: 85,
    locked: false,
    questionsList: [
      // Questions would be here
    ],
  },
};

// Question component
const Question = ({ question, selectedAnswer, onSelectAnswer, showResult }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.question}</Text>
      
      <View style={styles.optionsContainer}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = showResult && option.id === question.correctAnswer;
          const isIncorrect = showResult && isSelected && option.id !== question.correctAnswer;
          
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                isCorrect && styles.correctOption,
                isIncorrect && styles.incorrectOption,
              ]}
              onPress={() => onSelectAnswer(option.id)}
              disabled={showResult}
            >
              <Text style={styles.optionLetter}>{option.id.toUpperCase()}</Text>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  isCorrect && styles.correctOptionText,
                  isIncorrect && styles.incorrectOptionText,
                ]}
              >
                {option.text}
              </Text>
              
              {showResult && isCorrect && (
                <Text style={styles.resultIcon}>✓</Text>
              )}
              
              {showResult && isIncorrect && (
                <Text style={styles.resultIcon}>✗</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Quiz states
const QUIZ_STATE = {
  INFO: 'info',
  IN_PROGRESS: 'in_progress',
  RESULTS: 'results',
};

export default function QuizScreen() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  const [quiz, setQuiz] = useState(null);
  const [quizState, setQuizState] = useState(QUIZ_STATE.INFO);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Fetch quiz data (in a real app, this would be an API call)
    const fetchedQuiz = QUIZZES[quizId];
    
    if (fetchedQuiz) {
      setQuiz(fetchedQuiz);
      setRemainingTime(fetchedQuiz.timeLimit * 60); // Convert to seconds
    }

    // Clean up timer on unmount
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizId]);

  const startQuiz = () => {
    setQuizState(QUIZ_STATE.IN_PROGRESS);
    setCurrentQuestionIndex(0);
    setAnswers({});
    
    // Start timer
    const intervalId = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(intervalId);
  };

  const handleSelectAnswer = (answerId) => {
    setAnswers(prev => ({
      ...prev,
      [quiz.questionsList[currentQuestionIndex].id]: answerId,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quiz.questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    // Clear timer
    if (timer) clearInterval(timer);
    
    // Calculate score
    let correctCount = 0;
    quiz.questionsList.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / quiz.questionsList.length) * 100);
    setScore(finalScore);
    
    // Show results
    setQuizState(QUIZ_STATE.RESULTS);
  };

  const confirmFinishQuiz = () => {
    // Count answered questions
    const answeredCount = Object.keys(answers).length;
    
    if (answeredCount < quiz.questionsList.length) {
      Alert.alert(
        "Finish Quiz?",
        `You've only answered ${answeredCount} out of ${quiz.questionsList.length} questions. Are you sure you want to finish?`,
        [
          {
            text: "Continue Quiz",
            style: "cancel"
          },
          { 
            text: "Finish Quiz", 
            onPress: finishQuiz 
          }
        ]
      );
    } else {
      finishQuiz();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  // Get color based on quiz category
  const getCategoryColor = () => {
    switch (quiz.category) {
      case 'bac':
        return Theme.colors.bac;
      case 'def':
        return Theme.colors.def;
      case 'languages':
        return Theme.colors.languages;
      default:
        return Theme.colors.primary;
    }
  };

  // Render quiz info screen
  if (quizState === QUIZ_STATE.INFO) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Header
          title="Quiz Details"
          showBack={true}
        />
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.quizInfoContainer}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDescription}>{quiz.description}</Text>
            
            <Card
              variant="flat"
              style={styles.infoCard}
            >
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Questions:</Text>
                <Text style={styles.infoValue}>{quiz.questions}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Time Limit:</Text>
                <Text style={styles.infoValue}>{quiz.timeLimit} minutes</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Category:</Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
                  <Text style={styles.categoryText}>
                    {quiz.category === 'bac' ? 'BAC Prep' : 
                     quiz.category === 'def' ? 'DEF Prep' : 'Languages'}
                  </Text>
                </View>
              </View>
            </Card>
            
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              <Text style={styles.instructionsText}>{quiz.instructions}</Text>
            </View>
            
            <Button
              onPress={startQuiz}
              fullWidth
              style={styles.startButton}
            >
              Start Quiz
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render quiz in progress
  if (quizState === QUIZ_STATE.IN_PROGRESS) {
    const currentQuestion = quiz.questionsList[currentQuestionIndex];
    const selectedAnswer = answers[currentQuestion.id];
    const questionNumber = currentQuestionIndex + 1;
    const totalQuestions = quiz.questionsList.length;
    const progress = (questionNumber / totalQuestions) * 100;
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        <View style={styles.quizHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              Alert.alert(
                "Exit Quiz?",
                "Your progress will be lost. Are you sure?",
                [
                  {
                    text: "Continue Quiz",
                    style: "cancel"
                  },
                  { 
                    text: "Exit Quiz", 
                    onPress: () => router.back() 
                  }
                ]
              );
            }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <View style={styles.timerContainer}>
            <Text style={[
              styles.timerText,
              remainingTime < 60 && styles.timerWarning
            ]}>
              {formatTime(remainingTime)}
            </Text>
          </View>
          
          <Text style={styles.questionCounter}>
            {questionNumber}/{totalQuestions}
          </Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: getCategoryColor() }
              ]}
            />
          </View>
        </View>
        
        <ScrollView style={styles.scrollView}>
          <Question
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showResult={false}
          />
        </ScrollView>
        
        <View style={styles.navigationButtons}>
          <Button
            variant="outline"
            onPress={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={[
              styles.navButton,
              currentQuestionIndex === 0 && styles.disabledButton
            ]}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < totalQuestions - 1 ? (
            <Button
              onPress={goToNextQuestion}
              disabled={!selectedAnswer}
              style={[
                styles.navButton,
                !selectedAnswer && styles.disabledButton
              ]}
            >
              Next
            </Button>
          ) : (
            <Button
              onPress={confirmFinishQuiz}
              style={styles.navButton}
            >
              Finish
            </Button>
          )}
        </View>
      </View>
    );
  }

  // Render quiz results
  if (quizState === QUIZ_STATE.RESULTS) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Header
          title="Quiz Results"
          showBack={true}
          onBackPress={() => router.replace('/quizzes')}
        />
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.resultsContainer}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Your Score</Text>
              <Text style={[
                styles.scoreValue,
                score >= 70 ? styles.scoreHigh : 
                score >= 40 ? styles.scoreMedium : 
                styles.scoreLow
              ]}>
                {score}%
              </Text>
              
              <Text style={styles.scoreMessage}>
                {score >= 70 ? 'Excellent work!' : 
                 score >= 40 ? 'Good effort, keep practicing!' : 
                 'Keep studying, you\'ll improve!'}
              </Text>
            </View>
            
            <Text style={styles.reviewTitle}>Question Review</Text>
            
            {quiz.questionsList.map((question, index) => (
              <View key={question.id} style={styles.reviewItem}>
                <Text style={styles.reviewNumber}>Question {index + 1}</Text>
                <Question
                  question={question}
                  selectedAnswer={answers[question.id] || null}
                  onSelectAnswer={() => {}}
                  showResult={true}
                />
              </View>
            ))}
            
            <View style={styles.actionButtons}>
              <Button
                variant="outline"
                onPress={() => router.back()}
                style={styles.actionButton}
              >
                Back to Quizzes
              </Button>
              
              <Button
                onPress={() => {
                  // In a real app, you might want to navigate to related course material
                  router.push(`/courses/${quiz.courseId}`);
                }}
                style={styles.actionButton}
              >
                Review Course Material
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  quizInfoContainer: {
    padding: Theme.layout.spacing.lg,
  },
  quizTitle: {
    fontSize: Theme.layout.fontSize.xl,
    fontWeight: 'bold',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  quizDescription: {
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.lg,
  },
  infoCard: {
    marginBottom: Theme.layout.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.layout.spacing.sm,
  },
  infoLabel: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '500',
    color: Theme.colors.textPrimary,
  },
  infoValue: {
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textSecondary,
  },
  categoryBadge: {
    paddingHorizontal: Theme.layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.layout.borderRadius.small,
  },
  categoryText: {
    color: Theme.colors.white,
    fontSize: Theme.layout.fontSize.xs,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginBottom: Theme.layout.spacing.lg,
  },
  instructionsTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.sm,
  },
  instructionsText: {
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textSecondary,
    lineHeight: 22,
  },
  startButton: {
    marginTop: Theme.layout.spacing.md,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.layout.spacing.lg,
    paddingTop: 60,
    paddingBottom: Theme.layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Theme.layout.fontSize.lg,
    color: Theme.colors.textPrimary,
  },
  timerContainer: {
    paddingHorizontal: Theme.layout.spacing.md,
    paddingVertical: Theme.layout.spacing.xs,
    borderRadius: Theme.layout.borderRadius.medium,
    backgroundColor: Theme.colors.backgroundSecondary,
  },
  timerText: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  timerWarning: {
    color: Theme.colors.error,
  },
  questionCounter: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  progressBarContainer: {
    paddingHorizontal: Theme.layout.spacing.lg,
    paddingVertical: Theme.layout.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Theme.colors.border,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionContainer: {
    padding: Theme.layout.spacing.lg,
  },
  questionText: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.lg,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: Theme.layout.spacing.lg,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.layout.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.layout.borderRadius.medium,
    marginBottom: Theme.layout.spacing.md,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  selectedOption: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.primary + '10', // 10% opacity
  },
  correctOption: {
    borderColor: Theme.colors.success,
    backgroundColor: Theme.colors.success + '10', // 10% opacity
  },
  incorrectOption: {
    borderColor: Theme.colors.error,
    backgroundColor: Theme.colors.error + '10', // 10% opacity
  },
  optionLetter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.backgroundSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: Theme.layout.fontSize.sm,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginRight: Theme.layout.spacing.md,
  },
  optionText: {
    flex: 1,
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textPrimary,
  },
  selectedOptionText: {
    fontWeight: '500',
  },
  correctOptionText: {
    fontWeight: '500',
  },
  incorrectOptionText: {
    textDecorationLine: 'line-through',
  },
  resultIcon: {
    fontSize: Theme.layout.fontSize.md,
    marginLeft: Theme.layout.spacing.sm,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  navButton: {
    flex: 1,
    marginHorizontal: Theme.layout.spacing.xs,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resultsContainer: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.layout.spacing.lg,
    marginBottom: Theme.layout.spacing.xl,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.layout.borderRadius.medium,
  },
  scoreLabel: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.md,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: Theme.layout.spacing.md,
  },
  scoreHigh: {
    color: Theme.colors.success,
  },
  scoreMedium: {
    color: Theme.colors.warning,
  },
  scoreLow: {
    color: Theme.colors.error,
  },
  scoreMessage: {
    fontSize: Theme.layout.fontSize.md,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  reviewTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginBottom: Theme.layout.spacing.lg,
  },
  reviewItem: {
    marginBottom: Theme.layout.spacing.xl,
  },
  reviewNumber: {
    fontSize: Theme.layout.fontSize.md,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.sm,
  },
  actionButtons: {
    marginTop: Theme.layout.spacing.xl,
  },
  actionButton: {
    marginBottom: Theme.layout.spacing.md,
  },
});