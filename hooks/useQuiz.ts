// <project root>/hooks/useQuiz.ts

import { useState, useEffect, useCallback } from "react";
import { shuffleArray } from "../utils/shuffleArray";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

interface UseQuizResult {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
  progressPercent: number;
  selectOption: (index: number) => void;
  goToNextQuestion: () => void;
  resetQuiz: () => void;
}

export function useQuiz(
  level: string,
  stream: string,
  course: string
): UseQuizResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadQuestions() {
      try {
        // Build JSON path: if stream is nonempty, include it, otherwise skip the slash
        const jsonPath = stream
          ? `../data/levels/${level}/${stream}/${course}Questions.json`
          : `../data/levels/${level}/${course}Questions.json`;

        const module = await import(jsonPath);
        const raw: Question[] = module.default;

        // Shuffle questions, then shuffle each question’s options
        const shuffledQuestions = shuffleArray(raw).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        })) as Question[];

        // Recalculate correctAnswerIndex after options are shuffled
        const recalculated = shuffledQuestions.map((q) => {
          // Find the original question object in `raw`
          const match = raw.find((r) => r.id === q.id)!;
          const correctText = match.options[match.correctAnswerIndex];
          const newCorrectIndex = q.options.findIndex((opt) => opt === correctText);
          return { ...q, correctAnswerIndex: newCorrectIndex };
        });

        if (isMounted) {
          setQuestions(recalculated);
          setCurrentQuestionIndex(0);
          setScore(0);
          setSelectedOptionIndex(null);
          setIsCorrect(null);
          setIsFinished(false);
        }
      } catch (err) {
        console.error(
          `Failed to load questions for level="${level}", stream="${stream}", course="${course}"`,
          err
        );
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [level, stream, course]);

  const progressPercent =
    questions.length > 0
      ? (currentQuestionIndex + (isCorrect !== null ? 1 : 0)) / questions.length
      : 0;

  const selectOption = useCallback(
    (index: number) => {
      if (selectedOptionIndex !== null) return;
      setSelectedOptionIndex(index);

      const correct = questions[currentQuestionIndex].correctAnswerIndex === index;
      setIsCorrect(correct);
      if (correct) {
        setScore((prev) => prev + 1);
      }
    },
    [questions, currentQuestionIndex, selectedOptionIndex]
  );

  const goToNextQuestion = useCallback(() => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= questions.length) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex(nextIdx);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
    }
  }, [currentQuestionIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    const reshuffled = shuffleArray(questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    })) as Question[];

    // Recalculate correctAnswerIndex again
    const recalculated = reshuffled.map((q) => {
      const rawModule = (require(
        stream
          ? `../data/levels/${level}/${stream}/${course}Questions.json`
          : `../data/levels/${level}/${course}Questions.json`
      ) as { default: Question[] }).default;

      const match = rawModule.find((r) => r.id === q.id)!;
      const correctText = match.options[match.correctAnswerIndex];
      const newCorrectIndex = q.options.findIndex((opt) => opt === correctText);
      return { ...q, correctAnswerIndex: newCorrectIndex };
    });

    setQuestions(recalculated);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    setIsFinished(false);
  }, [questions, level, stream, course]);

  return {
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
  };
}
