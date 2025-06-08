// utils/enhancedQuizManager.js - MVP ENHANCED QUIZ SYSTEM
import { shuffleArray } from './shuffleArray';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced quiz data structure with comprehensive content
export const ENHANCED_QUIZ_DATABASE = {
  DEF: {
    subjects: {
      'Mathématiques': {
        id: 'math_def',
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Maîtrisez les concepts mathématiques fondamentaux pour le DEF',
        totalQuizzes: 8,
        estimatedHours: 12,
        categories: ['Arithmétique', 'Géométrie', 'Algèbre', 'Statistiques'],
        quizzes: {
          'Les_Fractions': {
            id: 'def_math_fractions',
            title: 'Les Fractions',
            category: 'Arithmétique',
            difficulty: 'Facile',
            duration: 15,
            totalQuestions: 12,
            description: 'Maîtrisez les opérations avec les fractions - addition, soustraction, multiplication et division',
            learningObjectives: [
              'Comprendre le concept de fraction',
              'Additionner et soustraire des fractions',
              'Multiplier et diviser des fractions',
              'Simplifier des fractions complexes',
              'Convertir entre fractions et pourcentages'
            ],
            prerequisites: ['Arithmétique de base', 'Multiplication', 'Division'],
            tags: ['arithmétique', 'fractions', 'calcul', 'pourcentages'],
            estimatedTime: 15,
            passingScore: 70,
            maxAttempts: 5,
            hintsAvailable: true,
            explanationsDetailed: true,
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Combien fait 1/2 + 1/4 ?',
                options: ['1/6', '2/6', '3/4', '1/8'],
                correctIndex: 2,
                explanation: '1/2 = 2/4, donc 2/4 + 1/4 = 3/4. Pour additionner des fractions, il faut d\'abord les mettre au même dénominateur.',
                hint: 'Convertissez 1/2 en quarts pour avoir le même dénominateur.',
                difficulty: 'facile',
                timeLimit: 45,
                points: 10,
                topic: 'Addition de fractions',
                workingSteps: [
                  '1/2 = 2/4 (même dénominateur)',
                  '2/4 + 1/4 = 3/4',
                  'Résultat: 3/4'
                ]
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Quelle fraction est équivalente à 50% ?',
                options: ['1/4', '1/2', '3/4', '2/3'],
                correctIndex: 1,
                explanation: '50% = 50/100 = 1/2. Pour convertir un pourcentage en fraction, divisez par 100 et simplifiez.',
                hint: '50% signifie 50 sur 100, quelle fraction cela donne-t-il ?',
                difficulty: 'facile',
                timeLimit: 30,
                points: 10,
                topic: 'Conversion pourcentage-fraction',
                workingSteps: [
                  '50% = 50/100',
                  'Simplifier: 50/100 = 1/2',
                  'Résultat: 1/2'
                ]
              },
              {
                id: 3,
                type: 'multiple_choice',
                question: 'Simplifiez 4/8',
                options: ['1/2', '2/4', '1/4', '8/4'],
                correctIndex: 0,
                explanation: '4/8 = 1/2 car 4 et 8 ont un diviseur commun de 4. 4÷4 = 1 et 8÷4 = 2.',
                hint: 'Cherchez le plus grand diviseur commun de 4 et 8.',
                difficulty: 'facile',
                timeLimit: 30,
                points: 10,
                topic: 'Simplification de fractions'
              },
              {
                id: 4,
                type: 'multiple_choice',
                question: 'Calculez 2/3 × 3/4',
                options: ['6/12', '5/7', '1/2', '6/7'],
                correctIndex: 0,
                explanation: '2/3 × 3/4 = (2×3)/(3×4) = 6/12 = 1/2. Pour multiplier des fractions, multipliez les numérateurs ensemble et les dénominateurs ensemble.',
                hint: 'Multipliez numérateur avec numérateur, dénominateur avec dénominateur.',
                difficulty: 'moyen',
                timeLimit: 60,
                points: 15,
                topic: 'Multiplication de fractions'
              },
              {
                id: 5,
                type: 'true_false',
                question: '3/4 est plus grand que 2/3',
                options: ['Vrai', 'Faux'],
                correctIndex: 0,
                explanation: '3/4 = 0.75 et 2/3 ≈ 0.67. Donc 3/4 > 2/3.',
                hint: 'Convertissez en décimales pour comparer.',
                difficulty: 'moyen',
                timeLimit: 45,
                points: 12,
                topic: 'Comparaison de fractions'
              },
              {
                id: 6,
                type: 'multiple_choice',
                question: 'Quelle est la fraction irréductible de 12/16 ?',
                options: ['3/4', '6/8', '2/3', '12/16'],
                correctIndex: 0,
                explanation: '12/16 = 3/4 (en divisant par 4). Une fraction irréductible ne peut plus être simplifiée.',
                hint: 'Trouvez le PGCD de 12 et 16.',
                difficulty: 'moyen',
                timeLimit: 40,
                points: 12,
                topic: 'Fractions irréductibles'
              }
            ]
          },
          'Géométrie_de_base': {
            id: 'def_math_geometrie',
            title: 'Géométrie de base',
            category: 'Géométrie',
            difficulty: 'Moyen',
            duration: 20,
            totalQuestions: 10,
            description: 'Découvrez les formes géométriques, périmètres et aires',
            learningObjectives: [
              'Identifier les formes géométriques de base',
              'Calculer le périmètre des figures simples',
              'Calculer l\'aire des rectangles et carrés',
              'Comprendre les propriétés des triangles'
            ],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Combien de côtés a un triangle ?',
                options: ['2', '3', '4', '5'],
                correctIndex: 1,
                explanation: 'Un triangle a toujours 3 côtés par définition.',
                hint: 'Le nom "triangle" donne un indice !',
                difficulty: 'facile',
                timeLimit: 20,
                points: 8,
                topic: 'Propriétés des triangles'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Quelle est la formule de l\'aire d\'un rectangle ?',
                options: ['longueur + largeur', 'longueur × largeur', '2 × (longueur + largeur)', 'longueur ÷ largeur'],
                correctIndex: 1,
                explanation: 'L\'aire d\'un rectangle = longueur × largeur. Le périmètre serait 2 × (longueur + largeur).',
                hint: 'L\'aire représente la surface couverte.',
                difficulty: 'moyen',
                timeLimit: 45,
                points: 12,
                topic: 'Aires et périmètres'
              }
            ]
          },
          'Pourcentages': {
            id: 'def_math_pourcentages',
            title: 'Pourcentages',
            category: 'Arithmétique',
            difficulty: 'Moyen',
            duration: 18,
            totalQuestions: 8,
            description: 'Maîtrisez les calculs de pourcentages dans la vie quotidienne',
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Combien fait 25% de 80 ?',
                options: ['15', '20', '25', '30'],
                correctIndex: 1,
                explanation: '25% de 80 = 25/100 × 80 = 0.25 × 80 = 20',
                hint: '25% = 1/4, donc cherchez le quart de 80.',
                difficulty: 'facile',
                timeLimit: 30,
                points: 10,
                topic: 'Calcul de pourcentages'
              }
            ]
          }
        }
      },
      'Français': {
        id: 'francais_def',
        icon: 'language-outline',
        color: '#FF9800',
        description: 'Perfectionnez votre maîtrise de la langue française',
        totalQuizzes: 6,
        estimatedHours: 10,
        categories: ['Grammaire', 'Conjugaison', 'Orthographe', 'Vocabulaire'],
        quizzes: {
          'Conjugaison_présent': {
            id: 'def_francais_present',
            title: 'Conjugaison au présent',
            category: 'Conjugaison',
            difficulty: 'Moyen',
            duration: 18,
            totalQuestions: 15,
            description: 'Maîtrisez la conjugaison des verbes du 1er, 2ème et 3ème groupe au présent',
            learningObjectives: [
              'Conjuguer les verbes du 1er groupe',
              'Conjuguer les verbes du 2ème groupe',
              'Maîtriser les verbes irréguliers du 3ème groupe',
              'Identifier le groupe d\'un verbe'
            ],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Comment conjugue-t-on le verbe "être" à la 1ère personne du singulier ?',
                options: ['je sers', 'je suis', 'j\'ai', 'je fais'],
                correctIndex: 1,
                explanation: 'Le verbe "être" à la 1ère personne du singulier se conjugue "je suis".',
                hint: 'C\'est un verbe auxiliaire très irrégulier.',
                difficulty: 'facile',
                timeLimit: 30,
                points: 10,
                topic: 'Verbes auxiliaires'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'Conjuguez "finir" à la 3ème personne du pluriel :',
                options: ['ils finissent', 'ils finisent', 'ils finirent', 'ils finissaient'],
                correctIndex: 0,
                explanation: 'Les verbes du 2ème groupe prennent -issent à la 3ème personne du pluriel au présent.',
                hint: 'C\'est un verbe du 2ème groupe, pensez à l\'infixe -iss-.',
                difficulty: 'moyen',
                timeLimit: 35,
                points: 12,
                topic: 'Verbes du 2ème groupe'
              }
            ]
          },
          'Orthographe_courante': {
            id: 'def_francais_orthographe',
            title: 'Orthographe courante',
            category: 'Orthographe',
            difficulty: 'Moyen',
            duration: 15,
            totalQuestions: 12,
            description: 'Évitez les fautes d\'orthographe les plus communes',
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quelle est la bonne orthographe ?',
                options: ['language', 'langage', 'langague', 'languaje'],
                correctIndex: 1,
                explanation: 'Le mot correct est "langage" avec un seul "u".',
                hint: 'Attention au piège du double "u".',
                difficulty: 'facile',
                timeLimit: 25,
                points: 8,
                topic: 'Mots courants'
              }
            ]
          }
        }
      },
      'Physique-Chimie': {
        id: 'physique_def',
        icon: 'flask-outline',
        color: '#E91E63',
        description: 'Explorez les mystères de la physique et de la chimie',
        totalQuizzes: 5,
        estimatedHours: 8,
        categories: ['États de la matière', 'Forces', 'Énergie'],
        quizzes: {
          'États_de_la_matière': {
            id: 'def_physique_etats',
            title: 'États de la matière',
            category: 'États de la matière',
            difficulty: 'Facile',
            duration: 12,
            totalQuestions: 8,
            description: 'Découvrez les trois états de la matière et leurs transformations',
            learningObjectives: [
              'Identifier les trois états de la matière',
              'Comprendre les changements d\'état',
              'Connaître les températures de fusion et d\'ébullition de l\'eau'
            ],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quels sont les trois états principaux de la matière ?',
                options: ['Solide, Liquide, Gaz', 'Chaud, Froid, Tiède', 'Dur, Mou, Flexible', 'Grand, Moyen, Petit'],
                correctIndex: 0,
                explanation: 'Les trois états principaux de la matière sont : solide (forme et volume définis), liquide (volume défini, forme variable) et gazeux (forme et volume variables).',
                hint: 'Pensez à l\'eau sous ses différentes formes.',
                difficulty: 'facile',
                timeLimit: 30,
                points: 10,
                topic: 'États fondamentaux'
              },
              {
                id: 2,
                type: 'multiple_choice',
                question: 'À quelle température l\'eau bout-elle au niveau de la mer ?',
                options: ['0°C', '50°C', '100°C', '200°C'],
                correctIndex: 2,
                explanation: 'L\'eau bout à 100°C au niveau de la mer. C\'est le point d\'ébullition standard.',
                hint: 'C\'est la température de l\'eau bouillante dans une casserole.',
                difficulty: 'facile',
                timeLimit: 20,
                points: 10,
                topic: 'Changements d\'état'
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
        icon: 'calculator-outline',
        color: '#2196F3',
        description: 'Analyse mathématique avancée pour le baccalauréat TSE',
        totalQuizzes: 12,
        estimatedHours: 25,
        categories: ['Analyse', 'Algèbre', 'Géométrie', 'Probabilités'],
        quizzes: {
          'Dérivées': {
            id: 'tse_math_derivees',
            title: 'Dérivées et applications',
            category: 'Analyse',
            difficulty: 'Difficile',
            duration: 35,
            totalQuestions: 15,
            description: 'Maîtrisez le calcul différentiel et ses applications',
            learningObjectives: [
              'Calculer des dérivées simples et composées',
              'Appliquer les règles de dérivation',
              'Étudier les variations d\'une fonction',
              'Résoudre des problèmes d\'optimisation'
            ],
            prerequisites: ['Fonctions', 'Limites'],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quelle est la dérivée de f(x) = x² + 3x - 1 ?',
                options: ['2x + 3', 'x² + 3', '2x - 1', 'x + 3'],
                correctIndex: 0,
                explanation: 'La dérivée de x² est 2x, la dérivée de 3x est 3, et la dérivée d\'une constante est 0.',
                hint: 'Appliquez la règle : (x^n)\' = n·x^(n-1).',
                difficulty: 'moyen',
                timeLimit: 60,
                points: 15,
                topic: 'Dérivées de polynômes'
              }
            ]
          },
          'Intégrales': {
            id: 'tse_math_integrales',
            title: 'Calcul intégral',
            category: 'Analyse',
            difficulty: 'Difficile',
            duration: 40,
            totalQuestions: 12,
            description: 'Maîtrisez les techniques d\'intégration',
            prerequisites: ['Dérivées', 'Fonctions'],
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quelle est une primitive de f(x) = 2x ?',
                options: ['x²', 'x² + C', '2', '2x + C'],
                correctIndex: 1,
                explanation: 'Une primitive de 2x est x² + C, où C est une constante d\'intégration.',
                hint: 'Rappelez-vous que l\'intégration est l\'opération inverse de la dérivation.',
                difficulty: 'moyen',
                timeLimit: 45,
                points: 12,
                topic: 'Primitives simples'
              }
            ]
          }
        }
      },
      'Physique': {
        id: 'physique_tse',
        icon: 'nuclear-outline',
        color: '#E91E63',
        description: 'Physique avancée : mécanique, thermodynamique et électricité',
        totalQuizzes: 10,
        estimatedHours: 20,
        categories: ['Mécanique', 'Thermodynamique', 'Électricité'],
        quizzes: {
          'Mécanique_newtonienne': {
            id: 'tse_physique_mecanique',
            title: 'Mécanique newtonienne',
            category: 'Mécanique',
            difficulty: 'Difficile',
            duration: 30,
            totalQuestions: 10,
            description: 'Les lois de Newton et leurs applications',
            questions: [
              {
                id: 1,
                type: 'multiple_choice',
                question: 'Quelle est la deuxième loi de Newton ?',
                options: ['F = ma', 'E = mc²', 'P = mv', 'W = Fd'],
                correctIndex: 0,
                explanation: 'La deuxième loi de Newton s\'énonce : F = ma (Force = masse × accélération).',
                hint: 'Cette loi relie force, masse et accélération.',
                difficulty: 'moyen',
                timeLimit: 40,
                points: 12,
                topic: 'Lois de Newton'
              }
            ]
          }
        }
      }
    }
  }
};

// Enhanced Quiz Management Class
export class EnhancedQuizManager {
  constructor(level = 'DEF') {
    this.level = level;
    this.data = ENHANCED_QUIZ_DATABASE[level] || ENHANCED_QUIZ_DATABASE.DEF;
    this.storageKey = `quiz_progress_${level}`;
    this.settingsKey = `quiz_settings_${level}`;
  }

  // Core Data Access Methods
  getSubjects() {
    return Object.values(this.data.subjects);
  }

  getSubject(subjectId) {
    return Object.values(this.data.subjects).find(s => s.id === subjectId) ||
           this.data.subjects[subjectId];
  }

  getQuizzesBySubject(subjectId) {
    const subject = this.getSubject(subjectId);
    return subject ? Object.values(subject.quizzes) : [];
  }

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

  getAllQuizzes() {
    const allQuizzes = [];
    for (const subject of Object.values(this.data.subjects)) {
      for (const quiz of Object.values(subject.quizzes)) {
        allQuizzes.push({
          ...quiz,
          subjectName: subject.id,
          subjectColor: subject.color,
          subjectIcon: subject.icon
        });
      }
    }
    return allQuizzes;
  }

  // Search and Filter Methods
  searchQuizzes(query, filters = {}) {
    const allQuizzes = this.getAllQuizzes();
    let results = allQuizzes;

    // Text search
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(quiz => {
        const searchableText = [
          quiz.title,
          quiz.description,
          quiz.category,
          ...(quiz.tags || [])
        ].join(' ').toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }

    // Apply filters
    if (filters.difficulty) {
      results = results.filter(quiz => quiz.difficulty === filters.difficulty);
    }
    if (filters.category) {
      results = results.filter(quiz => quiz.category === filters.category);
    }
    if (filters.duration) {
      results = results.filter(quiz => quiz.duration <= filters.duration);
    }
    if (filters.subject) {
      results = results.filter(quiz => quiz.subjectName === filters.subject);
    }

    return results;
  }

  getQuizzesByDifficulty(difficulty) {
    return this.getAllQuizzes().filter(quiz => quiz.difficulty === difficulty);
  }

  getQuizzesByCategory(category) {
    return this.getAllQuizzes().filter(quiz => quiz.category === category);
  }

  // Progress and Analytics Methods
  async getUserProgress() {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading user progress:', error);
      return {};
    }
  }

  async saveUserProgress(progress) {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Error saving user progress:', error);
      return false;
    }
  }

  async updateQuizResult(quizId, result) {
    const progress = await this.getUserProgress();
    
    if (!progress[quizId]) {
      progress[quizId] = {
        attempts: 0,
        bestScore: 0,
        totalTime: 0,
        averageScore: 0,
        lastAttemptDate: null,
        history: [],
        isCompleted: false,
        masteryLevel: 'beginner' // beginner, intermediate, advanced, expert
      };
    }

    const quizProgress = progress[quizId];
    quizProgress.attempts++;
    quizProgress.bestScore = Math.max(quizProgress.bestScore, result.score);
    quizProgress.totalTime += result.timeSpent;
    quizProgress.lastAttemptDate = new Date().toISOString();
    quizProgress.isCompleted = result.score >= (result.passingScore || 70);

    // Calculate average score
    const scores = [...(quizProgress.history.map(h => h.score) || []), result.score];
    quizProgress.averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Update mastery level
    quizProgress.masteryLevel = this.calculateMasteryLevel(quizProgress);

    // Add to history (keep last 10)
    quizProgress.history.push({
      score: result.score,
      timeSpent: result.timeSpent,
      date: new Date().toISOString(),
      questionsCorrect: result.correctAnswers,
      totalQuestions: result.totalQuestions
    });

    if (quizProgress.history.length > 10) {
      quizProgress.history = quizProgress.history.slice(-10);
    }

    await this.saveUserProgress(progress);
    return quizProgress;
  }

  calculateMasteryLevel(quizProgress) {
    const avgScore = quizProgress.averageScore;
    const attempts = quizProgress.attempts;

    if (avgScore >= 90 && attempts >= 3) return 'expert';
    if (avgScore >= 80 && attempts >= 2) return 'advanced';
    if (avgScore >= 70 && attempts >= 1) return 'intermediate';
    return 'beginner';
  }

  // Recommendation System
  async getPersonalizedRecommendations(limit = 5) {
    const progress = await this.getUserProgress();
    const allQuizzes = this.getAllQuizzes();
    const recommendations = [];

    for (const quiz of allQuizzes) {
      const quizProgress = progress[quiz.id];
      let score = 0;
      let reason = '';

      if (!quizProgress || quizProgress.attempts === 0) {
        // New quiz
        score = 10;
        reason = 'Nouveau quiz à découvrir';
      } else if (quizProgress.bestScore < 70) {
        // Needs improvement
        score = 8;
        reason = 'Améliorez votre score';
      } else if (quizProgress.bestScore < 85) {
        // Could improve
        score = 6;
        reason = 'Visez l\'excellence';
      } else if (quizProgress.masteryLevel === 'expert') {
        // Review for mastery
        score = 3;
        reason = 'Maintenir votre niveau';
      }

      // Boost score for recent subjects
      const daysSinceLastAttempt = quizProgress?.lastAttemptDate ? 
        (Date.now() - new Date(quizProgress.lastAttemptDate).getTime()) / (1000 * 60 * 60 * 24) : 999;
      
      if (daysSinceLastAttempt > 7) {
        score += 2; // Boost older quizzes
      }

      if (score > 0) {
        recommendations.push({
          ...quiz,
          recommendationScore: score,
          reason,
          priority: score >= 8 ? 'high' : score >= 6 ? 'medium' : 'low'
        });
      }
    }

    return recommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  // Statistics and Analytics
  async getDetailedStats() {
    const progress = await this.getUserProgress();
    const allQuizzes = this.getAllQuizzes();
    
    let totalQuizzes = allQuizzes.length;
    let completedQuizzes = 0;
    let totalAttempts = 0;
    let totalTimeSpent = 0;
    let totalScore = 0;
    let expertQuizzes = 0;
    let subjectStats = {};

    for (const quiz of allQuizzes) {
      const quizProgress = progress[quiz.id];
      
      // Initialize subject stats
      if (!subjectStats[quiz.subjectName]) {
        subjectStats[quiz.subjectName] = {
          totalQuizzes: 0,
          completedQuizzes: 0,
          averageScore: 0,
          totalTime: 0
        };
      }
      subjectStats[quiz.subjectName].totalQuizzes++;

      if (quizProgress) {
        totalAttempts += quizProgress.attempts;
        totalTimeSpent += quizProgress.totalTime;
        
        if (quizProgress.isCompleted) {
          completedQuizzes++;
          subjectStats[quiz.subjectName].completedQuizzes++;
          totalScore += quizProgress.bestScore;
          subjectStats[quiz.subjectName].averageScore += quizProgress.bestScore;
          subjectStats[quiz.subjectName].totalTime += quizProgress.totalTime;
        }
        
        if (quizProgress.masteryLevel === 'expert') {
          expertQuizzes++;
        }
      }
    }

    // Calculate subject averages
    for (const subject in subjectStats) {
      const stats = subjectStats[subject];
      if (stats.completedQuizzes > 0) {
        stats.averageScore = Math.round(stats.averageScore / stats.completedQuizzes);
      }
    }

    return {
      totalQuizzes,
      completedQuizzes,
      completionRate: Math.round((completedQuizzes / totalQuizzes) * 100),
      averageScore: completedQuizzes > 0 ? Math.round(totalScore / completedQuizzes) : 0,
      totalAttempts,
      totalTimeSpent,
      averageTimePerQuiz: completedQuizzes > 0 ? Math.round(totalTimeSpent / completedQuizzes) : 0,
      expertQuizzes,
      masteryRate: Math.round((expertQuizzes / totalQuizzes) * 100),
      subjectStats,
      streak: await this.calculateStreak(progress),
      lastWeekActivity: await this.getWeeklyActivity(progress)
    };
  }

  async calculateStreak(progress) {
    // Calculate consecutive days with quiz activity
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      const hasActivity = Object.values(progress).some(quizProgress => {
        return quizProgress.history?.some(attempt => {
          const attemptDate = new Date(attempt.date);
          return attemptDate.toDateString() === dateStr;
        });
      });
      
      if (hasActivity) {
        streak++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }
    
    return streak;
  }

  async getWeeklyActivity(progress) {
    const weekActivity = Array(7).fill(0);
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      let dayCount = 0;
      Object.values(progress).forEach(quizProgress => {
        if (quizProgress.history) {
          dayCount += quizProgress.history.filter(attempt => {
            const attemptDate = new Date(attempt.date);
            return attemptDate.toDateString() === dateStr;
          }).length;
        }
      });
      
      weekActivity[6 - i] = dayCount;
    }
    
    return weekActivity;
  }

  // Quiz Preparation and Management
  prepareQuizForTaking(quizId, options = {}) {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return null;

    const {
      shuffle = true,
      includeHints = true,
      includeExplanations = true,
      timeLimit = null
    } = options;

    let questions = [...quiz.questions];
    
    if (shuffle) {
      questions = shuffleArray(questions);
      
      // Shuffle options while preserving correct answer
      questions = questions.map(question => {
        if (question.type === 'multiple_choice' && question.options.length > 2) {
          const shuffledOptions = shuffleArray([...question.options]);
          const correctText = question.options[question.correctIndex];
          const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
          
          return {
            ...question,
            options: shuffledOptions,
            correctIndex: newCorrectIndex
          };
        }
        return question;
      });
    }

    // Apply options
    questions = questions.map(q => ({
      ...q,
      hint: includeHints ? q.hint : null,
      explanation: includeExplanations ? q.explanation : null,
      timeLimit: timeLimit || q.timeLimit
    }));

    return {
      ...quiz,
      questions,
      config: {
        shuffle,
        includeHints,
        includeExplanations,
        timeLimit
      }
    };
  }

  calculateQuizResults(quiz, answers, startTime, endTime) {
    if (!quiz || !answers) return null;

    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctIndex;
      const points = question.points || 10;
      
      totalPoints += points;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += points;
      }
      
      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctIndex,
        isCorrect,
        points: isCorrect ? points : 0,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeSpent = endTime - startTime;
    const averageTimePerQuestion = Math.round(timeSpent / totalQuestions / 1000);

    // Performance analysis
    let performance = 'poor';
    if (score >= 90) performance = 'excellent';
    else if (score >= 80) performance = 'good';
    else if (score >= 70) performance = 'average';

    // Feedback generation
    const feedback = this.generateFeedback(score, correctAnswers, totalQuestions, performance);

    return {
      quizId: quiz.id,
      score,
      correctAnswers,
      totalQuestions,
      earnedPoints,
      totalPoints,
      timeSpent,
      averageTimePerQuestion,
      performance,
      questionResults,
      feedback,
      passingScore: quiz.passingScore || 70,
      passed: score >= (quiz.passingScore || 70),
      completedAt: new Date().toISOString()
    };
  }

  generateFeedback(score, correct, total, performance) {
    const percentage = Math.round((correct / total) * 100);
    
    let message = '';
    let suggestions = [];

    if (performance === 'excellent') {
      message = '🎉 Excellent travail ! Vous maîtrisez parfaitement ce sujet.';
      suggestions = [
        'Continuez à ce niveau d\'excellence',
        'Essayez des quiz plus avancés',
        'Aidez vos camarades avec vos connaissances'
      ];
    } else if (performance === 'good') {
      message = '👏 Très bon résultat ! Quelques petites améliorations et vous atteindrez l\'excellence.';
      suggestions = [
        'Révisez les questions manquées',
        'Refaites le quiz pour consolider',
        'Explorez les explications détaillées'
      ];
    } else if (performance === 'average') {
      message = '📚 C\'est un bon début ! Continuez vos efforts pour progresser.';
      suggestions = [
        'Relisez le cours avant de recommencer',
        'Utilisez les indices lors du prochain essai',
        'Prenez plus de temps pour réfléchir'
      ];
    } else {
      message = '💪 Ne vous découragez pas ! Chaque erreur est une occasion d\'apprendre.';
      suggestions = [
        'Révisez les bases du sujet',
        'Demandez de l\'aide si nécessaire',
        'Refaites le quiz après avoir étudié'
      ];
    }

    return {
      message,
      suggestions,
      nextSteps: this.getNextSteps(performance, score)
    };
  }

  getNextSteps(performance, score) {
    if (performance === 'excellent') {
      return [
        'Explorez des sujets plus avancés',
        'Tentez les quiz "Difficile"',
        'Partagez vos connaissances'
      ];
    } else if (performance === 'good') {
      return [
        'Révisez les points faibles',
        'Refaites ce quiz pour la perfection',
        'Passez au niveau suivant'
      ];
    } else {
      return [
        'Étudiez les explications',
        'Refaites le quiz demain',
        'Consultez des ressources supplémentaires'
      ];
    }
  }

  // Utility Methods
  getDifficultyDistribution() {
    const distribution = { Facile: 0, Moyen: 0, Difficile: 0 };
    const allQuizzes = this.getAllQuizzes();
    
    allQuizzes.forEach(quiz => {
      distribution[quiz.difficulty] = (distribution[quiz.difficulty] || 0) + 1;
    });
    
    return distribution;
  }

  getCategoryDistribution() {
    const distribution = {};
    const allQuizzes = this.getAllQuizzes();
    
    allQuizzes.forEach(quiz => {
      distribution[quiz.category] = (distribution[quiz.category] || 0) + 1;
    });
    
    return distribution;
  }

  async getUserSettings() {
    try {
      const stored = await AsyncStorage.getItem(this.settingsKey);
      return stored ? JSON.parse(stored) : {
        soundEnabled: true,
        hintsEnabled: true,
        explanationsEnabled: true,
        autoNextQuestion: false,
        timerVisible: true,
        vibrationEnabled: true
      };
    } catch (error) {
      console.error('Error loading user settings:', error);
      return {};
    }
  }

  async saveUserSettings(settings) {
    try {
      await AsyncStorage.setItem(this.settingsKey, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving user settings:', error);
      return false;
    }
  }
}

// Export singleton instances
export const enhancedQuizManager = new EnhancedQuizManager();

// Helper functions for React components
export const useEnhancedQuizData = (level) => {
  return new EnhancedQuizManager(level);
};

export const getQuizByTitle = (level, title) => {
  const manager = new EnhancedQuizManager(level);
  const cleanTitle = title.replace(/[_\s]/g, ' ');
  
  return manager.getAllQuizzes().find(quiz => 
    quiz.title === cleanTitle || 
    quiz.id === title ||
    quiz.title.toLowerCase() === cleanTitle.toLowerCase()
  );
};

// Performance optimization utilities
export const quizCache = {
  _cache: new Map(),
  
  get(key) {
    return this._cache.get(key);
  },
  
  set(key, value, ttl = 300000) { // 5 minutes default TTL
    this._cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  },
  
  isValid(key) {
    const item = this._cache.get(key);
    return item && item.expires > Date.now();
  },
  
  clear() {
    this._cache.clear();
  }
};

// Export enhanced quiz manager as default
export default EnhancedQuizManager;