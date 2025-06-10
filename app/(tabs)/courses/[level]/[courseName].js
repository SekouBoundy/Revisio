// app/(tabs)/courses/[level]/[courseName].js - REMOVED VIDEOS SECTION
import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

export default function CourseDetailScreen() {
  const { level, courseName } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('notes');
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const searchAnimValue = useRef(new Animated.Value(0)).current;

  // COURSE DATA - Notes and Exams only
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
        }
      }
    };

    const cleanCourseName = courseName.replace(/[_]/g, ' ');
    
    if (COURSE_DATA[level] && COURSE_DATA[level][cleanCourseName]) {
      return COURSE_DATA[level][cleanCourseName];
    }
    
    return {
      notes: [],
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
        }
      },
      TSE: {
        'Mathématiques': {
          instructor: 'Prof. Leroy',
          description: 'Analyse mathématique, géométrie et algèbre avancée',
          totalLessons: 32,
          completedLessons: 22
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

  // Search functions
  const toggleSearch = () => {
    if (searchVisible) {
      // Hide search
      Keyboard.dismiss();
      setSearchQuery('');
      Animated.timing(searchAnimValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
      });
    } else {
      // Show search
      setSearchVisible(true);
      Animated.timing(searchAnimValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Focus input after animation
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  // Filter content based on search query
  const filterContent = (items) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.chapter?.toLowerCase().includes(query)
    );
  };

  const getFilteredContent = () => {
    if (!searchQuery.trim()) return courseContent;
    return {
      notes: filterContent(courseContent.notes),
      pastExams: filterContent(courseContent.pastExams)
    };
  };

  const filteredContent = getFilteredContent();
  const hasSearchResults = searchQuery.trim().length > 0;
  const totalResults = hasSearchResults ? 
    filteredContent.notes.length + filteredContent.pastExams.length : 0;

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

const NoteCard = ({ note }) => (
  <TouchableOpacity 
    style={[styles.contentCard, { backgroundColor: theme.surface }]}
    onPress={() => handleViewNote(note)} // View the note content
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
        {/* Separate download button */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the card's onPress
            handleDownload(note, 'note');
          }}
        >
          <Ionicons name="download" size={16} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// Fixed ExamCard - clickable for viewing, separate download button
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
      onPress={() => handleViewExam(exam)} // View the exam content
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
              onPress={(e) => {
                e.stopPropagation();
                Alert.alert('Correction', `Voir la correction de ${exam.title}`);
              }}
            >
              <Ionicons name="checkmark-done" size={16} color={theme.success} />
            </TouchableOpacity>
          )}
          {/* Separate download button */}
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
            onPress={(e) => {
              e.stopPropagation(); // Prevent triggering the card's onPress
              handleDownload(exam, 'exam');
            }}
          >
            <Ionicons name="download" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const handleViewNote = (note) => {
  if (!note.isDownloaded) {
    Alert.alert(
      'Document non téléchargé',
      'Vous devez d\'abord télécharger ce document pour le consulter.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Télécharger', 
          onPress: () => handleDownload(note, 'note')
        }
      ]
    );
    return;
  }

  // Open PDF viewer for downloaded notes
  router.push({
    pathname: '/pdf-viewer',
    params: {
      url: note.downloadUrl || `https://example.com/pdf/${note.id}.pdf`,
      title: note.title
    }
  });
};

const handleViewExam = (exam) => {
  if (!exam.isDownloaded) {
    Alert.alert(
      'Examen non téléchargé',
      'Vous devez d\'abord télécharger cet examen pour le consulter.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Télécharger', 
          onPress: () => handleDownload(exam, 'exam')
        }
      ]
    );
    return;
  }

  // Open PDF viewer for downloaded exams
  router.push({
    pathname: '/pdf-viewer',
    params: {
      url: exam.downloadUrl || `https://example.com/pdf/${exam.id}.pdf`,
      title: exam.title
    }
  });
};

const EmptyState = ({ title, message, icon }) => (
    <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
      <Ionicons name={icon} size={48} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );

  const renderContent = () => {
    const currentContent = filteredContent;
    
    switch (activeTab) {
      case 'notes':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Notes de cours
              </Text>
              <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                {currentContent.notes.length} document{currentContent.notes.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {currentContent.notes.length > 0 ? (
              currentContent.notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))
            ) : (
              <EmptyState 
                title={hasSearchResults ? "Aucun résultat" : "Aucune note disponible"}
                message={hasSearchResults ? "Essayez des mots-clés différents" : "Les notes de cours seront bientôt disponibles"}
                icon="document-text-outline"
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
                {currentContent.pastExams.length} examen{currentContent.pastExams.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {currentContent.pastExams.length > 0 ? (
              currentContent.pastExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))
            ) : (
              <EmptyState 
                title={hasSearchResults ? "Aucun résultat" : "Aucun examen disponible"}
                message={hasSearchResults ? "Essayez des mots-clés différents" : "Les examens passés seront bientôt disponibles"}
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
      {/* CUSTOM HEADER WITH BACK BUTTON AND SEARCH */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: courseTitle,
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightActions}>
              <TouchableOpacity 
                onPress={toggleSearch}
                style={[
                  styles.headerActionButton, 
                  { backgroundColor: searchVisible ? '#fff' : 'rgba(255,255,255,0.15)' }
                ]}
              >
                <Ionicons 
                  name={searchVisible ? "close" : "search"} 
                  size={20} 
                  color={searchVisible ? theme.primary : "#fff"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => Alert.alert('Options', 'Menu des options du cours')}
                style={[styles.headerActionButton, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* SEARCH BAR - Slides down */}
      {searchVisible && (
        <Animated.View 
          style={[
            styles.searchContainer, 
            { 
              backgroundColor: theme.surface,
              height: searchAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 80],
              }),
              opacity: searchAnimValue,
            }
          ]}
        >
          <View style={styles.searchContent}>
            <View style={[styles.searchInputContainer, { backgroundColor: theme.background }]}>
              <Ionicons name="search" size={20} color={theme.textSecondary} />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Rechercher dans le cours..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch}>
                  <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {hasSearchResults && (
              <Text style={[styles.searchResultsText, { color: theme.textSecondary }]}>
                {totalResults} résultat{totalResults !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </Animated.View>
      )}

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

      {/* Search Results Info */}
      {hasSearchResults && (
        <View style={[styles.searchResultsBanner, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="search" size={16} color={theme.primary} />
          <Text style={[styles.searchResultsBannerText, { color: theme.primary }]}>
            "{searchQuery}" - {totalResults} résultat{totalResults !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close" size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Tab Navigation - Only Notes and Exams */}
      <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabButton
            id="notes"
            title="Notes"
            icon="document-text-outline"
            isActive={activeTab === 'notes'}
            count={filteredContent.notes.length}
            onPress={() => setActiveTab('notes')}
          />
          <TabButton
            id="exams"
            title="Examens"
            icon="school-outline"
            isActive={activeTab === 'exams'}
            count={filteredContent.pastExams.length}
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultsText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'center',
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
  searchResultsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  searchResultsBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
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