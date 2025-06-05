// hooks/useQuiz.ts - FIXED VERSION

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

// SAMPLE DATA - Replace with your actual data later
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    prompt: "Combien fait 2 + 2 ?",
    options: ["3", "4", "5", "6"],
    correctAnswerIndex: 1,
    explanation: "2 + 2 = 4"
  },
  {
    id: "2", 
    prompt: "Quelle est la capitale de la France ?",
    options: ["Lyon", "Marseille", "Paris", "Toulouse"],
    correctAnswerIndex: 2,
    explanation: "Paris est la capitale de la France"
  },
  {
    id: "3",
    prompt: "Combien y a-t-il de continents ?",
    options: ["5", "6", "7", "8"],
    correctAnswerIndex: 2,
    explanation: "Il y a 7 continents sur Terre"
  },
  {
    id: "4",
    prompt: "Quel est le résultat de 5 × 3 ?",
    options: ["12", "15", "18", "20"],
    correctAnswerIndex: 1,
    explanation: "5 × 3 = 15"
  },
  {
    id: "5",
    prompt: "Quelle planète est la plus proche du Soleil ?",
    options: ["Vénus", "Mercure", "Mars", "Terre"],
    correctAnswerIndex: 1,
    explanation: "Mercure est la planète la plus proche du Soleil"
  }
];

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
    try {
      console.log(`Loading quiz for: ${level}/${stream}/${course}`);
      
      const shuffledQuestions = shuffleArray([...SAMPLE_QUESTIONS]).map((q) => ({
        ...q,
        options: shuffleArray([...q.options]),
      }));

      const recalculated = shuffledQuestions.map((q) => {
        const originalQuestion = SAMPLE_QUESTIONS.find((orig) => orig.id === q.id);
        if (!originalQuestion) return q;
        
        const correctText = originalQuestion.options[originalQuestion.correctAnswerIndex];
        const newCorrectIndex = q.options.findIndex((opt) => opt === correctText);
        
        return { ...q, correctAnswerIndex: newCorrectIndex };
      });

      setQuestions(recalculated);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
      setIsFinished(false);
    } catch (err) {
      console.error("Error loading quiz:", err);
      setQuestions([]);
    }
  }, [level, stream, course]);

  const progressPercent =
    questions.length > 0
      ? (currentQuestionIndex + (isCorrect !== null ? 1 : 0)) / questions.length
      : 0;

  const selectOption = useCallback(
    (index: number) => {
      if (selectedOptionIndex !== null || questions.length === 0) return;
      
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
    const reshuffled = shuffleArray([...SAMPLE_QUESTIONS]).map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }));

    const recalculated = reshuffled.map((q) => {
      const originalQuestion = SAMPLE_QUESTIONS.find((orig) => orig.id === q.id);
      if (!originalQuestion) return q;
      
      const correctText = originalQuestion.options[originalQuestion.correctAnswerIndex];
      const newCorrectIndex = q.options.findIndex((opt) => opt === correctText);
      
      return { ...q, correctAnswerIndex: newCorrectIndex };
    });

    setQuestions(recalculated);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    setIsFinished(false);
  }, []);

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