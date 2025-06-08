// utils/quizDataManager.js - ENHANCED QUIZ DATA FOR MVP
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
            prerequisites: [],
            objectives: [
              'Additionner et soustraire des fractions',
              'Multiplier et diviser des fractions',
              'Simplifier des fractions',
              'Convertir pourcentages en fractions'
            ],
            tips: [
              'Trouvez un dénominateur commun pour additionner',
              'Simplifiez toujours le résultat final',
              'Visualisez avec des diagrammes circulaires'
            ],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Combien fait 1/2 + 1/4 ?',
                options: ['1/6', '2/6', '3/4', '1/8'],
                correct: 2,
                explanation: '1/2 = 2/4, donc 2/4 + 1/4 = 3/4. Pour additionner des fractions, il faut d\'abord les mettre au même dénominateur.',
                hint: 'Convertissez 1/2 en quarts pour avoir le même dénominateur.',
                timeLimit: 45,
                points: 10,
                difficulty: 'facile'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Quelle fraction est équivalente à 50% ?',
                options: ['1/4', '1/2', '3/4', '2/3'],
                correct: 1,
                explanation: '50% = 50/100 = 1/2. Pour convertir un pourcentage en fraction, divisez par 100 et simplifiez.',
                hint: '50% signifie 50 sur 100, quelle fraction cela donne-t-il ?',
                timeLimit: 30,
                points: 10,
                difficulty: 'facile'
              },
              {
                id: 3,
                type: 'multiple_choice',
                question: 'Simplifiez 4/8',
                options: ['1/2', '2/4', '1/4', '8/4'],
                correct: 0,
                explanation: '4/8 = 1/2 car 4 et 8 ont un diviseur commun de 4. 4÷4 = 1 et 8÷4 = 2.',
                hint: 'Cherchez le plus grand diviseur commun de 4 et 8.',
                timeLimit: 30,
                points: 10,
                difficulty: 'facile'
              },
              {
                id: 4,
                type: 'multiple_choice',
                question: 'Calculez 2/3 × 3/4',
                options: ['6/12', '5/7', '1/2', '6/7'],
                correct: 0,
                explanation: '2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2. Pour multiplier des fractions, multipliez les numérateurs ensemble et les dénominateurs ensemble.',
                hint: 'Multipliez numérateur avec numérateur, dénominateur avec dénominateur.',
                timeLimit: 60,
                points: 15,
                difficulty: 'moyen'
              },
              {
                id: 5,
                type: 'multiple_choice',
                question: 'Laquelle de ces fractions est la plus grande ?',
                options: ['2/5', '3/7', '4/9', '5/11'],
                correct: 3,
                explanation: 'En convertissant en décimales : 2/5 = 0.4, 3/7 ≈ 0.429, 4/9 ≈ 0.444, 5/11 ≈ 0.455. Donc 5/11 est la plus grande.',
                hint: 'Convertissez en décimales ou trouvez un dénominateur commun.',
                timeLimit: 90,
                points: 20,
                difficulty: 'difficile'
              }
            ]
          },
          'Géométrie_de_base': {
            id: 'def_geometrie',
            title: 'Géométrie de base',
            subject: 'Mathématiques',
            difficulty: 'Moyen',
            duration: 20,
            description: 'Découvrez les formes géométriques et leurs propriétés',
            tags: ['géométrie', 'formes', 'périmètre', 'aire'],
            questions: [
              {
                id: 1,
                question: 'Combien de côtés a un triangle ?',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'Un triangle a toujours 3 côtés par définition.',
                hint: 'Le nom "triangle" donne un indice !',
                timeLimit: 20,
                points: 5
              },
              {
                id: 2,
                question: 'Quelle est la formule de l\'aire d\'un rectangle ?',
                options: ['longueur + largeur', 'longueur × largeur', '2 × (longueur + largeur)', 'longueur ÷ largeur'],
                correct: 1,
                explanation: 'L\'aire d\'un rectangle = longueur × largeur. Le périmètre serait 2 × (longueur + largeur).',
                hint: 'L\'aire représente la surface couverte.',
                timeLimit: 45,
                points: 10
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
                id: 1,
                question: 'Comment conjugue-t-on le verbe "être" à la 1ère personne du singulier ?',
                options: ['je sers', 'je suis', 'j\'ai', 'je fais'],
                correct: 1,
                explanation: 'Le verbe "être" à la 1ère personne du singulier se conjugue "je suis".',
                hint: 'C\'est un verbe auxiliaire très irrégulier.',
                timeLimit: 30,
                points: 10
              }
            ]
          }
        }
      },
      'Physique-Chimie': {
        icon: 'flask-outline',
        color: '#E91E63',
        description: 'Explorez les mystères de la physique et de la chimie',
        quizzes: {
          'États_de_la_matière': {
            id: 'def_etats_matiere',
            title: 'États de la matière',
            subject: 'Physique-Chimie',
            difficulty: 'Facile',
            duration: 12,
            description: 'Découvrez les différents états de la matière et leurs propriétés',
            tags: ['états', 'matière', 'solide', 'liquide', 'gaz'],
            objectives: [
              'Identifier les trois états principaux de la matière',
              'Comprendre les changements d\'état',
              'Connaître les propriétés de chaque état'
            ],
            tips: [
              'Pensez aux exemples du quotidien',
              'Considérez les changements d\'état',
              'Rappelez-vous des propriétés de chaque état'
            ],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quels sont les trois états principaux de la matière ?',
                options: ['Solide, Liquide, Gaz', 'Chaud, Froid, Tiède', 'Dur, Mou, Flexible', 'Grand, Moyen, Petit'],
                correct: 0,
                explanation: 'Les trois états principaux de la matière sont : solide (forme et volume définis), liquide (volume défini, forme variable) et gazeux (forme et volume variables).',
                hint: 'Pensez à l\'eau sous ses différentes formes.',
                timeLimit: 30,
                points: 10,
                difficulty: 'facile'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Que se passe-t-il quand on chauffe un solide ?',
                options: ['Il devient plus dur', 'Il peut fondre', 'Il devient plus froid', 'Rien ne se passe'],
                correct: 1,
                explanation: 'Quand on chauffe un solide, ses particules bougent plus vite. À la température de fusion, il devient liquide.',
                hint: 'Que se passe-t-il avec un glaçon au soleil ?',
                timeLimit: 30,
                points: 10,
                difficulty: 'facile'
              },
              {
                id: 3,
                type: 'multiple_choice',
                question: 'À quelle température l\'eau bout-elle ?',
                options: ['0°C', '50°C', '100°C', '200°C'],
                correct: 2,
                explanation: 'L\'eau bout à 100°C au niveau de la mer. C\'est le point d\'ébullition où elle passe de l\'état liquide à l\'état gazeux.',
                hint: 'C\'est la température de l\'eau bouillante dans une casserole.',
                timeLimit: 20,
                points: 10,
                difficulty: 'facile'
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
            prerequisites: ['Dérivées', 'Limites'],
            objectives: [
              'Calculer des intégrales simples',
              'Appliquer les techniques d\'intégration',
              'Résoudre des problèmes concrets'
            ],
            questions: [
              {
                id: 1,
                question: 'Quelle est la primitive de f(x) = 2x ?',
                options: ['x²', 'x² + C', '2', '2x + C'],
                correct: 1,
                explanation: 'La primitive de 2x est x² + C, où C est une constante d\'intégration.',
                hint: 'Rappelez-vous que la primitive de x^n est x^(n+1)/(n+1).',
                timeLimit: 60,
                points: 15
              }
            ]
          }
        }
      }
    }
  }
};

// Quiz management utilities
export class QuizManager {
  constructor(level = 'DEF') {
    this.level = level;
    this.data = ENHANCED_QUIZ_DATA[level] || ENHANCED_QUIZ_DATA.DEF;
  }

  // Get all subjects for current level
  getSubjects() {
    return Object.keys(this.data.subjects);
  }

  // Get subject data
  getSubject(subjectName) {
    return this.data.subjects[subjectName];
  }

  // Get all quizzes for a subject
  getQuizzesForSubject(subjectName) {
    const subject = this.getSubject(subjectName);
    return subject ? subject.quizzes : {};
  }

  // Get specific quiz
  getQuiz(subjectName, quizName) {
    const quizzes = this.getQuizzesForSubject(subjectName);
    return quizzes[quizName];
  }

  // Get quiz by ID
  getQuizById(quizId) {
    for (const subject of Object.values(this.data.subjects)) {
      for (const quiz of Object.values(subject.quizzes)) {
        if (quiz.id === quizId) {
          return quiz;
        }
      }
    }
    return null;
  }

  // Get recommended quizzes based on user progress
  getRecommendedQuizzes(userProgress = {}) {
    const recommended = [];
    
    for (const [subjectName, subject] of Object.entries(this.data.subjects)) {
      for (const [quizName, quiz] of Object.entries(subject.quizzes)) {
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
  }

  // Get quiz statistics
  getQuizStats(userProgress = {}) {
    let totalQuizzes = 0;
    let completedQuizzes = 0;
    let totalScore = 0;
    let totalAttempts = 0;

    for (const subject of Object.values(this.data.subjects)) {
      for (const quiz of Object.values(subject.quizzes)) {
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
      completionRate: Math.round((completedQuizzes / totalQuizzes) * 100),
      totalAttempts
    };
  }

  // Prepare quiz for taking (shuffle questions and options)
  prepareQuizForTaking(quiz, shuffle = true) {
    if (!quiz) return null;

    let questions = [...quiz.questions];
    
    if (shuffle) {
      questions = shuffleArray(questions);
      
      // Shuffle options while preserving correct answer
      questions = questions.map(question => {
        const shuffledOptions = shuffleArray([...question.options]);
        const correctText = question.options[question.correct];
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
        
        return {
          ...question,
          options: shuffledOptions,
          correct: newCorrectIndex
        };
      });
    }

    return {
      ...quiz,
      questions
    };
  }

  // Calculate quiz results
  calculateResults(quiz, answers, startTime, endTime) {
    if (!quiz || !answers) return null;

    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct;
      const points = question.points || 10;
      
      totalPoints += points;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += points;
      }
      
      return {
        questionId: question.id,
        isCorrect,
        userAnswer,
        correctAnswer: question.correct,
        points: isCorrect ? points : 0
      };
    });

    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = endTime - startTime;
    const averageTimePerQuestion = Math.round(timeSpent / totalQuestions / 1000); // in seconds

    // Performance rating
    let rating = 'poor';
    if (percentage >= 90) rating = 'excellent';
    else if (percentage >= 80) rating = 'good';
    else if (percentage >= 60) rating = 'average';

    return {
      score: percentage,
      correctAnswers,
      totalQuestions,
      points: earnedPoints,
      totalPoints,
      timeSpent,
      averageTimePerQuestion,
      rating,
      questionResults,
      completedAt: new Date().toISOString()
    };
  }

  // Get quiz difficulty distribution
  getDifficultyDistribution() {
    const distribution = { Facile: 0, Moyen: 0, Difficile: 0 };
    
    for (const subject of Object.values(this.data.subjects)) {
      for (const quiz of Object.values(subject.quizzes)) {
        distribution[quiz.difficulty] = (distribution[quiz.difficulty] || 0) + 1;
      }
    }
    
    return distribution;
  }

  // Search quizzes
  searchQuizzes(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    for (const [subjectName, subject] of Object.entries(this.data.subjects)) {
      for (const quiz of Object.values(subject.quizzes)) {
        const searchableText = [
          quiz.title,
          quiz.subject,
          quiz.description,
          ...(quiz.tags || [])
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(searchTerm)) {
          results.push({
            ...quiz,
            subjectName
          });
        }
      }
    }
    
    return results;
  }
}

// User progress management
export class UserProgressManager {
  constructor() {
    this.storageKey = 'quiz_progress';
  }

  // Get user progress from storage
  async getUserProgress() {
    try {
      // In a real app, this would use AsyncStorage
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading user progress:', error);
      return {};
    }
  }

  // Save user progress
  async saveUserProgress(progress) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  // Update progress for a specific quiz
  async updateQuizProgress(quizId, results) {
    const progress = await this.getUserProgress();
    
    if (!progress[quizId]) {
      progress[quizId] = {
        attempts: 0,
        bestScore: 0,
        totalPoints: 0,
        averageTime: 0,
        history: []
      };
    }

    const quizProgress = progress[quizId];
    quizProgress.attempts++;
    quizProgress.bestScore = Math.max(quizProgress.bestScore, results.score);
    quizProgress.totalPoints += results.points;
    quizProgress.averageTime = Math.round(
      (quizProgress.averageTime * (quizProgress.attempts - 1) + results.averageTimePerQuestion) / quizProgress.attempts
    );
    
    quizProgress.history.push({
      score: results.score,
      points: results.points,
      timeSpent: results.timeSpent,
      completedAt: results.completedAt,
      rating: results.rating
    });

    // Keep only last 10 attempts
    if (quizProgress.history.length > 10) {
      quizProgress.history = quizProgress.history.slice(-10);
    }

    await this.saveUserProgress(progress);
    return quizProgress;
  }

  // Get progress for specific quiz
  async getQuizProgress(quizId) {
    const progress = await this.getUserProgress();
    return progress[quizId] || null;
  }

  // Get overall statistics
  async getOverallStats() {
    const progress = await this.getUserProgress();
    const quizIds = Object.keys(progress);
    
    if (quizIds.length === 0) {
      return {
        totalQuizzesTaken: 0,
        totalAttempts: 0,
        averageScore: 0,
        totalPoints: 0,
        totalTimeSpent: 0,
        streak: 0
      };
    }

    let totalAttempts = 0;
    let totalScoreSum = 0;
    let totalPoints = 0;
    let totalTimeSpent = 0;
    
    for (const quizProgress of Object.values(progress)) {
      totalAttempts += quizProgress.attempts;
      totalScoreSum += quizProgress.bestScore;
      totalPoints += quizProgress.totalPoints;
      
      for (const attempt of quizProgress.history) {
        totalTimeSpent += attempt.timeSpent;
      }
    }

    return {
      totalQuizzesTaken: quizIds.length,
      totalAttempts,
      averageScore: Math.round(totalScoreSum / quizIds.length),
      totalPoints,
      totalTimeSpent,
      streak: this.calculateStreak(progress)
    };
  }

  // Calculate current streak
  calculateStreak(progress) {
    // Simple streak calculation - consecutive days with quiz activity
    // In a real app, this would be more sophisticated
    return 5; // Placeholder
  }
}

// Export default instances
export const quizManager = new QuizManager();
export const progressManager = new UserProgressManager();

// Helper functions for React components
export const useQuizData = (level) => {
  return new QuizManager(level);
};

export const getQuizByTitle = (level, title) => {
  const manager = new QuizManager(level);
  const cleanTitle = title.replace(/[_\s]/g, ' ');
  
  for (const subject of Object.values(manager.data.subjects)) {
    for (const quiz of Object.values(subject.quizzes)) {
      if (quiz.title === cleanTitle || quiz.id === title) {
        return quiz;
      }
    }
  }
  return null;
};