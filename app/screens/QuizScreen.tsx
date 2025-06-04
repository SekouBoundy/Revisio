// path: app/screens/QuizScreen.tsx

import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuiz } from "../../hooks/useQuiz";
import OptionButton from "../../components/ui/OptionButton";
import Button from "../../components/ui/Button";
import ProgressBar from "../../components/ui/ProgressBar";
import { Colors, FontSizes, Spacing } from "../../constants/ThemeContext";

type RouteParams = {
  level: "DEF" | "BAC";
  stream: string;
  course: string;
};

export default function QuizScreen() {
  const { level, stream, course } = useLocalSearchParams<RouteParams>();
  const router = useRouter();
  const {
    questions,
    currentQuestionIndex,
    score,
    isFinished,
    selectedOptionIndex,
    isCorrect,
    progressPercent,
    selectOption,
    goToNextQuestion,
    resetQuiz,
  } = useQuiz("BAC", "Arts_et_Lettres_TAL", "Anglais");

  // 👉 Add this check!
  if (!questions.length) {
    return <Text>No questions found for this quiz!</Text>;
  }

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Quiz terminé !</Text>
        <Text style={styles.scoreText}>
          Votre score : {score} / {questions.length}
        </Text>
        <Button label="Reprendre le Quiz" onPress={resetQuiz} />
        <Button
          label="Retour aux cours"
          onPress={() => {
            router.back();
          }}
        />
      </SafeAreaView>
    );
  }

  const current = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar progress={progressPercent} />

      <View style={styles.questionContainer}>
        <Text style={styles.questionCount}>
          Question {currentQuestionIndex + 1} sur {questions.length}
        </Text>
        <Text style={styles.prompt}>{current.prompt}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {current.options.map((opt, idx) => {
          let highlight: "correct" | "incorrect" | null = null;
          if (selectedOptionIndex !== null) {
            if (idx === current.correctAnswerIndex) {
              highlight = "correct";
            } else if (
              idx === selectedOptionIndex &&
              idx !== current.correctAnswerIndex
            ) {
              highlight = "incorrect";
            }
          }
          return (
            <OptionButton
              key={idx}
              label={opt}
              onPress={() => selectOption(idx)}
              disabled={selectedOptionIndex !== null}
              highlight={highlight}
            />
          );
        })}
      </View>

      {isCorrect !== null && current.explanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationHeader}>
            {isCorrect ? "✅ Correct !" : "❌ Incorrect"}
          </Text>
          <Text style={styles.explanationText}>{current.explanation}</Text>
        </View>
      )}

      <View style={styles.footer}>
        {selectedOptionIndex !== null ? (
          <Button label="Question suivante" onPress={goToNextQuestion} />
        ) : (
          <Text style={styles.instructionText}>
            Sélectionnez une réponse pour continuer
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  header: {
    fontSize: FontSizes.large,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: Spacing.lg,
    color: Colors.textPrimary,
  },
  scoreText: {
    fontSize: FontSizes.medium,
    textAlign: "center",
    marginBottom: Spacing.lg,
    color: Colors.textPrimary,
  },
  questionContainer: {
    marginVertical: Spacing.md,
  },
  questionCount: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  prompt: {
    fontSize: FontSizes.medium,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  optionsContainer: {
    flex: 1,
    marginVertical: Spacing.md,
  },
  explanationContainer: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  explanationHeader: {
    fontSize: FontSizes.medium,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  explanationText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
  },
  footer: {
    marginBottom: Spacing.md,
  },
  instructionText: {
    fontSize: FontSizes.small,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
