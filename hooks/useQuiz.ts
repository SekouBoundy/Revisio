// hooks/useQuiz.ts

import { useState, useEffect, useCallback } from "react";
import { shuffleArray } from "../utils/shuffleArray";

// --- DEF Imports ---
import DEF_Anglais from '../data/levels/DEF/AnglaisQuestions.json';
import DEF_Education from '../data/levels/DEF/Éducation_Civique_et_MoraleQuestions.json';
import DEF_Francais from '../data/levels/DEF/FrançaisQuestions.json';
import DEF_HistoireGeo from '../data/levels/DEF/Histoire-GéographieQuestions.json';
import DEF_Math from '../data/levels/DEF/MathématiquesQuestions.json';
import DEF_Physique from '../data/levels/DEF/Physique-ChimieQuestions.json';
import DEF_SVT from '../data/levels/DEF/Sciences_de_la_Vie_et_de_la_TerreQuestions.json';

// --- BAC Imports ---
// BAC/Arts_et_Lettres_TAL
import BAC_ArtsAnglais from '../data/levels/BAC/Arts_et_Lettres_TAL/AnglaisQuestions.json';
import BAC_ArtsPlastiques from '../data/levels/BAC/Arts_et_Lettres_TAL/Arts_plastiques_ou_musiqueQuestions.json';
import BAC_ArtsFrancais from '../data/levels/BAC/Arts_et_Lettres_TAL/FrançaisQuestions.json';
import BAC_ArtsHistoireArt from '../data/levels/BAC/Arts_et_Lettres_TAL/Histoire_de_l’artQuestions.json';
import BAC_ArtsHistoireGeo from '../data/levels/BAC/Arts_et_Lettres_TAL/Histoire-GéographieQuestions.json';
import BAC_ArtsLitterature from '../data/levels/BAC/Arts_et_Lettres_TAL/LittératureQuestions.json';
import BAC_ArtsPhilo from '../data/levels/BAC/Arts_et_Lettres_TAL/PhilosophieQuestions.json';

// BAC/Langues_et_Lettres_TLL
import BAC_LanguesEducation from '../data/levels/BAC/Langues_et_Lettres_TLL/Éducation_CiviqueQuestions.json';
import BAC_LanguesFrancais from '../data/levels/BAC/Langues_et_Lettres_TLL/FrançaisQuestions.json';
import BAC_LanguesHistoireGeo from '../data/levels/BAC/Langues_et_Lettres_TLL/Histoire-GéographieQuestions.json';
import BAC_LanguesLV from '../data/levels/BAC/Langues_et_Lettres_TLL/Langues_vivantesQuestions.json';
import BAC_LanguesLitterature from '../data/levels/BAC/Langues_et_Lettres_TLL/LittératureQuestions.json';
import BAC_LanguesPhilo from '../data/levels/BAC/Langues_et_Lettres_TLL/PhilosophieQuestions.json';

// BAC/Sciences_Économiques_TSECO
import BAC_TSECO_Anglais from '../data/levels/BAC/Sciences_Économiques_TSECO/AnglaisQuestions.json';
import BAC_TSECO_Droit from '../data/levels/BAC/Sciences_Économiques_TSECO/DroitQuestions.json';
import BAC_TSECO_Economie from '../data/levels/BAC/Sciences_Économiques_TSECO/ÉconomieQuestions.json';



// --- Static Lookup Map ---
const QUESTION_BANK: Record<string, any> = {
  // DEF
  "DEF/Anglais": DEF_Anglais,
  "DEF/Education_Civique_et_Morale": DEF_Education,
  "DEF/Francais": DEF_Francais,
  "DEF/Histoire-Geographie": DEF_HistoireGeo,
  "DEF/Mathematiques": DEF_Math,
  "DEF/Physique-Chimie": DEF_Physique,
  "DEF/Sciences_de_la_Vie_et_de_la_Terre": DEF_SVT,

  // BAC
  // BAC/Arts_et_Lettres_TAL
  "BAC/Arts_et_Lettres_TAL/Anglais": BAC_ArtsAnglais,
  "BAC/Arts_et_Lettres_TAL/Arts_plastiques_ou_musique": BAC_ArtsPlastiques,
  "BAC/Arts_et_Lettres_TAL/Français": BAC_ArtsFrancais,
  "BAC/Arts_et_Lettres_TAL/Histoire_de_l’art": BAC_ArtsHistoireArt,
  "BAC/Arts_et_Lettres_TAL/Histoire-Géographie": BAC_ArtsHistoireGeo,
  "BAC/Arts_et_Lettres_TAL/Littérature": BAC_ArtsLitterature,
  "BAC/Arts_et_Lettres_TAL/Philosophie": BAC_ArtsPhilo,

  // BAC/Langues_et_Lettres_TLL
  "BAC/Langues_et_Lettres_TLL/Éducation_Civique": BAC_LanguesEducation,
  "BAC/Langues_et_Lettres_TLL/Français": BAC_LanguesFrancais,
  "BAC/Langues_et_Lettres_TLL/Histoire-Géographie": BAC_LanguesHistoireGeo,
  "BAC/Langues_et_Lettres_TLL/Langues_vivantes": BAC_LanguesLV,
  "BAC/Langues_et_Lettres_TLL/Littérature": BAC_LanguesLitterature,
  "BAC/Langues_et_Lettres_TLL/Philosophie": BAC_LanguesPhilo,

  // BAC/Sciences_Économiques_TSECO
  "BAC/Sciences_Économiques_TSECO/Anglais": BAC_TSECO_Anglais,
  "BAC/Sciences_Économiques_TSECO/Droit": BAC_TSECO_Droit,
  "BAC/Sciences_Économiques_TSECO/Économie": BAC_TSECO_Economie,
};

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

  try {
    const key = `${level}/${stream}/${course}`;
    console.log("Quiz lookup key:", key);
    const raw: Question[] = QUESTION_BANK[key];
    if (!raw) {
      // Show error in a safe way and STOP
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOptionIndex(null);
      setIsCorrect(null);
      setIsFinished(false);
      throw new Error("No quiz data for: " + key);
    }

    // Safe to continue!
    const shuffledQuestions = shuffleArray(raw).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    })) as Question[];

    const recalculated = shuffledQuestions.map((q) => {
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
    // Print error to both JS console and UI
    console.error("Fatal quiz error:", err);
    setQuestions([]); // Safe fallback, no crash
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    setIsFinished(false);
    // Optionally set an error message in state to show in UI
  }

  return () => { isMounted = false; };
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
    const key = `${level}/${stream}/${course}`;
    const raw: Question[] = QUESTION_BANK[key] ?? [];

    const reshuffled = shuffleArray(raw).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    })) as Question[];

    const recalculated = reshuffled.map((q) => {
      const match = raw.find((r) => r.id === q.id)!;
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
  }, [level, stream, course]);

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


