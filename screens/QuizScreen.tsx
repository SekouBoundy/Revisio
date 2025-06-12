// path: screens/QuizScreen.tsx

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemeContext } from "../constants/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";
import { setQuizProgress } from "../utils/quizProgress";

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

type Question = {
  question: string;
  options: string[];
  correctOption: string;
};

export default function QuizScreen() {
  const { theme } = useContext(ThemeContext) as unknown as ThemeContextType;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const router = useRouter();

  const { level, stream, courseId, quizKey } = useLocalSearchParams<{
    level: string;
    stream: string;
    courseId: string;
    quizKey: string;
  }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let questionsData;

        if (level === "DEF") {
          questionsData = await import(
            `../data/levels/DEF/${courseId}Questions.json`
          );
        } else {
          console.warn("BAC quiz not implemented yet.");
          questionsData = { default: [] };
        }

        setQuestions(questionsData.default);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading questions:", error);
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [level, stream, courseId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionPress = async (option: string) => {
    setSelectedOption(option);

    if (option === currentQuestion.correctOption) {
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(async () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        // Mark quiz as completed
        await setQuizProgress(quizKey, true);
        setShowResults(true);
      }
    }, 800);
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResults(false);
    setCorrectCount(0);
  };

  const handleBackToCourse = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (showResults) {
    const scorePercent = Math.round((correctCount / questions.length) * 100);

    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
            paddingBottom: tabBarHeight,
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.headerText}>Résultats du Quiz</Text>
          <Text style={styles.resultText}>
            {correctCount} bonnes réponses sur {questions.length}
          </Text>
          <Text style={styles.resultText}>Score: {scorePercent}%</Text>

          <TouchableOpacity style={styles.button} onPress={handleRetryQuiz}>
            <Text style={styles.buttonText}>Recommencer le Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.secondary }]}
            onPress={handleBackToCourse}
          >
            <Text style={styles.buttonText}>Retour au cours</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.questionText}>Aucune question disponible.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: tabBarHeight,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} sur {questions.length}
        </Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {currentQuestion.options.map((option, index) => {
          const isCorrect = selectedOption && option === currentQuestion.correctOption;
          const isSelected = selectedOption === option;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && {
                  backgroundColor: isCorrect
                    ? theme.success
                    : theme.error,
                  borderColor: isCorrect ? theme.success : theme.error,
                },
              ]}
              onPress={() => handleOptionPress(option)}
              disabled={!!selectedOption}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: "#fff", fontWeight: "bold" },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  contentContainer: {
    paddingVertical: Spacing.lg,
  },
  progressText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  questionContainer: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    elevation: 4,
  },
  questionText: {
    fontSize: FontSizes.large,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f9f9f9",
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: "#ddd",
    elevation: 2,
  },
  optionText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  headerText: {
    fontSize: FontSizes.large,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: Spacing.lg,
    textAlign: "center",
  },
  resultText: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: 8,
    marginBottom: Spacing.md,
    elevation: 3,
  },
  buttonText: {
    fontSize: FontSizes.medium,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
