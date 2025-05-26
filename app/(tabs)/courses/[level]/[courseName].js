// app/(tabs)/courses/[level]/[courseName].js - COMPLETE CODE
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

export default function CourseDetailScreen() {
  const { level, courseName } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('notes');

  // COURSE DATA - All content inline
  const getCourseContent = (level, courseName) => {
    const COURSE_DATA = {
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
            },
            {
              id: 2,
              title: 'Analyse littéraire',
              duration: '42:15',
              chapter: 'Chapitre 2',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '15:30'
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
              title: 'Statistiques et probabilités',
              chapter: 'Chapitre 3',
              pages: 25,
              downloadUrl: '#',
              lastUpdated: '2024-02-05',
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
            },
            {
              id: 2,
              title: 'Applications du théorème de Pythagore',
              duration: '28:30',
              chapter: 'Chapitre 2',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '10:15'
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
            },
            {
              id: 2,
              title: 'Forces et mouvements',
              chapter: 'Chapitre 2',
              pages: 18,
              downloadUrl: '#',
              lastUpdated: '2024-02-02',
              isDownloaded: true
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
        },
        'Histoire-Géographie': {
          notes: [
            {
              id: 1,
              title: 'La Renaissance européenne',
              chapter: 'Chapitre 1',
              pages: 14,
              downloadUrl: '#',
              lastUpdated: '2024-01-12',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Les grandes découvertes',
              duration: '32:15',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '32:15'
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
              averageScore: 16.2
            }
          ]
        },
        'Sciences de la Vie et de la Terre': {
          notes: [
            {
              id: 1,
              title: 'Les écosystèmes',
              chapter: 'Chapitre 1',
              pages: 16,
              downloadUrl: '#',
              lastUpdated: '2024-01-20',
              isDownloaded: false
            }
          ],
          videos: [
            {
              id: 1,
              title: 'La biodiversité',
              duration: '28:45',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '8:20'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Examen DEF SVT 2023',
              year: '2023',
              session: 'Principale',
              duration: '2h',
              pages: 5,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Facile',
              averageScore: 15.9
            }
          ]
        },
        'Anglais': {
          notes: [
            {
              id: 1,
              title: 'Grammar - Present Tenses',
              chapter: 'Chapter 1',
              pages: 10,
              downloadUrl: '#',
              lastUpdated: '2024-01-16',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'English Conversation Basics',
              duration: '22:30',
              chapter: 'Chapter 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '22:30'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Examen DEF Anglais 2023',
              year: '2023',
              session: 'Principale',
              duration: '1h30',
              pages: 4,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Moyen',
              averageScore: 14.5
            }
          ]
        },
        'Éducation Civique et Morale': {
          notes: [
            {
              id: 1,
              title: 'Droits et devoirs du citoyen',
              chapter: 'Chapitre 1',
              pages: 8,
              downloadUrl: '#',
              lastUpdated: '2024-01-22',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'La démocratie tunisienne',
              duration: '18:15',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '5:45'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Examen DEF Éducation Civique 2023',
              year: '2023',
              session: 'Principale',
              duration: '1h',
              pages: 3,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Facile',
              averageScore: 17.3
            }
          ]
        }
      },
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
              lastUpdated: '2024-02-10',
              isDownloaded: true
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
            },
            {
              id: 2,
              title: 'Techniques de dérivation',
              duration: '48:20',
              chapter: 'Chapitre 2',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '20:15'
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
              averageScore: 10.8
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
              title: 'Dynamique des systèmes',
              chapter: 'Chapitre 2',
              pages: 35,
              downloadUrl: '#',
              lastUpdated: '2024-02-01',
              isDownloaded: false
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
        },
        'Chimie': {
          notes: [
            {
              id: 1,
              title: 'Chimie organique - Hydrocarbures',
              chapter: 'Chapitre 1',
              pages: 28,
              downloadUrl: '#',
              lastUpdated: '2024-01-18',
              isDownloaded: false
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Réactions organiques',
              duration: '52:40',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '12:30'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Chimie TSE 2023',
              year: '2023',
              session: 'Principale',
              duration: '3h',
              pages: 6,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Difficile',
              averageScore: 13.1
            }
          ]
        },
        'Bio/Geo': {
          notes: [
            {
              id: 1,
              title: 'Biologie cellulaire',
              chapter: 'Chapitre 1',
              pages: 24,
              downloadUrl: '#',
              lastUpdated: '2024-01-20',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'La cellule et ses organites',
              duration: '38:25',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '38:25'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Bio/Geo TSE 2023',
              year: '2023',
              session: 'Principale',
              duration: '3h',
              pages: 7,
              downloadUrl: '#',
              hasCorrection: false,
              difficulty: 'Moyen',
              averageScore: 14.7
            }
          ]
        },
        'Français': {
          notes: [
            {
              id: 1,
              title: 'Littérature moderne',
              chapter: 'Chapitre 1',
              pages: 26,
              downloadUrl: '#',
              lastUpdated: '2024-01-14',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Analyse de texte littéraire',
              duration: '41:10',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '18:30'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Français TSE 2023',
              year: '2023',
              session: 'Principale',
              duration: '4h',
              pages: 3,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Moyen',
              averageScore: 13.8
            }
          ]
        },
        'Philosophie': {
          notes: [
            {
              id: 1,
              title: 'Introduction à la philosophie',
              chapter: 'Chapitre 1',
              pages: 20,
              downloadUrl: '#',
              lastUpdated: '2024-01-25',
              isDownloaded: false
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Les grands philosophes',
              duration: '47:55',
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
              title: 'Baccalauréat Philosophie TSE 2023',
              year: '2023',
              session: 'Principale',
              duration: '4h',
              pages: 1,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Difficile',
              averageScore: 12.9
            }
          ]
        },
        'Anglais': {
          notes: [
            {
              id: 1,
              title: 'Advanced Grammar',
              chapter: 'Chapter 1',
              pages: 18,
              downloadUrl: '#',
              lastUpdated: '2024-01-30',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Academic English',
              duration: '33:45',
              chapter: 'Chapter 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '33:45'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Anglais TSE 2023',
              year: '2023',
              session: 'Principale',
              duration: '2h',
              pages: 4,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Moyen',
              averageScore: 15.4
            }
          ]
        }
      },
      TSEXP: {
        'Mathématiques': {
          notes: [
            {
              id: 1,
              title: 'Statistiques avancées',
              chapter: 'Chapitre 1',
              pages: 32,
              downloadUrl: '#',
              lastUpdated: '2024-01-12',
              isDownloaded: false
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Probabilités et statistiques',
              duration: '44:20',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '15:40'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Mathématiques TSEXP 2023',
              year: '2023',
              session: 'Principale',
              duration: '4h',
              pages: 10,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Difficile',
              averageScore: 12.1
            }
          ]
        },
        'Physique/Chimie': {
          notes: [
            {
              id: 1,
              title: 'Physique expérimentale',
              chapter: 'Chapitre 1',
              pages: 38,
              downloadUrl: '#',
              lastUpdated: '2024-01-15',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Expériences de laboratoire',
              duration: '56:30',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '56:30'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Physique/Chimie TSEXP 2023',
              year: '2023',
              session: 'Principale',
              duration: '4h',
              pages: 9,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Difficile',
              averageScore: 11.8
            }
          ]
        }
      },
      TSECO: {
        'Économie': {
          notes: [
            {
              id: 1,
              title: 'Microéconomie - Les marchés',
              chapter: 'Chapitre 1',
              pages: 30,
              downloadUrl: '#',
              lastUpdated: '2024-01-10',
              isDownloaded: true
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Théories économiques',
              duration: '48:15',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: false,
              watchTime: '22:10'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Économie TSECO 2023',
              year: '2023',
              session: 'Principale',
              duration: '4h',
              pages: 8,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Moyen',
              averageScore: 13.9
            }
          ]
        },
        'Gestion': {
          notes: [
            {
              id: 1,
              title: 'Gestion d\'entreprise',
              chapter: 'Chapitre 1',
              pages: 25,
              downloadUrl: '#',
              lastUpdated: '2024-01-18',
              isDownloaded: false
            }
          ],
          videos: [
            {
              id: 1,
              title: 'Management moderne',
              duration: '39:45',
              chapter: 'Chapitre 1',
              thumbnailUrl: 'https://via.placeholder.com/300x200',
              videoUrl: '#',
              watched: true,
              watchTime: '39:45'
            }
          ],
          pastExams: [
            {
              id: 1,
              title: 'Baccalauréat Gestion TSECO 2023',
              year: '2023',
              session: 'Principale',
              duration: '3h',
              pages: 6,
              downloadUrl: '#',
              hasCorrection: true,
              difficulty: 'Moyen',
              averageScore: 14.5
            }
          ]
        }
      }
    };

    const cleanCourseName = courseName.replace(/[_]/g, ' ');
    
    if (COURSE_DATA[level] && COURSE_DATA[level][cleanCourseName]) {
      return COURSE_DATA[level][cleanCourseName];
    }
    
    return {
      notes: [],
      videos: [],
      pastExams: []
    };
  };

  const getCourseMetadata = (level, courseName) => {
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
          description: 'Histoire du monde et géographie',
          totalLessons: 22,
          completedLessons: 16
        },
        'Sciences de la Vie et de la Terre': {
          instructor: 'M. Laurent',
          description: 'Biologie et sciences naturelles',
          totalLessons: 18,
          completedLessons: 10
        },
        'Anglais': {
          instructor: 'Mme Smith',
          description: 'Langue anglaise et communication',
          totalLessons: 16,
          completedLessons: 14
        },
        'Éducation Civique et Morale': {
          instructor: 'M. Moreau',
          description: 'Citoyenneté et valeurs',
          totalLessons: 12,
          completedLessons: 11
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
          description: 'Chimie organique et minérale avancée',
          totalLessons: 24,
          completedLessons: 15
        },
        'Bio/Geo': {
          instructor: 'Dr. Petit',
          description: 'Biologie et géologie',
          totalLessons: 20,
          completedLessons: 12
        },
        'Français': {
          instructor: 'Prof. Roux',
          description: 'Littérature et expression écrite',
          totalLessons: 18,
          completedLessons: 16
        },
        'Philosophie': {
          instructor: 'Prof. Mercier',
          description: 'Pensée critique et logique',
          totalLessons: 14,
          completedLessons: 8
        },
        'Anglais': {
          instructor: 'Mrs. Johnson',
          description: 'Communication avancée',
          totalLessons: 12,
          completedLessons: 11
        }
      },
      TSEXP: {
        'Mathématiques': {
          instructor: 'Prof. Leroy',
          description: 'Statistiques et probabilités',
          totalLessons: 28,
          completedLessons: 18
        },
        'Physique/Chimie': {
          instructor: 'Dr. Rousseau',
          description: 'Sciences expérimentales',
          totalLessons: 26,
          completedLessons: 20
        }
      },
      TSECO: {
        'Économie': {
          instructor: 'Prof. Alami',
          description: 'Microéconomie et macroéconomie',
          totalLessons: 28,
          completedLessons: 21
        },
        'Gestion': {
          instructor: 'M. Garcia',
          description: 'Management et organisation',
          totalLessons: 22,
          completedLessons: 17
        }
      }
    };
    
    return courseMap[level]?.[cleanCourseName] || {
      instructor: 'Professeur',
      description: `Cours complet de ${cleanCourseName} pour le niveau ${level}`,
      totalLessons: 24,
      completedLessons: Math.floor(Math.random() * 24)
    };
  };

  // Get course data
  const courseContent = getCourseContent(level, courseName);
  const courseMetadata = getCourseMetadata(level, courseName);
  const courseTitle = courseName.replace(/[_]/g, ' ');

  // Component functions
  const TabButton = ({ id, title, icon, isActive, onPress, count }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: isActive ? theme.primary : theme.surface,
          borderColor: isActive ? theme.primary : theme.neutralLight,
        }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={isActive ? '#fff' : theme.textSecondary} 
      />
      <Text style={[
        styles.tabText,
        { color: isActive ? '#fff' : theme.textSecondary }
      ]}>
        {title}
      </Text>
      {count > 0 && (
        <View style={[
          styles.tabBadge, 
          { backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : theme.primary + '20' }
        ]}>
          <Text style={[
            styles.tabBadgeText,
            { color: isActive ? '#fff' : theme.primary }
          ]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleDownload = (item, type) => {
    Alert.alert(
      'Télécharger',
      `Voulez-vous télécharger ${item.title} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Télécharger', 
          onPress: () => {
            console.log(`Downloading ${type}:`, item.title);
            Alert.alert('Succès', 'Téléchargement commencé');
          }
        }
      ]
    );
  };

  const handlePlayVideo = (video) => {
    Alert.alert(
      'Lire la vidéo',
      `Voulez-vous regarder "${video.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Regarder', 
          onPress: () => {
            console.log('Playing video:', video.title);
            Alert.alert('Lecture', 'Ouverture du lecteur vidéo...');
          }
        }
      ]
    );
  };

  const NoteCard = ({ note }) => (
    <TouchableOpacity 
      style={[styles.contentCard, { backgroundColor: theme.surface }]}
      onPress={() => handleDownload(note, 'note')}
    >
      <View style={styles.contentHeader}>
        <View style={[styles.contentIcon, { backgroundColor: theme.info + '20' }]}>
          <Ionicons name="document-text" size={24} color={theme.info} />
        </View>
        
        <View style={styles.contentInfo}>
          <Text style={[styles.contentTitle, { color: theme.text }]}>
            {note.title}
          </Text>
          <Text style={[styles.contentSubtitle, { color: theme.textSecondary }]}>
            {note.chapter} • {note.pages} pages
          </Text>
          <Text style={[styles.contentDate, { color: theme.textSecondary }]}>
            Mis à jour le {new Date(note.lastUpdated).toLocaleDateString('fr-FR')}
          </Text>
        </View>

        <View style={styles.contentActions}>
          {note.isDownloaded && (
            <View style={[styles.downloadBadge, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={16} color={theme.success} />
            </View>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
            onPress={() => handleDownload(note, 'note')}
          >
            <Ionicons name="download" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const VideoCard = ({ video }) => {
    const progressPercentage = video.watchTime === video.duration ? 100 : 
      (parseInt(video.watchTime.split(':')[0]) * 60 + parseInt(video.watchTime.split(':')[1])) /
      (parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1])) * 100;

    return (
      <TouchableOpacity 
        style={[styles.contentCard, { backgroundColor: theme.surface }]}
        onPress={() => handlePlayVideo(video)}
      >
        <View style={styles.videoHeader}>
          <View style={[styles.videoThumbnail, { backgroundColor: theme.neutralLight }]}>
            <Ionicons 
              name={video.watched ? "checkmark-circle" : "play-circle"} 
              size={32} 
              color={video.watched ? theme.success : theme.primary} 
            />
            <View style={[styles.videoDuration, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text style={styles.videoDurationText}>{video.duration}</Text>
            </View>
          </View>
          
          <View style={styles.videoInfo}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>
              {video.title}
            </Text>
            <Text style={[styles.contentSubtitle, { color: theme.textSecondary }]}>
              {video.chapter} • {video.duration}
            </Text>
            
            {video.watched ? (
              <View style={styles.watchedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={theme.success} />
                <Text style={[styles.watchedText, { color: theme.success }]}>
                  Regardé
                </Text>
              </View>
            ) : (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.neutralLight }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${progressPercentage}%`, 
                        backgroundColor: theme.primary 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.textSecondary }]}>
                  {video.watchTime} / {video.duration}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
            onPress={() => handlePlayVideo(video)}
          >
            <Ionicons name="play" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ExamCard = ({ exam }) => {
    const getDifficultyColor = (difficulty) => {
      switch (difficulty) {
        case 'Facile': return theme.success;
        case 'Moyen': return theme.warning;
        case 'Difficile': return theme.error;
        default: return theme.primary;
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.contentCard, { backgroundColor: theme.surface }]}
        onPress={() => handleDownload(exam, 'exam')}
      >
        <View style={styles.contentHeader}>
          <View style={[styles.contentIcon, { backgroundColor: theme.warning + '20' }]}>
            <Ionicons name="school" size={24} color={theme.warning} />
          </View>
          
          <View style={styles.contentInfo}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>
              {exam.title}
            </Text>
            <Text style={[styles.contentSubtitle, { color: theme.textSecondary }]}>
              Session {exam.session} • {exam.duration} • {exam.pages} pages
            </Text>
            
            <View style={styles.examMeta}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exam.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(exam.difficulty) }]}>
                  {exam.difficulty}
                </Text>
              </View>
              <Text style={[styles.averageScore, { color: theme.textSecondary }]}>
                Moyenne: {exam.averageScore}/20
              </Text>
            </View>
          </View>

          <View style={styles.contentActions}>
            {exam.hasCorrection && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.success + '15' }]}
                onPress={() => Alert.alert('Correction', `Voir la correction de ${exam.title}`)}
              >
                <Ionicons name="checkmark-done" size={16} color={theme.success} />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
              onPress={() => handleDownload(exam, 'exam')}
            >
              <Ionicons name="download" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = ({ title, message, icon }) => (
    <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
      <Ionicons name={icon} size={48} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Notes de cours
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                {courseContent.notes.length} documents
              </Text>
            </View>
            {courseContent.notes.length > 0 ? (
              courseContent.notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))
            ) : (
              <EmptyState 
                title="Aucune note disponible"
                message="Les notes de cours seront bientôt disponibles"
                icon="document-text-outline"
              />
            )}
          </View>
        );
      
      case 'videos':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Vidéos de cours
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                {courseContent.videos.length} vidéos
              </Text>
            </View>
            {courseContent.videos.length > 0 ? (
              courseContent.videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              <EmptyState 
                title="Aucune vidéo disponible"
                message="Les vidéos de cours seront bientôt disponibles"
                icon="play-circle-outline"
              />
            )}
          </View>
        );
      
      case 'exams':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Examens passés
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                {courseContent.pastExams.length} examens
              </Text>
            </View>
            {courseContent.pastExams.length > 0 ? (
              courseContent.pastExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))
            ) : (
              <EmptyState 
                title="Aucun examen disponible"
                message="Les examens passés seront bientôt disponibles"
                icon="school-outline"
              />
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: courseTitle,
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />

      {/* Course Header */}
      <View style={[styles.courseHeader, { backgroundColor: theme.surface }]}>
        <View style={styles.courseInfo}>
          <Text style={[styles.courseTitle, { color: theme.text }]}>
            {courseTitle}
          </Text>
          <Text style={[styles.courseLevel, { color: theme.textSecondary }]}>
            Niveau {level} • {courseMetadata.instructor}
          </Text>
          <Text style={[styles.courseDescription, { color: theme.textSecondary }]}>
            {courseMetadata.description}
          </Text>
        </View>
        
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
              Progression
            </Text>
            <Text style={[styles.progressValue, { color: theme.primary }]}>
              {courseMetadata.completedLessons}/{courseMetadata.totalLessons}
            </Text>
          </View>
          <View style={[styles.progressBarContainer, { backgroundColor: theme.neutralLight }]}>
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${(courseMetadata.completedLessons / courseMetadata.totalLessons) * 100}%`,
                  backgroundColor: theme.primary 
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabButton
            id="notes"
            title="Notes"
            icon="document-text-outline"
            isActive={activeTab === 'notes'}
            count={courseContent.notes.length}
            onPress={() => setActiveTab('notes')}
          />
          <TabButton
            id="videos"
            title="Vidéos"
            icon="play-circle-outline"
            isActive={activeTab === 'videos'}
            count={courseContent.videos.length}
            onPress={() => setActiveTab('videos')}
          />
          <TabButton
            id="exams"
            title="Examens"
            icon="school-outline"
            isActive={activeTab === 'exams'}
            count={courseContent.pastExams.length}
            onPress={() => setActiveTab('exams')}
          />
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  courseHeader: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  courseInfo: {
    marginBottom: 16,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  courseLevel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressInfo: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  contentSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  contentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contentSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  contentDate: {
    fontSize: 12,
  },
  contentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  videoInfo: {
    flex: 1,
  },
  watchedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  watchedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
  },
  examMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  averageScore: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 40,
  },
});