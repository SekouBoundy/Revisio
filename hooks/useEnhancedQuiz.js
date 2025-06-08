// hooks/useEnhancedQuiz.js - MVP ENHANCED QUIZ HOOK
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Vibration } from 'react-native';
import { EnhancedQuizManager, quizCache } from '../utils/enhancedQuizManager';

export const useEnhancedQuiz = (level = 'DEF') => {
  const [quizManager] = useState(() => new EnhancedQuizManager(level));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Quiz data state
  const [subjects, setSubjects] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [userSettings, setUserSettings] = useState({});
  const [stats, setStats] = useState(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);

  // Initialize data
  useEffect(() => {
    loadInitialData();
  }, [level]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load basic data
      const subjectsData = quizManager.getSubjects();
      const allQuizzesData = quizManager.getAllQuizzes();
      
      setSubjects(subjectsData);
      setAllQuizzes(allQuizzesData);
      setFilteredQuizzes(allQuizzesData);

      // Load user data
      const [progressData, settingsData, statsData] = await Promise.all([
        quizManager.getUserProgress(),
        quizManager.getUserSettings(),
        quizManager.getDetailedStats()
      ]);

      setUserProgress(progressData);
      setUserSettings(settingsData);
      setStats(statsData);

    } catch (err) {
      setError(err.message);
      console.error('Error loading quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    const filtered = quizManager.searchQuizzes(searchQuery, activeFilters);
    setFilteredQuizzes(filtered);
  }, [searchQuery, activeFilters, allQuizzes]);

  const updateSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const updateFilters = useCallback((filters) => {
    setActiveFilters(prev => ({ ...prev, ...filters }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchQuery('');
  }, []);

  // Quiz progress methods
  const updateQuizProgress = useCallback(async (quizId, result) => {
    try {
      const updatedProgress = await quizManager.updateQuizResult(quizId, result);
      
      // Update local state
      setUserProgress(prev => ({
        ...prev,
        [quizId]: updatedProgress
      }));

      // Refresh stats
      const newStats = await quizManager.getDetailedStats();
      setStats(newStats);

      return updatedProgress;
    } catch (err) {
      console.error('Error updating quiz progress:', err);
      throw err;
    }
  }, [quizManager]);

  // Recommendations
  const [recommendations, setRecommendations] = useState([]);
  
  const loadRecommendations = useCallback(async (limit = 5) => {
    try {
      const recs = await quizManager.getPersonalizedRecommendations(limit);
      setRecommendations(recs);
      return recs;
    } catch (err) {
      console.error('Error loading recommendations:', err);
      return [];
    }
  }, [quizManager]);

  useEffect(() => {
    if (Object.keys(userProgress).length > 0) {
      loadRecommendations();
    }
  }, [userProgress, loadRecommendations]);

  // Settings management
  const updateSettings = useCallback(async (newSettings) => {
    try {
      const updated = { ...userSettings, ...newSettings };
      await quizManager.saveUserSettings(updated);
      setUserSettings(updated);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      return false;
    }
  }, [userSettings, quizManager]);

  // Utility methods
  const getQuizById = useCallback((quizId) => {
    return quizManager.getQuizById(quizId);
  }, [quizManager]);

  const getSubject = useCallback((subjectId) => {
    return quizManager.getSubject(subjectId);
  }, [quizManager]);

  const getQuizzesBySubject = useCallback((subjectId) => {
    return quizManager.getQuizzesBySubject(subjectId);
  }, [quizManager]);

  const prepareQuiz = useCallback((quizId, options = {}) => {
    return quizManager.prepareQuizForTaking(quizId, {
      shuffle: userSettings.shuffleQuestions !== false,
      includeHints: userSettings.hintsEnabled !== false,
      includeExplanations: userSettings.explanationsEnabled !== false,
      ...options
    });
  }, [quizManager, userSettings]);

  const calculateResults = useCallback((quiz, answers, startTime, endTime) => {
    return quizManager.calculateQuizResults(quiz, answers, startTime, endTime);
  }, [quizManager]);

  // Analytics and insights
  const getSubjectProgress = useCallback((subjectId) => {
    const subjectQuizzes = getQuizzesBySubject(subjectId);
    const subjectData = getSubject(subjectId);
    
    let completed = 0;
    let totalScore = 0;
    let totalTime = 0;
    let expertLevel = 0;

    subjectQuizzes.forEach(quiz => {
      const progress = userProgress[quiz.id];
      if (progress && progress.isCompleted) {
        completed++;
        totalScore += progress.bestScore;
        totalTime += progress.totalTime;
        if (progress.masteryLevel === 'expert') expertLevel++;
      }
    });

    return {
      ...subjectData,
      totalQuizzes: subjectQuizzes.length,
      completedQuizzes: completed,
      completionRate: Math.round((completed / subjectQuizzes.length) * 100),
      averageScore: completed > 0 ? Math.round(totalScore / completed) : 0,
      totalTime,
      expertQuizzes: expertLevel,
      masteryRate: Math.round((expertLevel / subjectQuizzes.length) * 100)
    };
  }, [getQuizzesBySubject, getSubject, userProgress]);

  const getWeakSubjects = useCallback(() => {
    return subjects
      .map(subject => getSubjectProgress(subject.id))
      .filter(progress => progress.completedQuizzes > 0)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);
  }, [subjects, getSubjectProgress]);

  const getStrongSubjects = useCallback(() => {
    return subjects
      .map(subject => getSubjectProgress(subject.id))
      .filter(progress => progress.completedQuizzes > 0)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);
  }, [subjects, getSubjectProgress]);

  // Performance insights
  const getPerformanceInsights = useCallback(() => {
    if (!stats) return null;

    const insights = [];

    // Completion rate insight
    if (stats.completionRate < 30) {
      insights.push({
        type: 'completion',
        level: 'low',
        message: 'Essayez de compléter plus de quiz pour améliorer vos connaissances',
        suggestion: 'Commencez par les quiz "Facile" pour prendre confiance'
      });
    } else if (stats.completionRate > 80) {
      insights.push({
        type: 'completion',
        level: 'high',
        message: 'Excellent taux de completion ! Vous êtes très assidu',
        suggestion: 'Tentez maintenant les quiz "Difficile" pour vous challenger'
      });
    }

    // Score insight
    if (stats.averageScore < 60) {
      insights.push({
        type: 'score',
        level: 'low',
        message: 'Vos scores peuvent être améliorés',
        suggestion: 'Prenez plus de temps pour réviser avant les quiz'
      });
    } else if (stats.averageScore > 85) {
      insights.push({
        type: 'score',
        level: 'high',
        message: 'Excellents résultats ! Vous maîtrisez bien les sujets',
        suggestion: 'Explorez des sujets plus avancés'
      });
    }

    // Streak insight
    if (stats.streak === 0) {
      insights.push({
        type: 'streak',
        level: 'none',
        message: 'Commencez une série en faisant un quiz aujourd\'hui',
        suggestion: 'La régularité est clé pour un apprentissage efficace'
      });
    } else if (stats.streak >= 7) {
      insights.push({
        type: 'streak',
        level: 'excellent',
        message: `Fantastique série de ${stats.streak} jours !`,
        suggestion: 'Continuez cette excellente habitude d\'étude'
      });
    }

    return insights;
  }, [stats]);

  // Quick actions
  const getQuickActions = useCallback(() => {
    const actions = [];

    // Based on progress and recommendations
    if (recommendations.length > 0) {
      const topRec = recommendations[0];
      actions.push({
        id: 'recommended',
        title: 'Quiz recommandé',
        subtitle: topRec.title,
        icon: 'star',
        color: '#FFD700',
        action: () => topRec,
        priority: topRec.priority
      });
    }

    // Quick review for mastered topics
    const masteredQuizzes = Object.entries(userProgress)
      .filter(([_, progress]) => progress.masteryLevel === 'expert')
      .map(([quizId]) => getQuizById(quizId))
      .filter(Boolean);

    if (masteredQuizzes.length > 0) {
      const randomMastered = masteredQuizzes[Math.floor(Math.random() * masteredQuizzes.length)];
      actions.push({
        id: 'review',
        title: 'Révision rapide',
        subtitle: randomMastered.title,
        icon: 'refresh',
        color: '#4CAF50',
        action: () => randomMastered
      });
    }

    // Challenge mode
    const difficultQuizzes = allQuizzes.filter(q => q.difficulty === 'Difficile');
    if (difficultQuizzes.length > 0) {
      const randomDifficult = difficultQuizzes[Math.floor(Math.random() * difficultQuizzes.length)];
      actions.push({
        id: 'challenge',
        title: 'Défi',
        subtitle: 'Quiz difficile',
        icon: 'trophy',
        color: '#FF5722',
        action: () => randomDifficult
      });
    }

    // Weak subject improvement
    const weakSubjects = getWeakSubjects();
    if (weakSubjects.length > 0) {
      const weakestSubject = weakSubjects[0];
      const subjectQuizzes = getQuizzesBySubject(weakestSubject.id);
      const uncompletedQuiz = subjectQuizzes.find(q => !userProgress[q.id]?.isCompleted);
      
      if (uncompletedQuiz) {
        actions.push({
          id: 'improve',
          title: 'À améliorer',
          subtitle: `${weakestSubject.description?.split(' ').slice(0, 3).join(' ')}...`,
          icon: 'trending-up',
          color: '#FF9800',
          action: () => uncompletedQuiz
        });
      }
    }

    return actions.slice(0, 4); // Limit to 4 actions
  }, [recommendations, userProgress, allQuizzes, getQuizById, getWeakSubjects, getQuizzesBySubject]);

  return {
    // Data
    subjects,
    allQuizzes,
    filteredQuizzes,
    userProgress,
    userSettings,
    stats,
    recommendations,

    // State
    loading,
    error,
    searchQuery,
    activeFilters,

    // Search and filter
    updateSearch,
    updateFilters,
    clearFilters,

    // Quiz management
    getQuizById,
    getSubject,
    getQuizzesBySubject,
    prepareQuiz,
    calculateResults,
    updateQuizProgress,

    // Analytics
    getSubjectProgress,
    getWeakSubjects,
    getStrongSubjects,
    getPerformanceInsights,
    getQuickActions,

    // Settings
    updateSettings,

    // Utilities
    loadRecommendations,
    refreshData: loadInitialData,
    quizManager
  };
};

// Enhanced quiz taking hook
export const useQuizTaking = (quizId, level = 'DEF') => {
  const quizManager = useRef(new EnhancedQuizManager(level)).current;
  
  // Quiz state
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);

  // UI state
  const [showHints, setShowHints] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Settings
  const [settings, setSettings] = useState({});

  // Initialize quiz
  useEffect(() => {
    initializeQuiz();
    loadSettings();
  }, [quizId]);

  const loadSettings = async () => {
    const userSettings = await quizManager.getUserSettings();
    setSettings(userSettings);
  };

  const initializeQuiz = () => {
    const preparedQuiz = quizManager.prepareQuizForTaking(quizId, {
      shuffle: true,
      includeHints: true,
      includeExplanations: true
    });

    if (preparedQuiz) {
      setQuiz(preparedQuiz);
      setTimeRemaining(preparedQuiz.duration * 60); // Convert to seconds
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
    }
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isFinished && startTime) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isFinished) {
      finishQuiz();
    }
  }, [timeRemaining, isFinished, startTime]);

  // Question navigation
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < quiz?.questions.length) {
      // Record time for current question if we're moving away from it
      if (questionStartTime && currentQuestionIndex !== index) {
        const timeSpent = Date.now() - questionStartTime;
        setQuestionTimes(prev => {
          const newTimes = [...prev];
          newTimes[currentQuestionIndex] = timeSpent;
          return newTimes;
        });
      }

      setCurrentQuestionIndex(index);
      setQuestionStartTime(Date.now());
      setShowExplanation(false);
      setShowHints(false);
    }
  }, [quiz, currentQuestionIndex, questionStartTime]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < quiz?.questions.length - 1) {
      goToQuestion(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  }, [currentQuestionIndex, quiz, goToQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, goToQuestion]);

  // Answer handling
  const selectAnswer = useCallback((questionId, answerIndex) => {
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    if (!currentQuestion || answers[questionId] !== undefined) return;

    // Record time for this question
    if (questionStartTime) {
      const timeSpent = Date.now() - questionStartTime;
      setQuestionTimes(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = timeSpent;
        return newTimes;
      });
    }

    // Set answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    // Haptic feedback
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    if (settings.vibrationEnabled !== false) {
      if (isCorrect) {
        Vibration.vibrate(100);
      } else {
        Vibration.vibrate([50, 100, 50]);
      }
    }

    // Show explanation after delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);

    // Auto advance if enabled
    if (settings.autoNextQuestion) {
      setTimeout(() => {
        nextQuestion();
      }, 3000);
    }
  }, [quiz, currentQuestionIndex, answers, questionStartTime, settings, nextQuestion]);

  // Quiz completion
  const finishQuiz = useCallback(() => {
    if (isFinished) return;

    const endTime = Date.now();
    const quizResults = quizManager.calculateQuizResults(quiz, answers, startTime, endTime);
    
    setResults(quizResults);
    setIsFinished(true);

    // Save progress
    if (quizResults) {
      quizManager.updateQuizResult(quizId, quizResults);
    }
  }, [quiz, answers, startTime, quizId, isFinished, quizManager]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuestionTimes([]);
    setIsFinished(false);
    setResults(null);
    setShowExplanation(false);
    setShowHints(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    
    // Reinitialize with new shuffle
    initializeQuiz();
  }, []);

  // Current question data
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : false;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion?.correctIndex;

  // Progress calculation
  const progress = quiz ? (currentQuestionIndex + (isAnswered ? 1 : 0)) / quiz.questions.length : 0;
  const questionsAnswered = Object.keys(answers).length;

  // Utility functions
  const canGoNext = isAnswered || settings.allowSkip;
  const canGoPrevious = currentQuestionIndex > 0;
  const canFinish = questionsAnswered === quiz?.questions.length;

  const toggleHints = useCallback(() => {
    setShowHints(prev => !prev);
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // Quiz data
    quiz,
    currentQuestion,
    currentQuestionIndex,
    answers,
    results,
    settings,

    // State
    isFinished,
    isAnswered,
    selectedAnswer,
    isCorrect,
    showHints,
    showExplanation,
    timeRemaining,

    // Progress
    progress,
    questionsAnswered,
    totalQuestions: quiz?.questions.length || 0,

    // Navigation
    canGoNext,
    canGoPrevious,
    canFinish,
    nextQuestion,
    previousQuestion,
    goToQuestion,

    // Actions
    selectAnswer,
    finishQuiz,
    restartQuiz,
    toggleHints,

    // Utilities
    formatTime,
    
    // Times
    questionTimes,
    startTime
  };
};

export default useEnhancedQuiz;