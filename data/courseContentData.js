// data/courseContentData.js - CREATE THIS FILE
export const COURSE_CONTENT = {
  // DEF Level Courses
  DEF: {
    'Français': {
      notes: [
        {
          id: 1,
          title: 'Grammaire française - Les temps',
          chapter: 'Chapitre 1',
          pages: 15,
          downloadUrl: '#',
          lastUpdated: '2024-01-15',
          isDownloaded: true
        },
        {
          id: 2,
          title: 'Littérature - Le roman',
          chapter: 'Chapitre 2',
          pages: 22,
          downloadUrl: '#',
          lastUpdated: '2024-01-20',
          isDownloaded: false
        }
      ],
      videos: [
        {
          id: 1,
          title: 'Les temps du passé',
          duration: '35:20',
          chapter: 'Chapitre 1',
          thumbnailUrl: 'https://via.placeholder.com/300x200',
          videoUrl: '#',
          watched: true,
          watchTime: '35:20'
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Examen DEF Français 2023',
          year: '2023',
          session: 'Principale',
          duration: '2h',
          pages: 6,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 15.8
        }
      ]
    },
    
    'Mathématiques': {
      notes: [
        {
          id: 1,
          title: 'Algèbre - Équations du premier degré',
          chapter: 'Chapitre 1',
          pages: 20,
          downloadUrl: '#',
          lastUpdated: '2024-01-10',
          isDownloaded: true
        }
      ],
      videos: [
        {
          id: 1,
          title: 'Résolution d\'équations',
          duration: '38:45',
          chapter: 'Chapitre 1',
          thumbnailUrl: 'https://via.placeholder.com/300x200',
          videoUrl: '#',
          watched: true,
          watchTime: '38:45'
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Examen DEF Mathématiques 2023',
          year: '2023',
          session: 'Principale',
          duration: '2h30',
          pages: 8,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 13.5
        }
      ]
    },

    'Physique-Chimie': {
      notes: [
        {
          id: 1,
          title: 'Les états de la matière',
          chapter: 'Chapitre 1',
          pages: 12,
          downloadUrl: '#',
          lastUpdated: '2024-01-18',
          isDownloaded: false
        }
      ],
      videos: [
        {
          id: 1,
          title: 'Expérience - États de la matière',
          duration: '25:40',
          chapter: 'Chapitre 1',
          thumbnailUrl: 'https://via.placeholder.com/300x200',
          videoUrl: '#',
          watched: false,
          watchTime: '0:00'
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Examen DEF Physique-Chimie 2023',
          year: '2023',
          session: 'Principale',
          duration: '2h',
          pages: 6,
          downloadUrl: '#',
          hasCorrection: false,
          difficulty: 'Moyen',
          averageScore: 14.8
        }
      ]
    }
  },

  // BAC Level - TSE
  TSE: {
    'Mathématiques': {
      notes: [
        {
          id: 1,
          title: 'Analyse - Limites et continuité',
          chapter: 'Chapitre 1',
          pages: 35,
          downloadUrl: '#',
          lastUpdated: '2024-01-12',
          isDownloaded: true
        },
        {
          id: 2,
          title: 'Dérivation et applications',
          chapter: 'Chapitre 2',
          pages: 42,
          downloadUrl: '#',
          lastUpdated: '2024-01-28',
          isDownloaded: false
        }
      ],
      videos: [
        {
          id: 1,
          title: 'Calcul de limites',
          duration: '55:30',
          chapter: 'Chapitre 1',
          thumbnailUrl: 'https://via.placeholder.com/300x200',
          videoUrl: '#',
          watched: true,
          watchTime: '55:30'
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Mathématiques TSE 2023',
          year: '2023',
          session: 'Principale',
          duration: '4h',
          pages: 12,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 11.2
        }
      ]
    },

    'Physique': {
      notes: [
        {
          id: 1,
          title: 'Mécanique - Cinématique',
          chapter: 'Chapitre 1',
          pages: 30,
          downloadUrl: '#',
          lastUpdated: '2024-01-15',
          isDownloaded: true
        }
      ],
      videos: [
        {
          id: 1,
          title: 'Mouvements rectiligne et circulaire',
          duration: '45:15',
          chapter: 'Chapitre 1',
          thumbnailUrl: 'https://via.placeholder.com/300x200',
          videoUrl: '#',
          watched: true,
          watchTime: '45:15'
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Physique TSE 2023',
          year: '2023',
          session: 'Principale',
          duration: '3h',
          pages: 8,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 12.3
        }
      ]
    }
  },

  // Add other specializations
  TSEXP: {
    'Mathématiques': {
      notes: [],
      videos: [],
      pastExams: []
    }
  },
  
  TSECO: {
    'Économie': {
      notes: [],
      videos: [],
      pastExams: []
    }
  }
};

// Helper function to get course content
export const getCourseContent = (level, courseName) => {
  const cleanCourseName = courseName.replace(/[_]/g, ' ');
  
  if (COURSE_CONTENT[level] && COURSE_CONTENT[level][cleanCourseName]) {
    return COURSE_CONTENT[level][cleanCourseName];
  }
  
  // Return default empty content if not found
  return {
    notes: [],
    videos: [],
    pastExams: []
  };
};

// Get course metadata
export const getCourseMetadata = (level, courseName) => {
  const cleanCourseName = courseName.replace(/[_]/g, ' ');
  
  const courseMap = {
    DEF: {
      'Français': {
        instructor: 'Mme Martin',
        description: 'Grammaire française, littérature et expression écrite',
        totalLessons: 24,
        completedLessons: 15
      },
      'Mathématiques': {
        instructor: 'M. Dubois',
        description: 'Algèbre, géométrie et statistiques',
        totalLessons: 28,
        completedLessons: 20
      },
      'Physique-Chimie': {
        instructor: 'Mme Durand',
        description: 'Sciences physiques et chimiques fondamentales',
        totalLessons: 20,
        completedLessons: 12
      }
    },
    TSE: {
      'Mathématiques': {
        instructor: 'Prof. Leroy',
        description: 'Analyse mathématique, géométrie et algèbre avancée',
        totalLessons: 32,
        completedLessons: 22
      },
      'Physique': {
        instructor: 'Dr. Rousseau',
        description: 'Mécanique, électricité et physique moderne',
        totalLessons: 28,
        completedLessons: 18
      }
    }
  };
  
  const defaultMetadata = {
    instructor: 'Professeur',
    description: `Cours complet de ${cleanCourseName} pour le niveau ${level}`,
    totalLessons: 24,
    completedLessons: Math.floor(Math.random() * 24)
  };
  
  return courseMap[level]?.[cleanCourseName] || defaultMetadata;
};