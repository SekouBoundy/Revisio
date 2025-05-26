// app/(tabs)/courses/index.js - CLEAN VERSION
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
      case 'Facile': return theme.success;
      case 'Moyen': return theme.warning;
      case 'Difficile': return theme.error;
      default: return theme.primary;
    }
  };

  const getDefCourses = () => [
    {
      id: 'def_francais',
      icon: 'language-outline',
      title: 'Français',
      subtitle: 'Grammaire, littérature et expression',
      progress: 65,
      color: theme.secondary,
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
      color: theme.primary,
      difficulty: 'Moyen',
      lessons: 28,
      level: 'DEF'
    },
    {
      id: 'def_physique_chimie',
      icon: 'flask-outline',
      title: 'Physique-Chimie',
      subtitle: 'Sciences physiques et chimiques',
      progress: 30,
      color: theme.accent,
      difficulty: 'Moyen',
      lessons: 20,
      level: 'DEF'
    },
    {
      id: 'def_histoire_geo',
      icon: 'globe-outline',
      title: 'Histoire-Géographie',
      subtitle: 'Histoire du monde et géographie',
      progress: 75,
      color: theme.info,
      difficulty: 'Facile',
      lessons: 22,
      level: 'DEF'
    },
    {
      id: 'def_svt',
      icon: 'leaf-outline',
      title: 'Sciences de la Vie et de la Terre',
      subtitle: 'Biologie et sciences naturelles',
      progress: 50,
      color: theme.success,
      difficulty: 'Facile',
      lessons: 18,
      level: 'DEF'
    },
    {
      id: 'def_anglais',
      icon: 'globe',
      title: 'Anglais',
      subtitle: 'Langue anglaise et communication',
      progress: 40,
      color: theme.neutralDark,
      difficulty: 'Moyen',
      lessons: 16,
      level: 'DEF'
    },
    {
      id: 'def_civique',
      icon: 'people-outline',
      title: 'Éducation Civique et Morale',
      subtitle: 'Citoyenneté et valeurs',
      progress: 80,
      color: theme.warning,
      difficulty: 'Facile',
      lessons: 12,
      level: 'DEF'
    }
  ];

  const getBacCourses = () => {
    const coursesByTrack = {
      TSE: [
        { id: 'tse_math', icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Analyse, algèbre et géométrie', color: theme.primary, difficulty: 'Difficile', lessons: 32, progress: 68, level: 'TSE' },
        { id: 'tse_physique', icon: 'nuclear-outline', title: 'Physique', subtitle: 'Mécanique, thermodynamique, optique', color: theme.accent, difficulty: 'Difficile', lessons: 28, progress: 45, level: 'TSE' },
        { id: 'tse_chimie', icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie organique et minérale', color: theme.info, difficulty: 'Difficile', lessons: 24, progress: 72, level: 'TSE' },
        { id: 'tse_bio_geo', icon: 'leaf-outline', title: 'Bio/Geo', subtitle: 'Biologie et géologie', color: theme.success, difficulty: 'Moyen', lessons: 20, progress: 56, level: 'TSE' },
        { id: 'tse_francais', icon: 'language-outline', title: 'Français', subtitle: 'Littérature et expression écrite', color: theme.secondary, difficulty: 'Moyen', lessons: 18, progress: 83, level: 'TSE' },
        { id: 'tse_philo', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Pensée critique et logique', color: theme.warning, difficulty: 'Moyen', lessons: 14, level: 'TSE' },
        { id: 'tse_anglais', icon: 'globe', title: 'Anglais', subtitle: 'Communication avancée', color: theme.neutralDark, difficulty: 'Moyen', lessons: 12, progress: 91, level: 'TSE' }
      ],
      TSEXP: [
        { id: 'tsexp_math', icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Statistiques et probabilités', color: theme.primary, difficulty: 'Difficile', lessons: 28, progress: 62, level: 'TSEXP' },
        { id: 'tsexp_phys_chim', icon: 'flask-outline', title: 'Physique/Chimie', subtitle: 'Sciences expérimentales', color: theme.accent, difficulty: 'Difficile', lessons: 26, progress: 55, level: 'TSEXP' },
        { id: 'tsexp_bio', icon: 'leaf-outline', title: 'Bio', subtitle: 'Biologie et sciences naturelles', color: theme.success, difficulty: 'Moyen', lessons: 24, progress: 71, level: 'TSEXP' },
        { id: 'tsexp_geo', icon: 'globe-outline', title: 'Geo', subtitle: 'Géographie et environnement', color: theme.warning, difficulty: 'Moyen', lessons: 16, progress: 64, level: 'TSEXP' },
        { id: 'tsexp_philo', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Éthique et sciences', color: theme.info, difficulty: 'Moyen', lessons: 14, level: 'TSEXP' },
        { id: 'tsexp_anglais', icon: 'globe', title: 'Anglais', subtitle: 'Anglais scientifique', color: theme.neutralDark, difficulty: 'Moyen', lessons: 12, progress: 88, level: 'TSEXP' }
      ],
      TSECO: [
        { id: 'tseco_math', icon: 'calculator-outline', title: 'Mathématiques appliquées', subtitle: 'Statistiques économiques', color: theme.primary, difficulty: 'Moyen', lessons: 24, progress: 58, level: 'TSECO' },
        { id: 'tseco_eco', icon: 'trending-up-outline', title: 'Économie', subtitle: 'Microéconomie et macroéconomie', color: theme.success, difficulty: 'Moyen', lessons: 28, progress: 73, level: 'TSECO' },
        { id: 'tseco_gestion', icon: 'briefcase-outline', title: 'Gestion', subtitle: 'Management et organisation', color: theme.neutralDark, difficulty: 'Moyen', lessons: 22, progress: 64, level: 'TSECO' },
        { id: 'tseco_droit', icon: 'document-text-outline', title: 'Droit', subtitle: 'Droit commercial et civil', color: theme.warning, difficulty: 'Moyen', lessons: 20, level: 'TSECO' },
        { id: 'tseco_francais', icon: 'language-outline', title: 'Français', subtitle: 'Communication professionnelle', color: theme.secondary, difficulty: 'Moyen', lessons: 16, progress: 81, level: 'TSECO' },
        { id: 'tseco_philo', icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Philosophie politique', color: theme.info, difficulty: 'Moyen', lessons: 14, level: 'TSECO' },
        { id: 'tseco_anglais', icon: 'globe', title: 'Anglais', subtitle: 'Anglais des affaires', color: theme.accent, difficulty: 'Moyen', lessons: 12, progress: 87, level: 'TSECO' },
        { id: 'tseco_hist_geo', icon: 'globe-outline', title: 'Histoire-Géographie', subtitle: 'Géographie économique', color: theme.error, difficulty: 'Facile', lessons: 18, progress: 92, level: 'TSECO' },
        { id: 'tseco_civique', icon: 'people-outline', title: 'Éducation Civique', subtitle: 'Citoyenneté et société', color: theme.neutralLight, difficulty: 'Facile', lessons: 10, progress: 96, level: 'TSECO' }
      ]
    };

    return coursesByTrack[user?.level] || coursesByTrack.TSE;
  };

  const coursesData = isDefLevel ? getDefCourses() : getBacCourses();

  const handleCoursePress = (course) => {
    router.push(`/(tabs)/courses/${course.level}/${course.title.replace(/\s+/g, '_').replace(/\//g, '_')}`);
  };

  // Header Component
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

  // Stats Section
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