// utils/quizDataManager.js - FIXED VERSION WITH NULL CHECKS
import { shuffleArray } from './shuffleArray';

// Enhanced quiz data structure
export const ENHANCED_QUIZ_DATA = {
  DEF: {
    subjects: {
      'Mathématiques': {
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Maîtrisez les concepts mathématiques fondamentaux',
        quizzes: {
          'Les_Fractions': {
            id: 'def_fractions',
            title: 'Les Fractions',
            subject: 'Mathématiques',
            difficulty: 'Facile',
            duration: 15,
            description: 'Apprenez à manipuler les fractions avec confiance',
            tags: ['arithmétique', 'fractions', 'calcul'],
            questions: [
              {
                id: "1",
                prompt: "Combien fait 1/2 + 1/4 ?",
                options: ["1/6", "2/6", "3/4", "1/8"],
                correctAnswerIndex: 2,
                explanation: "1/2 = 2/4, donc 2/4 + 1/4 = 3/4"
              },
              {
                id: "2",
                prompt: "Quelle fraction est équivalente à 50% ?",
                options: ["1/4", "1/2", "3/4", "2/3"],
                correctAnswerIndex: 1,
                explanation: "50% = 50/100 = 1/2"
              }
            ]
          }
        }
      },
      'Français': {
        icon: 'language-outline',
        color: '#FF9800',
        description: 'Perfectionnez votre maîtrise de la langue française',
        quizzes: {
          'Conjugaison_présent': {
            id: 'def_conjugaison',
            title: 'Conjugaison au présent',
            subject: 'Français',
            difficulty: 'Moyen',
            duration: 18,
            description: 'Maîtrisez la conjugaison des verbes au présent',
            tags: ['conjugaison', 'présent', 'verbes'],
            questions: [
              {
                id: "1",
                prompt: "Comment conjugue-t-on le verbe \"être\" à la 1ère personne du singulier ?",
                options: ["je sers", "je suis", "j'ai", "je fais"],
                correctAnswerIndex: 1,
                explanation: "Le verbe \"être\" à la 1ère personne du singulier se conjugue \"je suis\"."
              }
            ]
          }
        }
      }
    }
  },
  TSE: {
    subjects: {
      'Mathématiques': {
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Analyse mathématique avancée pour TSE',
        quizzes: {
          'Intégrales': {
            id: 'tse_integrales',
            title: 'Intégrales',
            subject: 'Mathématiques',
            difficulty: 'Difficile',
            duration: 45,
            description: 'Maîtrisez le calcul intégral',
            tags: ['analyse', 'intégrales', 'calcul'],
            questions: [
              {
                id: "1",
                prompt: "Quelle est la primitive de f(x) = 2x ?",
                options: ["x²", "x² + C", "2", "2x + C"],
                correctAnswerIndex: 1,
                explanation: "La primitive de 2x est x² + C, où C est une constante d'intégration."
              }
            ]
          }
        }
      }
    }
  }
};

// Quiz management utilities with error handling
export class QuizManager {
  constructor(level = 'DEF') {
    this.level = level;
    this.data = ENHANCED_QUIZ_DATA[level] || ENHANCED_QUIZ_DATA.DEF || { subjects: {} };
  }

  // Get all subjects for current level with null checks
  getSubjects() {
    try {
      if (!this.data || !this.data.subjects) {
        return [];
      }
      return Object.keys(this.data.subjects);
    } catch (error) {
      console.error('Error getting subjects:', error);
      return [];
    }
  }

  // Get subject data with null checks
  getSubject(subjectName) {
    try {
      if (!this.data || !this.data.subjects || !subjectName) {
        return null;
      }
      return this.data.subjects[subjectName] || null;
    } catch (error) {
      console.error('Error getting subject:', error);
      return null;
    }
  }

  // Get all quizzes for a subject with null checks
  getQuizzesForSubject(subjectName) {
    try {
      const subject = this.getSubject(subjectName);
      if (!subject || !subject.quizzes) {
        return {};
      }
      return subject.quizzes;
    } catch (error) {
      console.error('Error getting quizzes for subject:', error);
      return {};
    }
  }

  // Get specific quiz with null checks
  getQuiz(subjectName, quizName) {
    try {
      const quizzes = this.getQuizzesForSubject(subjectName);
      if (!quizzes || !quizName) {
        return null;
      }
      return quizzes[quizName] || null;
    } catch (error) {
      console.error('Error getting quiz:', error);
      return null;
    }
  }

  // Get quiz by ID with null checks
  getQuizById(quizId) {
    try {
      if (!this.data || !this.data.subjects || !quizId) {
        return null;
      }

      for (const subject of Object.values(this.data.subjects)) {
        if (subject && subject.quizzes) {
          for (const quiz of Object.values(subject.quizzes)) {
            if (quiz && quiz.id === quizId) {
              return quiz;
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting quiz by ID:', error);
      return null;
    }
  }

  // Get recommended quizzes based on user progress with null checks
  getRecommendedQuizzes(userProgress = {}) {
    try {
      const recommended = [];
      
      if (!this.data || !this.data.subjects) {
        return recommended;
      }

      for (const [subjectName, subject] of Object.entries(this.data.subjects)) {
        if (!subject || !subject.quizzes) {
          continue;
        }

        for (const [quizName, quiz] of Object.entries(subject.quizzes)) {
          if (!quiz || !quiz.id) {
            continue;
          }

          // Simple recommendation logic for MVP
          const userScore = userProgress[quiz.id]?.score || 0;
          const attempts = userProgress[quiz.id]?.attempts || 0;
          
          // Recommend if never taken or score below 80%
          if (attempts === 0 || (userScore < 80 && attempts < 3)) {
            recommended.push({
              ...quiz,
              reason: attempts === 0 
                ? 'Nouveau quiz à découvrir' 
                : 'Améliorez votre score'
            });
          }
        }
      }
      
      return recommended.slice(0, 3); // Top 3 recommendations
    } catch (error) {
      console.error('Error getting recommended quizzes:', error);
      return [];
    }
  }

  // Get quiz statistics with null checks
  getQuizStats(userProgress = {}) {
    try {
      let totalQuizzes = 0;
      let completedQuizzes = 0;
      let totalScore = 0;
      let totalAttempts = 0;

      if (!this.data || !this.data.subjects) {
        return {
          totalQuizzes: 0,
          completedQuizzes: 0,
          averageScore: 0,
          completionRate: 0,
          totalAttempts: 0
        };
      }

      for (const subject of Object.values(this.data.subjects)) {
        if (!subject || !subject.quizzes) {
          continue;
        }

        for (const quiz of Object.values(subject.quizzes)) {
          if (!quiz || !quiz.id) {
            continue;
          }

          totalQuizzes++;
          const progress = userProgress[quiz.id];
          if (progress && progress.attempts > 0) {
            completedQuizzes++;
            totalScore += progress.score || 0;
            totalAttempts += progress.attempts;
          }
        }
      }

      return {
        totalQuizzes,
        completedQuizzes,
        averageScore: completedQuizzes > 0 ? Math.round(totalScore / completedQuizzes) : 0,
        completionRate: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0,
        totalAttempts
      };
    } catch (error) {
      console.error('Error getting quiz stats:', error);
      return {
        totalQuizzes: 0,
        completedQuizzes: 0,
        averageScore: 0,
        completionRate: 0,
        totalAttempts: 0
      };
    }
  }

  // Search quizzes with null checks
  searchQuizzes(query) {
    try {
      const results = [];
      const searchTerm = query ? query.toLowerCase() : '';
      
      if (!searchTerm || !this.data || !this.data.subjects) {
        return results;
      }
      
      for (const [subjectName, subject] of Object.entries(this.data.subjects)) {
        if (!subject || !subject.quizzes) {
          continue;
        }

        for (const quiz of Object.values(subject.quizzes)) {
          if (!quiz) {
            continue;
          }

          const searchableText = [
            quiz.title || '',
            quiz.subject || '',
            quiz.description || '',
            ...(quiz.tags || [])
          ].join(' ').toLowerCase();
          
          if (searchableText.includes(searchTerm)) {
            results.push({
              ...quiz,
              subjectName,
              icon: subject.icon || 'help-circle',
              color: subject.color || '#2196F3'
            });
          }
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error searching quizzes:', error);
      return [];
    }
  }
}

// User progress management with error handling
export class UserProgressManager {
  constructor() {
    this.storageKey = 'quiz_progress';
  }

  // Get user progress from storage with fallback
  async getUserProgress() {
    try {
      // For now, return mock data since we're not using AsyncStorage
      return {};
    } catch (error) {
      console.error('Error loading user progress:', error);
      return {};
    }
  }

  // Save user progress with error handling
  async saveUserProgress(progress) {
    try {
      // For now, just return true since we're not persisting
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  // Get overall statistics with fallbacks
  async getOverallStats() {
    try {
      const progress = await this.getUserProgress();
      
      return {
        totalQuizzesTaken: 0,
        totalAttempts: 0,
        averageScore: 0,
        totalPoints: 0,
        totalTimeSpent: 0,
        streak: 0
      };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      return {
        totalQuizzesTaken: 0,
        totalAttempts: 0,
        averageScore: 0,
        totalPoints: 0,
        totalTimeSpent: 0,
        streak: 0
      };
    }
  }
}

// Export default instances
export const quizManager = new QuizManager();
export const progressManager = new UserProgressManager();

// Helper functions for React components
export const useQuizData = (level) => {
  try {
    return new QuizManager(level);
  } catch (error) {
    console.error('Error creating quiz manager:', error);
    return new QuizManager('DEF'); // Fallback to DEF
  }
};

export const getQuizByTitle = (level, title) => {
  try {
    const manager = new QuizManager(level);
    const cleanTitle = title ? title.replace(/[_\s]/g, ' ') : '';
    
    if (!cleanTitle) {
      return null;
    }
    
    const subjects = manager.getSubjects();
    for (const subjectName of subjects) {
      const subject = manager.getSubject(subjectName);
      if (subject && subject.quizzes) {
        for (const quiz of Object.values(subject.quizzes)) {
          if (quiz && (quiz.title === cleanTitle || quiz.id === title)) {
            return quiz;
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting quiz by title:', error);
    return null;
  }
};