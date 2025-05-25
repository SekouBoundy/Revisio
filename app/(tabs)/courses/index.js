// app/(tabs)/courses/index.js - Fixed curved header like schedule
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function CoursesScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const isDefLevel = user?.level === 'DEF';

  const CourseCard = ({ icon, title, subtitle, progress, color, difficulty, lessons, level, onPress }) => (
    <TouchableOpacity 
      style={[styles.courseCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.courseIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      
      <View style={styles.courseContent}>
        <Text style={[styles.courseTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.courseSubtitle, { color: theme.text + '80' }]}>{subtitle}</Text>
        
        <View style={styles.courseInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="book-outline" size={14} color={theme.text + '60'} />
            <Text style={[styles.infoText, { color: theme.text + '60' }]}>{lessons} leçons</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '20' }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>
              {difficulty}
            </Text>
          </View>
        </View>

        {progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={[styles.progressText, { color: theme.text + '80' }]}>
                Progression: {progress}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} 
              />
            </View>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return '#4CAF50';
      case 'Moyen': return '#FF9800';
      case 'Difficile': return '#F44336';
      default: return theme.primary;
    }
  };

  const getDefCourses = () => [
    {
      id: '1',
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
      id: '2',
      icon: 'calculator-outline',
      title: 'Mathématiques',
      subtitle: 'Algèbre, géométrie et calcul',
      progress: 45,
      color: '#2196F3',
      difficulty: 'Moyen',
      lessons: 28,
      level: 'DEF'
    },
    {
      id: '3',
      icon: 'flask-outline',
      title: 'Physique-Chimie',
      subtitle: 'Sciences physiques et chimiques',
      progress: 30,
      color: '#E91E63',
      difficulty: 'Moyen',
      lessons: 20,
      level: 'DEF'
    },
    {
      id: '4',
      icon: 'globe-outline',
      title: 'Histoire-Géographie',
      subtitle: 'Histoire du monde et géographie',
      progress: 75,
      color: '#9C27B0',
      difficulty: 'Facile',
      lessons: 22,
      level: 'DEF'
    },
    {
      id: '5',
      icon: 'leaf-outline',
      title: 'Sciences de la Vie et de la Terre',
      subtitle: 'Biologie et sciences naturelles',
      progress: 50,
      color: '#4CAF50',
      difficulty: 'Facile',
      lessons: 18,
      level: 'DEF'
    },
    {
      id: '6',
      icon: 'globe',
      title: 'Anglais',
      subtitle: 'Langue anglaise et communication',
      progress: 40,
      color: '#607D8B',
      difficulty: 'Moyen',
      lessons: 16,
      level: 'DEF'
    },
    {
      id: '7',
      icon: 'people-outline',
      title: 'Éducation Civique et Morale',
      subtitle: 'Citoyenneté et valeurs',
      progress: 80,
      color: '#795548',
      difficulty: 'Facile',
      lessons: 12,
      level: 'DEF'
    },
    {
      id: '8',
      icon: 'book-outline',
      title: 'Langue Arabe',
      subtitle: 'Littérature et grammaire arabe',
      progress: 35,
      color: '#FF5722',
      difficulty: 'Moyen',
      lessons: 20,
      level: 'DEF'
    }
  ];

  const getBacCourses = () => {
    const coursesByTrack = {
      TSE: [
        { id: 'tse1', icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Analyse, algèbre et géométrie', color: '#2196F3', difficulty: 'Difficile', lessons: 32, progress: 68, level: 'TSE' },
        { id: 'tse2', icon: 'nuclear-outline', title: 'Physique', subtitle: 'Mécanique, thermodynamique, optique', color: '#E91E63', difficulty: 'Difficile', lessons: 28, progress: 45, level: 'TSE' },
        { id: 'tse3', icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie organique et minérale', color: '#9C27B0', difficulty: 'Difficile', lessons: 24, progress: 72, level: 'TSE' },
        { id: 'tse4', icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Biologie cellulaire et génétique', color: '#4CAF50', difficulty: 'Moyen', lessons: 20, progress: 56, level: 'TSE' },
        { id: 'tse5', icon: 'desktop-outline', title: 'Informatique', subtitle: 'Programmation et algorithmes', color: '#607D8B', difficulty: 'Moyen', lessons: 16, level: 'TSE' },
        { id: 'tse6', icon: 'language-outline', title: 'Français', subtitle: 'Littérature et expression écrite', color: '#FF9800', difficulty: 'Moyen', lessons: 18, progress: 83, level: 'TSE' },
        { id: 'tse7', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Pensée critique et logique', color: '#795548', difficulty: 'Moyen', lessons: 14, level: 'TSE' },
        { id: 'tse8', icon: 'globe', title: 'Anglais', subtitle: 'Communication avancée', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 91, level: 'TSE' }
      ],
      TSEXP: [
        { id: 'tsexp1', icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Statistiques et probabilités', color: '#2196F3', difficulty: 'Difficile', lessons: 28, progress: 62, level: 'TSEXP' },
        { id: 'tsexp2', icon: 'nuclear-outline', title: 'Physique', subtitle: 'Physique expérimentale', color: '#E91E63', difficulty: 'Difficile', lessons: 26, progress: 55, level: 'TSEXP' },
        { id: 'tsexp3', icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie analytique', color: '#9C27B0', difficulty: 'Difficile', lessons: 22, progress: 48, level: 'TSEXP' },
        { id: 'tsexp4', icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Écologie et environnement', color: '#4CAF50', difficulty: 'Moyen', lessons: 24, progress: 71, level: 'TSEXP' },
        { id: 'tsexp5', icon: 'language-outline', title: 'Français', subtitle: 'Analyse littéraire', color: '#FF9800', difficulty: 'Moyen', lessons: 16, progress: 79, level: 'TSEXP' },
        { id: 'tsexp6', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Éthique et sciences', color: '#795548', difficulty: 'Moyen', lessons: 14, level: 'TSEXP' },
        { id: 'tsexp7', icon: 'globe', title: 'Anglais', subtitle: 'Anglais scientifique', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 88, level: 'TSEXP' },
        { id: 'tsexp8', icon: 'fitness-outline', title: 'Éducation Physique et Sportive', subtitle: 'Sport et santé', color: '#FF5722', difficulty: 'Facile', lessons: 10, progress: 95, level: 'TSEXP' }
      ],
      TSECO: [
        { id: 'tseco1', icon: 'calculator-outline', title: 'Mathématiques appliquées', subtitle: 'Statistiques économiques', color: '#2196F3', difficulty: 'Moyen', lessons: 24, progress: 58, level: 'TSECO' },
        { id: 'tseco2', icon: 'trending-up-outline', title: 'Économie', subtitle: 'Microéconomie et macroéconomie', color: '#4CAF50', difficulty: 'Moyen', lessons: 28, progress: 73, level: 'TSECO' },
        { id: 'tseco3', icon: 'briefcase-outline', title: 'Gestion', subtitle: 'Management et organisation', color: '#607D8B', difficulty: 'Moyen', lessons: 22, progress: 64, level: 'TSECO' },
        { id: 'tseco4', icon: 'document-text-outline', title: 'Droit', subtitle: 'Droit commercial et civil', color: '#795548', difficulty: 'Moyen', lessons: 20, level: 'TSECO' },
        { id: 'tseco5', icon: 'language-outline', title: 'Français', subtitle: 'Communication professionnelle', color: '#FF9800', difficulty: 'Moyen', lessons: 16, progress: 81, level: 'TSECO' },
        { id: 'tseco6', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Philosophie politique', color: '#9C27B0', difficulty: 'Moyen', lessons: 14, level: 'TSECO' },
        { id: 'tseco7', icon: 'globe', title: 'Anglais', subtitle: 'Anglais des affaires', color: '#3F51B5', difficulty: 'Moyen', lessons: 12, progress: 87, level: 'TSECO' },
        { id: 'tseco8', icon: 'globe-outline', title: 'Histoire-Géographie', subtitle: 'Géographie économique', color: '#E91E63', difficulty: 'Facile', lessons: 18, progress: 92, level: 'TSECO' },
        { id: 'tseco9', icon: 'people-outline', title: 'Éducation Civique', subtitle: 'Citoyenneté et société', color: '#FF5722', difficulty: 'Facile', lessons: 10, progress: 96, level: 'TSECO' }
      ]
    };

    return coursesByTrack[user?.level] || coursesByTrack.TSE;
  };

  const coursesData = isDefLevel ? getDefCourses() : getBacCourses();

  const handleCoursePress = (course) => {
    router.push(`/(tabs)/courses/${course.level}/${course.title}`);
  };

  // Header Component - exactly like schedule
  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Mes Cours DEF' : `Mes Cours ${user?.level}`}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Catalogue de Cours
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
          >
            <Ionicons name="filter-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
          >
            <Ionicons name="search-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Stats Section - overlapping like schedule day selector
  const StatsSelector = () => (
    <View style={[styles.statsSelector, { backgroundColor: theme.surface }]}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {coursesData.filter(c => c.progress).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {Math.round(coursesData.filter(c => c.progress).reduce((acc, c) => acc + c.progress, 0) / coursesData.filter(c => c.progress).length) || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Progression</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.accent }]}>
            {coursesData.length - coursesData.filter(c => c.progress).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>À commencer</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <StatsSelector />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tous les cours
            </Text>
          </View>
          
          {coursesData.map((course, index) => (
            <CourseCard
              key={course.id}
              icon={course.icon}
              title={course.title}
              subtitle={course.subtitle}
              progress={course.progress}
              color={course.color}
              difficulty={course.difficulty}
              lessons={course.lessons}
              level={course.level}
              onPress={() => handleCoursePress(course)}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header - exactly like schedule
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Stats selector - like day selector in schedule
  statsSelector: {
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  courseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
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
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  bottomPadding: {
    height: 40,
  },
});