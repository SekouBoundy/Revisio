// utils/unifiedQuizManager.js - SINGLE SOURCE OF TRUTH FOR QUIZ SYSTEM
import { shuffleArray } from './shuffleArray';
import AsyncStorage from '@react-native-async-storage/async-storage';

// STANDARDIZED QUIZ DATA STRUCTURE
export const QUIZ_DATABASE = {
  DEF: {
    subjects: {
      'Mathématiques': {
        id: 'math_def',
        name: 'Mathématiques',
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Maîtrisez les concepts mathématiques fondamentaux',
        quizzes: {
          'Les_Fractions': {
            id: 'def_math_fractions',
            title: 'Les Fractions',
            subject: 'Mathématiques',
            difficulty: 'Facile',
            duration: 15,
            totalQuestions: 5,
            description: 'Maîtrisez les opérations avec les fractions',
            questions: [
              {
                id: 1,
                question: 'Combien fait 1/2 + 1/4 ?',
                options: ['1/6', '2/6', '3/4', '1/8'],
                correctIndex: 2,
                explanation: '1/2 = 2/4, donc 2/4 + 1/4 = 3/4. Pour additionner des fractions, il faut d\'abord les mettre au même dénominateur.',
                hint: 'Convertissez 1/2 en quarts pour avoir le même dénominateur.',
                points: 10
              },
              {
                id: 2,
                question: 'Quelle fraction est équivalente à 50% ?',
                options: ['1/4', '1/2', '3/4', '2/3'],
                correctIndex: 1,
                explanation: '50% = 50/100 = 1/2. Pour convertir un pourcentage en fraction, divisez par 100 et simplifiez.',
                hint: '50% signifie 50 sur 100, quelle fraction cela donne-t-il ?',
                points: 10
              },
              {
                id: 3,
                question: 'Simplifiez 4/8',
                options: ['1/2', '2/4', '1/4', '8/4'],
                correctIndex: 0,
                explanation: '4/8 = 1/2 car 4 et 8 ont un diviseur commun de 4. 4÷4 = 1 et 8÷4 = 2.',
                hint: 'Cherchez le plus grand diviseur commun de 4 et 8.',
                points: 10
              },
              {
                id: 4,
                question: 'Calculez 2/3 × 3/4',
                options: ['6/12', '5/7', '1/2', '6/7'],
                correctIndex: 0,
                explanation: '2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2. Pour multiplier des fractions, multipliez les numérateurs ensemble et les dénominateurs ensemble.',
                hint: 'Multipliez numérateur avec numérateur, dénominateur avec dénominateur.',
                points: 15
              },
              {
                id: 5,
                question: 'Quelle est la fraction la plus grande entre 2/3 et 3/4 ?',
                options: ['2/3', '3/4', 'Elles sont égales', 'Impossible à déterminer'],
                correctIndex: 1,
                explanation: '3/4 = 0.75 et 2/3 ≈ 0.67. Donc 3/4 > 2/3.',
                hint: 'Convertissez en décimales pour comparer.',
                points: 12
              }
            ]
          },
          'Géométrie_de_base': {
            id: 'def_math_geometrie',
            title: 'Géométrie de base',
            subject: 'Mathématiques',
            difficulty: 'Moyen',
            duration: 20,
            totalQuestions: 4,
            description: 'Découvrez les formes géométriques, périmètres et aires',
            questions: [
              {
                id: 1,
                question: 'Combien de côtés a un triangle ?',
                options: ['2', '3', '4', '5'],
                correctIndex: 1,
                explanation: 'Un triangle a toujours 3 côtés par définition.',
                hint: 'Le nom "triangle" donne un indice !',
                points: 8
              },
              {
                id: 2,
                question: 'Quelle est la formule de l\'aire d\'un rectangle ?',
                options: ['longueur + largeur', 'longueur × largeur', '2 × (longueur + largeur)', 'longueur ÷ largeur'],
                correctIndex: 1,
                explanation: 'L\'aire d\'un rectangle = longueur × largeur. Le périmètre serait 2 × (longueur + largeur).',
                hint: 'L\'aire représente la surface couverte.',
                points: 12
              },
              {
                id: 3,
                question: 'Quelle est la somme des angles dans un triangle ?',
                options: ['90°', '180°', '270°', '360°'],
                correctIndex: 1,
                explanation: 'La somme des angles dans tout triangle est toujours 180°.',
                hint: 'C\'est une propriété fondamentale des triangles.',
                points: 15
              },
              {
                id: 4,
                question: 'Un carré de côté 4 cm a une aire de :',
                options: ['8 cm²', '12 cm²', '16 cm²', '20 cm²'],
                correctIndex: 2,
                explanation: 'Aire du carré = côté × côté = 4 × 4 = 16 cm².',
                hint: 'Un carré a tous ses côtés égaux.',
                points: 12
              }
            ]
          }
        }
      },
      'Français': {
        id: 'francais_def',
        name: 'Français',
        icon: 'language-outline',
        color: '#FF9800',
        description: 'Perfectionnez votre maîtrise de la langue française',
        quizzes: {
          'Conjugaison_présent': {
            id: 'def_francais_present',
            title: 'Conjugaison au présent',
            subject: 'Français',
            difficulty: 'Moyen',
            duration: 18,
            totalQuestions: 4,
            description: 'Maîtrisez la conjugaison des verbes au présent',
            questions: [
              {
                id: 1,
                question: 'Comment conjugue-t-on le verbe "être" à la 1ère personne du singulier ?',
                options: ['je sers', 'je suis', 'j\'ai', 'je fais'],
                correctIndex: 1,
                explanation: 'Le verbe "être" à la 1ère personne du singulier se conjugue "je suis".',
                hint: 'C\'est un verbe auxiliaire très irrégulier.',
                points: 10
              },
              {
                id: 2,
                question: 'Conjuguez "finir" à la 3ème personne du pluriel :',
                options: ['ils finissent', 'ils finisent', 'ils finirent', 'ils finissaient'],
                correctIndex: 0,
                explanation: 'Les verbes du 2ème groupe prennent -issent à la 3ème personne du pluriel au présent.',
                hint: 'C\'est un verbe du 2ème groupe, pensez à l\'infixe -iss-.',
                points: 12
              },
              {
                id: 3,
                question: 'Comment conjugue-t-on "aller" à la 1ère personne du singulier ?',
                options: ['j\'alle', 'je va', 'je vais', 'j\'aller'],
                correctIndex: 2,
                explanation: 'Le verbe "aller" est irrégulier : "je vais".',
                hint: 'C\'est un verbe très irrégulier du 3ème groupe.',
                points: 12
              },
              {
                id: 4,
                question: 'Quelle est la terminaison des verbes du 1er groupe à la 2ème personne du singulier ?',
                options: ['-es', '-s', '-x', '-e'],
                correctIndex: 0,
                explanation: 'Les verbes du 1er groupe se terminent par -es à la 2ème personne du singulier (tu chantes).',
                hint: 'Pensez à "tu chantes", "tu parles"...',
                points: 10
              }
            ]
          }
        }
      },
      'Physique-Chimie': {
        id: 'physique_def',
        name: 'Physique-Chimie',
        icon: 'flask-outline',
        color: '#E91E63',
        description: 'Explorez les mystères de la physique et de la chimie',
        quizzes: {
          'États_de_la_matière': {
            id: 'def_physique_etats',
            title: 'États de la matière',
            subject: 'Physique-Chimie',
            difficulty: 'Facile',
            duration: 12,
            totalQuestions: 4,
            description: 'Découvrez les trois états de la matière et leurs transformations',
            questions: [
              {
                id: 1,
                question: 'Quels sont les trois états principaux de la matière ?',
                options: ['Solide, Liquide, Gaz', 'Chaud, Froid, Tiède', 'Dur, Mou, Flexible', 'Grand, Moyen, Petit'],
                correctIndex: 0,
                explanation: 'Les trois états principaux de la matière sont : solide (forme et volume définis), liquide (volume défini, forme variable) et gazeux (forme et volume variables).',
                hint: 'Pensez à l\'eau sous ses différentes formes.',
                points: 10
              },
              {
                id: 2,
                question: 'À quelle température l\'eau bout-elle au niveau de la mer ?',
                options: ['0°C', '50°C', '100°C', '200°C'],
                correctIndex: 2,
                explanation: 'L\'eau bout à 100°C au niveau de la mer. C\'est le point d\'ébullition standard.',
                hint: 'C\'est la température de l\'eau bouillante dans une casserole.',
                points: 10
              },
              {
                id: 3,
                question: 'Que se passe-t-il quand on chauffe un solide ?',
                options: ['Il devient plus dur', 'Il peut fondre', 'Il devient plus froid', 'Rien ne se passe'],
                correctIndex: 1,
                explanation: 'Quand on chauffe un solide, ses particules bougent plus vite. À la température de fusion, il devient liquide.',
                hint: 'Que se passe-t-il avec un glaçon au soleil ?',
                points: 12
              },
              {
                id: 4,
                question: 'À quelle température l\'eau gèle-t-elle ?',
                options: ['0°C', '10°C', '-10°C', '100°C'],
                correctIndex: 0,
                explanation: 'L\'eau gèle à 0°C au niveau de la mer. C\'est le point de congélation.',
                hint: 'C\'est la température où se forment les glaçons.',
                points: 10
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
        id: 'math_tse',
        name: 'Mathématiques',
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Analyse mathématique avancée pour le baccalauréat TSE',
        quizzes: {
          'Dérivées': {
            id: 'tse_math_derivees',
            title: 'Dérivées et applications',
            subject: 'Mathématiques',
            difficulty: 'Difficile',
            duration: 35,
            totalQuestions: 3,
            description: 'Maîtrisez le calcul différentiel et ses applications',
            questions: [
              {
                id: 1,
                question: 'Quelle est la dérivée de f(x) = x² + 3x - 1 ?',
                options: ['2x + 3', 'x² + 3', '2x - 1', 'x + 3'],
                correctIndex: 0,
                explanation: 'La dérivée de x² est 2x, la dérivée de 3x est 3, et la dérivée d\'une constante est 0.',
                hint: 'Appliquez la règle : (x^n)\' = n·x^(n-1).',
                points: 15
              },
              {
                id: 2,
                question: 'Quelle est la dérivée de f(x) = 3x³ ?',
                options: ['9x²', '3x²', 'x³', '9x³'],
                correctIndex: 0,
                explanation: 'La dérivée de 3x³ est 3 × 3x² = 9x².',
                hint: 'Utilisez la règle de dérivation des puissances.',
                points: 12
              },
              {
                id: 3,
                question: 'Si f(x) = x² + 1, que vaut f\'(2) ?',
                options: ['3', '4', '5', '6'],
                correctIndex: 1,
                explanation: 'f\'(x) = 2x, donc f\'(2) = 2 × 2 = 4.',
                hint: 'Calculez d\'abord f\'(x), puis substituez x = 2.',
                points: 18
              }
            ]
          }
        }
      }
    }
  }
};

// UNIFIED QUIZ MANAGER CLASS
export class UnifiedQuizManager {
  constructor(level = 'DEF') {
    this.level = level;
    this.data = QUIZ_DATABASE[level] || QUIZ_DATABASE.DEF;
    this.storageKey = `quiz_progress_${level}`;
  }

  // CORE DATA ACCESS
  getSubjects() {
    return Object.values(this.data.subjects || {});
  }

  getSubject(subjectId) {
    return Object.values(this.data.subjects || {}).find(s => s.id === subjectId || s.name === subjectId);
  }

  getAllQuizzes() {
    const allQuizzes = [];
    for (const subject of Object.values(this.data.subjects || {})) {
      for (const quiz of Object.values(subject.quizzes || {})) {
        allQuizzes.push({
          ...quiz,
          subjectName: subject.name,
          subjectColor: subject.color,
          subjectIcon: subject.icon
        });
      }
    }
    return allQuizzes;
  }

  getQuizById(quizId) {
    // Support multiple ID formats
    for (const subject of Object.values(this.data.subjects || {})) {
      for (const quiz of Object.values(subject.quizzes || {})) {
        if (quiz.id === quizId || quiz.title === quizId || quiz.title.replace(/\s+/g, '_') === quizId) {
          return quiz;
        }
      }
    }
    return null;
  }

  searchQuizzes(query, filters = {}) {
    const allQuizzes = this.getAllQuizzes();
    let results = allQuizzes;

    // Text search
    if (query?.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(quiz => {
        const searchableText = [
          quiz.title,
          quiz.description,
          quiz.subject,
          quiz.difficulty
        ].join(' ').toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }

    // Filters
    if (filters.difficulty) {
      results = results.filter(quiz => quiz.difficulty === filters.difficulty);
    }
    if (filters.subject) {
      results = results.filter(quiz => quiz.subject === filters.subject);
    }

    return results;
  }

  // PROGRESS MANAGEMENT
  async getUserProgress() {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  }

  async saveUserProgress(progress) {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      return false;
    }
  }

  async updateQuizResult(quizId, result) {
    const progress = await this.getUserProgress();
    
    if (!progress[quizId]) {
      progress[quizId] = {
        attempts: 0,
        bestScore: 0,
        history: [],
        isCompleted: false
      };
    }

    const quizProgress = progress[quizId];
    quizProgress.attempts++;
    quizProgress.bestScore = Math.max(quizProgress.bestScore, result.score);
    quizProgress.isCompleted = result.score >= 70;

    // Add to history (keep last 5)
    quizProgress.history.push({
      score: result.score,
      date: new Date().toISOString(),
      timeSpent: result.timeSpent,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions
    });

    if (quizProgress.history.length > 5) {
      quizProgress.history = quizProgress.history.slice(-5);
    }

    await this.saveUserProgress(progress);
    return quizProgress;
  }

  // QUIZ PREPARATION
  prepareQuiz(quizId, options = {}) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return null;

    const { shuffle = true } = options;
    let questions = [...quiz.questions];
    
    if (shuffle) {
      questions = shuffleArray(questions);
      
      // Shuffle options while preserving correct answer
      questions = questions.map(question => {
        const shuffledOptions = shuffleArray([...question.options]);
        const correctText = question.options[question.correctIndex];
        const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
        
        return {
          ...question,
          options: shuffledOptions,
          correctIndex: newCorrectIndex
        };
      });
    }

    return {
      ...quiz,
      questions,
      shuffled: shuffle
    };
  }

  // QUIZ RESULTS CALCULATION
  calculateResults(quiz, answers, startTime, endTime) {
    if (!quiz?.questions || !answers) return null;

    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctIndex;
      const points = question.points || 10;
      
      totalPoints += points;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += points;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = endTime - startTime;

    return {
      quizId: quiz.id,
      score,
      correctAnswers,
      totalQuestions,
      earnedPoints,
      totalPoints,
      timeSpent,
      passed: score >= 70,
      completedAt: new Date().toISOString()
    };
  }

  // STATISTICS
  async getStats() {
    const progress = await this.getUserProgress();
    const allQuizzes = this.getAllQuizzes();
    
    let totalQuizzes = allQuizzes.length;
    let completedQuizzes = 0;
    let totalScore = 0;
    let totalAttempts = 0;

    for (const quiz of allQuizzes) {
      const quizProgress = progress[quiz.id];
      if (quizProgress && quizProgress.attempts > 0) {
        completedQuizzes++;
        totalScore += quizProgress.bestScore;
        totalAttempts += quizProgress.attempts;
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

  // RECOMMENDATIONS
  async getRecommendations(limit = 3) {
    const progress = await this.getUserProgress();
    const allQuizzes = this.getAllQuizzes();
    const recommendations = [];

    for (const quiz of allQuizzes) {
      const quizProgress = progress[quiz.id];
      let score = 0;
      let reason = '';

      if (!quizProgress || quizProgress.attempts === 0) {
        score = 10;
        reason = 'Nouveau quiz à découvrir';
      } else if (quizProgress.bestScore < 70) {
        score = 8;
        reason = 'Améliorez votre score';
      } else if (quizProgress.bestScore < 85) {
        score = 6;
        reason = 'Visez l\'excellence';
      }

      if (score > 0) {
        recommendations.push({
          ...quiz,
          recommendationScore: score,
          reason
        });
      }
    }

    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }
}

// Export default instance
export const quizManager = new UnifiedQuizManager();

// Helper function
export const getQuizManager = (level) => new UnifiedQuizManager(level);