// data/courseContentData.js - NO VIDEOS VERSION
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
        },
        {
          id: 3,
          title: 'Expression écrite',
          chapter: 'Chapitre 3',
          pages: 18,
          downloadUrl: '#',
          lastUpdated: '2024-02-01',
          isDownloaded: true
        },
        {
          id: 4,
          title: 'Analyse de texte',
          chapter: 'Chapitre 4',
          pages: 25,
          downloadUrl: '#',
          lastUpdated: '2024-02-10',
          isDownloaded: false
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
        },
        {
          id: 2,
          title: 'Examen DEF Français 2022',
          year: '2022',
          session: 'Principale',
          duration: '2h',
          pages: 5,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 14.2
        },
        {
          id: 3,
          title: 'Examen DEF Français 2021',
          year: '2021',
          session: 'Principale',
          duration: '2h',
          pages: 7,
          downloadUrl: '#',
          hasCorrection: false,
          difficulty: 'Difficile',
          averageScore: 13.9
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
        },
        {
          id: 2,
          title: 'Géométrie - Théorème de Pythagore',
          chapter: 'Chapitre 2',
          pages: 16,
          downloadUrl: '#',
          lastUpdated: '2024-01-25',
          isDownloaded: false
        },
        {
          id: 3,
          title: 'Statistiques - Moyenne et médiane',
          chapter: 'Chapitre 3',
          pages: 18,
          downloadUrl: '#',
          lastUpdated: '2024-02-05',
          isDownloaded: true
        },
        {
          id: 4,
          title: 'Probabilités - Introduction',
          chapter: 'Chapitre 4',
          pages: 14,
          downloadUrl: '#',
          lastUpdated: '2024-02-15',
          isDownloaded: false
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
        },
        {
          id: 2,
          title: 'Examen DEF Mathématiques 2022',
          year: '2022',
          session: 'Principale',
          duration: '2h30',
          pages: 7,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 14.8
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
        },
        {
          id: 2,
          title: 'Forces et mouvements',
          chapter: 'Chapitre 2',
          pages: 16,
          downloadUrl: '#',
          lastUpdated: '2024-02-02',
          isDownloaded: true
        },
        {
          id: 3,
          title: 'Réactions chimiques',
          chapter: 'Chapitre 3',
          pages: 20,
          downloadUrl: '#',
          lastUpdated: '2024-02-12',
          isDownloaded: false
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
        },
        {
          id: 2,
          title: 'Examen DEF Physique-Chimie 2022',
          year: '2022',
          session: 'Principale',
          duration: '2h',
          pages: 5,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Facile',
          averageScore: 16.2
        }
      ]
    },

    'Histoire-Géographie': {
      notes: [
        {
          id: 1,
          title: 'La Renaissance européenne',
          chapter: 'Chapitre 1',
          pages: 24,
          downloadUrl: '#',
          lastUpdated: '2024-01-14',
          isDownloaded: true
        },
        {
          id: 2,
          title: 'Géographie de l\'Europe',
          chapter: 'Chapitre 2',
          pages: 18,
          downloadUrl: '#',
          lastUpdated: '2024-01-30',
          isDownloaded: false
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Examen DEF Histoire-Géographie 2023',
          year: '2023',
          session: 'Principale',
          duration: '2h',
          pages: 4,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Facile',
          averageScore: 16.4
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
        },
        {
          id: 3,
          title: 'Intégration',
          chapter: 'Chapitre 3',
          pages: 38,
          downloadUrl: '#',
          lastUpdated: '2024-02-08',
          isDownloaded: true
        },
        {
          id: 4,
          title: 'Équations différentielles',
          chapter: 'Chapitre 4',
          pages: 28,
          downloadUrl: '#',
          lastUpdated: '2024-02-20',
          isDownloaded: false
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
        },
        {
          id: 2,
          title: 'Baccalauréat Mathématiques TSE 2022',
          year: '2022',
          session: 'Principale',
          duration: '4h',
          pages: 10,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 12.8
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
        },
        {
          id: 2,
          title: 'Dynamique - Forces',
          chapter: 'Chapitre 2',
          pages: 28,
          downloadUrl: '#',
          lastUpdated: '2024-02-01',
          isDownloaded: false
        },
        {
          id: 3,
          title: 'Électricité - Circuits',
          chapter: 'Chapitre 3',
          pages: 32,
          downloadUrl: '#',
          lastUpdated: '2024-02-15',
          isDownloaded: true
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
        },
        {
          id: 2,
          title: 'Baccalauréat Physique TSE 2022',
          year: '2022',
          session: 'Principale',
          duration: '3h',
          pages: 9,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 11.9
        }
      ]
    },

    'Chimie': {
      notes: [
        {
          id: 1,
          title: 'Chimie organique - Hydrocarbures',
          chapter: 'Chapitre 1',
          pages: 26,
          downloadUrl: '#',
          lastUpdated: '2024-01-20',
          isDownloaded: false
        },
        {
          id: 2,
          title: 'Cinétique chimique',
          chapter: 'Chapitre 2',
          pages: 22,
          downloadUrl: '#',
          lastUpdated: '2024-02-05',
          isDownloaded: true
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Chimie TSE 2023',
          year: '2023',
          session: 'Principale',
          duration: '3h',
          pages: 7,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Difficile',
          averageScore: 13.1
        }
      ]
    }
  },

  // BAC Level - TSEXP
  TSEXP: {
    'Mathématiques': {
      notes: [
        {
          id: 1,
          title: 'Statistiques et probabilités',
          chapter: 'Chapitre 1',
          pages: 28,
          downloadUrl: '#',
          lastUpdated: '2024-01-16',
          isDownloaded: true
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Mathématiques TSEXP 2023',
          year: '2023',
          session: 'Principale',
          duration: '3h',
          pages: 8,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 14.2
        }
      ]
    }
  },
  
  // BAC Level - TSECO
  TSECO: {
    'Économie': {
      notes: [
        {
          id: 1,
          title: 'Microéconomie - Offre et demande',
          chapter: 'Chapitre 1',
          pages: 32,
          downloadUrl: '#',
          lastUpdated: '2024-01-18',
          isDownloaded: true
        },
        {
          id: 2,
          title: 'Macroéconomie - PIB et croissance',
          chapter: 'Chapitre 2',
          pages: 28,
          downloadUrl: '#',
          lastUpdated: '2024-02-03',
          isDownloaded: false
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Économie TSECO 2023',
          year: '2023',
          session: 'Principale',
          duration: '3h',
          pages: 6,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 15.6
        }
      ]
    },

    'Gestion': {
      notes: [
        {
          id: 1,
          title: 'Management des organisations',
          chapter: 'Chapitre 1',
          pages: 24,
          downloadUrl: '#',
          lastUpdated: '2024-01-22',
          isDownloaded: false
        }
      ],
      pastExams: [
        {
          id: 1,
          title: 'Baccalauréat Gestion TSECO 2023',
          year: '2023',
          session: 'Principale',
          duration: '2h30',
          pages: 5,
          downloadUrl: '#',
          hasCorrection: true,
          difficulty: 'Moyen',
          averageScore: 14.8
        }
      ]
    }
  }
};

// Helper function to get course content - NO VIDEOS
export const getCourseContent = (level, courseName) => {
  const cleanCourseName = courseName.replace(/[_]/g, ' ');
  
  if (COURSE_CONTENT[level] && COURSE_CONTENT[level][cleanCourseName]) {
    return COURSE_CONTENT[level][cleanCourseName];
  }
  
  // Return default empty content if not found
  return {
    notes: [],
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
      },
      'Histoire-Géographie': {
        instructor: 'M. Bernard',
        description: 'Histoire moderne et géographie européenne',
        totalLessons: 22,
        completedLessons: 18
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
      },
      'Chimie': {
        instructor: 'Prof. Blanc',
        description: 'Chimie organique et inorganique avancée',
        totalLessons: 24,
        completedLessons: 16
      }
    },
    TSEXP: {
      'Mathématiques': {
        instructor: 'Prof. Garcia',
        description: 'Mathématiques appliquées aux sciences expérimentales',
        totalLessons: 26,
        completedLessons: 19
      }
    },
    TSECO: {
      'Économie': {
        instructor: 'Prof. Moreau',
        description: 'Économie générale et politique économique',
        totalLessons: 30,
        completedLessons: 24
      },
      'Gestion': {
        instructor: 'Mme Laurent',
        description: 'Management et sciences de gestion',
        totalLessons: 26,
        completedLessons: 20
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