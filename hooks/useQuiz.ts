// hooks/useQuiz.ts - FIXED VERSION

// hooks/useQuiz.ts - FIXED TypeScript version
import { useState, useEffect, useCallback } from "react";
import { shuffleArray } from "../utils/shuffleArray";

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  hint?: string;
  timeLimit?: number;
  points?: number;
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
  timeRemaining: number | null;
  setTimeRemaining: (time: number) => void;
}

// Type the quiz data properly
const ENHANCED_QUIZ_DATA: Record<string, Record<string, Question[]>> = {
  'DEF': {
    'Les_Fractions': [
      {
        id: "1",
        prompt: "Combien fait 1/2 + 1/4 ?",
        options: ["1/6", "2/6", "3/4", "1/8"],
        correctAnswerIndex: 2,
        explanation: "1/2 = 2/4, donc 2/4 + 1/4 = 3/4. Pour additionner des fractions, il faut d'abord les mettre au même dénominateur.",
        hint: "Convertissez 1/2 en quarts pour avoir le même dénominateur.",
        timeLimit: 45,
        points: 10
      },
      {
        id: "2",
        prompt: "Quelle fraction est équivalente à 50% ?",
        options: ["1/4", "1/2", "3/4", "2/3"],
        correctAnswerIndex: 1,
        explanation: "50% = 50/100 = 1/2. Pour convertir un pourcentage en fraction, divisez par 100 et simplifiez.",
        hint: "50% signifie 50 sur 100, quelle fraction cela donne-t-il ?",
        timeLimit: 30,
        points: 10
      },
      {
        id: "3",
        prompt: "Simplifiez 4/8",
        options: ["1/2", "2/4", "1/4", "8/4"],
        correctAnswerIndex: 0,
        explanation: "4/8 = 1/2 car 4 et 8 ont un diviseur commun de 4. 4÷4 = 1 et 8÷4 = 2.",
        hint: "Cherchez le plus grand diviseur commun de 4 et 8.",
        timeLimit: 30,
        points: 10
      }
    ],
    'États_de_la_matière': [
      {
        id: "1",
        prompt: "Quels sont les trois états principaux de la matière ?",
        options: ["Solide, Liquide, Gaz", "Chaud, Froid, Tiède", "Dur, Mou, Flexible", "Grand, Moyen, Petit"],
        correctAnswerIndex: 0,
        explanation: "Les trois états principaux de la matière sont : solide (forme et volume définis), liquide (volume défini, forme variable) et gazeux (forme et volume variables).",
        hint: "Pensez à l'eau sous ses différentes formes.",
        timeLimit: 30,
        points: 10
      },
      {
        id: "2",
        prompt: "À quelle température l'eau bout-elle au niveau de la mer ?",
        options: ["0°C", "50°C", "100°C", "200°C"],
        correctAnswerIndex: 2,
        explanation: "L'eau bout à 100°C au niveau de la mer. C'est le point d'ébullition standard.",
        hint: "C'est la température de l'eau bouillante dans une casserole.",
        timeLimit: 20,
        points: 10
      }
    ]
  },
  'TSE': {
    'Intégrales': [
      {
        id: "1",
        prompt: "Quelle est une primitive de f(x) = 2x ?",
        options: ["x²", "x² + C", "2", "2x + C"],
        correctAnswerIndex: 1,
        explanation: "Une primitive de 2x est x² + C, où C est une constante d'intégration.",
        hint: "Rappelez-vous que l'intégration est l'opération inverse de la dérivation.",
        timeLimit: 45,
        points: 15
      }
    ]
  }
};

export function useQuiz(level: string, stream: string, course: string): UseQuizResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    try {
      console.log(`Loading quiz for: ${level}/${stream}/${course}`);
      
      // Get quiz data with proper type checking
      const quizKey = course.replace(/[_\s]/g, '_');
      const levelData = ENHANCED_QUIZ_DATA[level];
      
      if (!levelData) {
        console.warn('No level data found');
        setQuestions([]);
        return;
      }
      
      const quizData = levelData[quizKey] || levelData['Les_Fractions'] || [];
      
      if (quizData.length === 0) {
        console.warn('No quiz data found, using fallback');
        setQuestions([]);
        return;
      }

      const shuffledQuestions = shuffleArray([...quizData]).map((q) => ({
        ...q,
        options: shuffleArray([...q.options]),
      }));

      const recalculated = shuffledQuestions.map((q) => {
        const originalQuestion = quizData.find((orig: Question) => orig.id === q.id);
        if (!originalQuestion) return q;
        
        const correctText = originalQuestion.options[originalQuestion.correctAnswerIndex];
        const newCorrectIndex = q.options.findIndex((opt: string) => opt === correctText);
        
        return { ...q, correctAnswerIndex: newCorrectIndex };
      });

      setQuestions(recalculated);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
      setIsFinished(false);
      setTimeRemaining(15 * 60);
    } catch (err) {
      console.error("Error loading quiz:", err);
      setQuestions([]);
    }
  }, [level, stream, course]);

  const progressPercent = questions.length > 0
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
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    setIsFinished(false);
    setTimeRemaining(15 * 60);
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
    timeRemaining,
    setTimeRemaining,
  };
}