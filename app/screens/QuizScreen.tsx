// app/screens/QuizScreen.tsx

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '../../constants/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

// Theme types
type Theme = {
  primary: string;
  secondary: string;
  accent: string;
  neutralDark: string;
  neutralLight: string;
  surface: string;
  background: string;
  text: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

// Dummy questions
const questions = [
  {
    question: 'What is 2 + 2?',
    options: ['1', '2', '3', '4'],
    correctOption: '4',
  },
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    correctOption: 'Paris',
  },
  {
    question: 'Combien fait 1/2 + 1/4 ?',
    options: ['1/6', '2/6', '3/4', '1/8'],
    correctOption: '3/4',
  },
];

export default function QuizScreen() {
  const { theme } = useContext(ThemeContext) as unknown as ThemeContextType;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    setShowFeedback(false);

    if (selectedOption === currentQuestion.correctOption) {
      setScore((s) => s + 1);
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1);
      setSelectedOption(null);
      setShowFeedback(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowFeedback(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setShowFeedback(false);
  };

  const progressPercent =
    ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.topBarButton, { color: theme.text }]}>X</Text>
        </TouchableOpacity>

        <Text style={[styles.progressText, { color: theme.text }]}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>

        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: theme.textSecondary }]}>14:48</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: theme.primary, width: `${progressPercent}%` },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {showResult ? (
          <View style={styles.resultContainer}>
            <Text style={[styles.resultText, { color: theme.text }]}>
              Quiz Completed!
            </Text>
            <Text style={[styles.resultText, { color: theme.textSecondary }]}>
              Your Score: {score} / {questions.length}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleRestart}
            >
              <Text style={styles.buttonText}>Retry Quiz</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={[styles.questionTitle, { color: theme.text }]}>
              {currentQuestion.question}
            </Text>

            {currentQuestion.options.map((option) => {
              let optionStyle = styles.optionButton;
              let optionTextColor = theme.textSecondary;
              let icon = null;

              if (showFeedback) {
                if (option === currentQuestion.correctOption) {
                  optionStyle = { ...optionStyle, ...styles.optionCorrect };
                  optionTextColor = theme.success;
                  icon = '✅';
                } else if (option === selectedOption) {
                  optionStyle = { ...optionStyle, ...styles.optionIncorrect };
                  optionTextColor = theme.error;
                  icon = '❌';
                }
              } else if (selectedOption === option) {
                optionStyle = { ...optionStyle, borderColor: theme.primary };
              }

              return (
                <TouchableOpacity
                  key={option}
                  style={optionStyle}
                  onPress={() => handleOptionSelect(option)}
                  disabled={showFeedback}
                >
                  <Text style={[styles.optionText, { color: optionTextColor }]}>
                    {option} {icon}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {showFeedback && (
              <View style={styles.feedbackContainer}>
                {selectedOption === currentQuestion.correctOption ? (
                  <Text style={{ color: theme.success, fontWeight: 'bold' }}>
                    ✅ Correct
                  </Text>
                ) : (
                  <Text style={{ color: theme.error, fontWeight: 'bold' }}>
                    ❌ Incorrect
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {!showResult && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.surface,
              paddingBottom: tabBarHeight, // ← official correct way!
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor:
                  currentQuestionIndex > 0 ? theme.primary : theme.neutralLight,
              },
            ]}
            disabled={currentQuestionIndex === 0}
            onPress={handlePrevious}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor:
                  showFeedback ? theme.primary : theme.neutralLight,
              },
            ]}
            disabled={!showFeedback}
            onPress={handleNext}
          >
            <Text style={styles.buttonText}>
              {currentQuestionIndex + 1 === questions.length ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  topBarButton: { fontSize: 18, fontWeight: 'bold' },
  progressText: { fontSize: 16, fontWeight: 'bold' },
  timerContainer: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 8,
  },
  timerText: { fontSize: 14 },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    width: '100%',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 4,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderColor: '#ccc',
  },
  optionText: { fontSize: 16 },
  optionCorrect: {
    backgroundColor: '#E6F4EA',
    borderColor: '#66BB6A',
  },
  optionIncorrect: {
    backgroundColor: '#FDEAEA',
    borderColor: '#EF5350',
  },
  feedbackContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerButton: {
    flex: 0.48,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  resultText: { fontSize: 24, marginBottom: 20 },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#4E8CEE',
    marginTop: 20,
  },
});
