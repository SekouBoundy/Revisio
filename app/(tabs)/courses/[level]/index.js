// app/(tabs)/courses/[level]/index.js
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
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemeContext } from '../../../../constants/ThemeContext';
import { useUser } from '../../../../constants/UserContext';

export default function LevelCoursesScreen() {
  const { level } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const isDefLevel = level === 'DEF';

  const CourseCard = ({ icon, title, subtitle, progress, color, difficulty, lessons, onPress }) => (
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

  const CategoryHeader = ({ title, count }) => (
    <View style={styles.categoryHeader}>
      <Text style={[styles.categoryTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.categoryCount, { color: theme.text + '60' }]}>({count} cours)</Text>
    </View>
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
      icon: 'language-outline',
      title: 'Français',
      subtitle: 'Grammaire, littérature et expression',
      progress: 65,
      color: '#FF9800',
      difficulty: 'Moyen',
      lessons: 24
    },
    {
      icon: 'calculator-outline',
      title: 'Mathématiques',
      subtitle: 'Algèbre, géométrie et calcul',
      progress: 45,
      color: '#2196F3',
      difficulty: 'Moyen',
      lessons: 28
    },
    {
      icon: 'flask-outline',
      title: 'Physique-Chimie',
      subtitle: 'Sciences physiques et chimiques',
      progress: 30,
      color: '#E91E63',
      difficulty: 'Moyen',
      lessons: 20
    },
    {
      icon: 'globe-outline',
      title: 'Histoire-Géographie',
      subtitle: 'Histoire du monde et géographie',
      progress: 75,
      color: '#9C27B0',
      difficulty: 'Facile',
      lessons: 22
    },
    {
      icon: 'leaf-outline',
      title: 'Sciences de la Vie et de la Terre',
      subtitle: 'Biologie et sciences naturelles',
      progress: 50,
      color: '#4CAF50',
      difficulty: 'Facile',
      lessons: 18
    },
    {
      icon: 'globe',
      title: 'Anglais',
      subtitle: 'Langue anglaise et communication',
      progress: 40,
      color: '#607D8B',
      difficulty: 'Moyen',
      lessons: 16
    },
    {
      icon: 'people-outline',
      title: 'Éducation Civique et Morale',
      subtitle: 'Citoyenneté et valeurs',
      progress: 80,
      color: '#795548',
      difficulty: 'Facile',
      lessons: 12
    },
    {
      icon: 'book-outline',
      title: 'Langue Arabe',
      subtitle: 'Littérature et grammaire arabe',
      progress: 35,
      color: '#FF5722',
      difficulty: 'Moyen',
      lessons: 20
    }
  ];

  const getBacCourses = () => {
    const coursesByTrack = {
      TSE: [
        { icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Analyse, algèbre et géométrie', color: '#2196F3', difficulty: 'Difficile', lessons: 32 },
        { icon: 'nuclear-outline', title: 'Physique', subtitle: 'Mécanique, thermodynamique, optique', color: '#E91E63', difficulty: 'Difficile', lessons: 28 },
        { icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie organique et minérale', color: '#9C27B0', difficulty: 'Difficile', lessons: 24 },
        { icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Biologie cellulaire et génétique', color: '#4CAF50', difficulty: 'Moyen', lessons: 20 },
        { icon: 'desktop-outline', title: 'Informatique', subtitle: 'Programmation et algorithmes', color: '#607D8B', difficulty: 'Moyen', lessons: 16 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Littérature et expression écrite', color: '#FF9800', difficulty: 'Moyen', lessons: 18 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Pensée critique et logique', color: '#795548', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Communication avancée', color: '#3F51B5', difficulty: 'Moyen', lessons: 12 }
      ],
      TSEXP: [
        { icon: 'calculator-outline', title: 'Mathématiques', subtitle: 'Statistiques et probabilités', color: '#2196F3', difficulty: 'Difficile', lessons: 28 },
        { icon: 'nuclear-outline', title: 'Physique', subtitle: 'Physique expérimentale', color: '#E91E63', difficulty: 'Difficile', lessons: 26 },
        { icon: 'flask-outline', title: 'Chimie', subtitle: 'Chimie analytique', color: '#9C27B0', difficulty: 'Difficile', lessons: 22 },
        { icon: 'leaf-outline', title: 'Sciences de la Vie et de la Terre', subtitle: 'Écologie et environnement', color: '#4CAF50', difficulty: 'Moyen', lessons: 24 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Analyse littéraire', color: '#FF9800', difficulty: 'Moyen', lessons: 16 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Éthique et sciences', color: '#795548', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Anglais scientifique', color: '#3F51B5', difficulty: 'Moyen', lessons: 12 },
        { icon: 'fitness-outline', title: 'Éducation Physique et Sportive', subtitle: 'Sport et santé', color: '#FF5722', difficulty: 'Facile', lessons: 10 }
      ],
      TSECO: [
        { icon: 'calculator-outline', title: 'Mathématiques appliquées', subtitle: 'Statistiques économiques', color: '#2196F3', difficulty: 'Moyen', lessons: 24 },
        { icon: 'trending-up-outline', title: 'Économie', subtitle: 'Microéconomie et macroéconomie', color: '#4CAF50', difficulty: 'Moyen', lessons: 28 },
        { icon: 'briefcase-outline', title: 'Gestion', subtitle: 'Management et organisation', color: '#607D8B', difficulty: 'Moyen', lessons: 22 },
        { icon: 'document-text-outline', title: 'Droit', subtitle: 'Droit commercial et civil', color: '#795548', difficulty: 'Moyen', lessons: 20 },
        { icon: 'language-outline', title: 'Français', subtitle: 'Communication professionnelle', color: '#FF9800', difficulty: 'Moyen', lessons: 16 },
        { icon: 'bulb-outline', title: 'Philosophie', subtitle: 'Philosophie politique', color: '#9C27B0', difficulty: 'Moyen', lessons: 14 },
        { icon: 'globe', title: 'Anglais', subtitle: 'Anglais des affaires', color: '#3F51B5', difficulty: 'Moyen', lessons: 12 },
        { icon: 'globe-outline', title: 'Histoire-Géographie', subtitle: 'Géographie économique', color: '#E91E63', difficulty: 'Facile', lessons: 18 },
        { icon: 'people-outline', title: 'Éducation Civique', subtitle: 'Citoyenneté et société', color: '#FF5722', difficulty: 'Facile', lessons: 10 }
      ]
      // Add other tracks as needed
    };

    return coursesByTrack[level] || coursesByTrack.TSE;
  };

  const coursesData = isDefLevel ? getDefCourses() : getBacCourses();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isDefLevel ? 'Cours DEF' : `Cours ${level}`}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {coursesData.map((course, index) => (
            <CourseCard
              key={index}
              icon={course.icon}
              title={course.title}
              subtitle={course.subtitle}
              progress={course.progress}
              color={course.color}
              difficulty={course.difficulty}
              lessons={course.lessons}
              onPress={() => console.log(`Navigate to ${course.title}`)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryCount: {
    fontSize: 14,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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