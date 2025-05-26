// data/coursesData.js - Extract hardcoded data here
export const DEF_COURSES = [
  {
    id: 'def_francais',
    icon: 'language-outline',
    title: 'Français',
    subtitle: 'Grammaire, littérature et expression',
    progress: 65,
    color: '#FF9800',
    difficulty: 'Moyen',
    lessons: 24,
    level: 'DEF'
  },
  {
    id: 'def_math',
    icon: 'calculator-outline',
    title: 'Mathématiques',
    subtitle: 'Algèbre, géométrie et calcul',
    progress: 45,
    color: '#2196F3',
    difficulty: 'Moyen',
    lessons: 28,
    level: 'DEF'
  },
  // ... rest of DEF courses
];

export const BAC_COURSES = {
  TSE: [
    {
      id: 'tse_math',
      icon: 'calculator-outline',
      title: 'Mathématiques',
      subtitle: 'Analyse, algèbre et géométrie',
      color: '#2196F3',
      difficulty: 'Difficile',
      lessons: 32,
      progress: 68,
      level: 'TSE'
    },
    // ... rest of TSE courses
  ],
  TSEXP: [
    // ... TSEXP courses
  ],
  TSECO: [
    // ... TSECO courses
  ],
  // ... other specializations
};

export const getCoursesByLevel = (level) => {
  if (level === 'DEF') {
    return DEF_COURSES;
  }
  return BAC_COURSES[level] || BAC_COURSES.TSE;
};
