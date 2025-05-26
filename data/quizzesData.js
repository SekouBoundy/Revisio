// data/quizzesData.js - Extract quiz data here
export const DEF_QUIZZES = [
  {
    id: 'def_fractions',
    icon: 'calculator-outline',
    title: 'Les Fractions',
    subject: 'Mathématiques',
    questions: 10,
    duration: 15,
    difficulty: 'Facile',
    score: 85,
    color: '#2196F3',
    level: 'DEF'
  },
  // ... rest of DEF quizzes
];

export const BAC_QUIZZES = {
  TSE: [
    {
      id: 'tse_integrales',
      icon: 'calculator-outline',
      title: 'Intégrales',
      subject: 'Mathématiques',
      questions: 20,
      duration: 45,
      difficulty: 'Difficile',
      score: 78,
      color: '#2196F3',
      level: 'TSE'
    },
    // ... rest of TSE quizzes
  ],
  // ... other specializations
};

export const getQuizzesByLevel = (level) => {
  if (level === 'DEF') {
    return DEF_QUIZZES;
  }
  return BAC_QUIZZES[level] || BAC_QUIZZES.TSE;
};
