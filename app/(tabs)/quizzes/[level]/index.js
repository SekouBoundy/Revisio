// app/(tabs)/quizzes/[level]/index.js
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

export default function LevelQuizzesScreen() {
  const { level } = useLocalSearchParams();
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const isDefLevel = level === 'DEF';

  const QuizCard = ({ icon, title, subject, questions, duration, difficulty, score, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.quizCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.quizIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      
      <View style={styles.quizContent}>
        <Text style={[styles.quizTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.quizSubject, { color: theme.text + '80' }]}>{subject}</Text>
        
        <View style={styles.quizInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="help-circle-outline" size={14} color={theme.text + '60'} />
              <Text style={[styles.infoText, { color: theme.text + '60' }]}>{questions} questions</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={theme.text + '60'} />
              <Text style={[styles.infoText, { color: theme.text + '60' }]}>{duration} min</Text>
            </View>
          </View>
          
          <View style={styles.quizMeta}>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '20' }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>
                {difficulty}
              </Text>
            </View>
            {score !== undefined && (
              <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
                {score}%
              </Text>
            )}
          </View>
        </View>
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

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getDefQuizzes = () => [
    {
      icon: 'calculator-outline',
      title: 'Les Fractions',
      subject: 'Mathématiques',
      questions: 10,
      duration: 15,
      difficulty: 'Facile',
      score: 85,
      color: '#2196F3'
    },
    {
      icon: 'calculator-outline',
      title: 'Géométrie',
      subject: 'Mathématiques',
      questions: 12,
      duration: 20,
      difficulty: 'Moyen',
      color: '#2196F3'
    },
    {
      icon: 'flask-outline',
      title: 'États de la matière',
      subject: 'Physique-Chimie',
      questions: 8,
      duration: 12,
      difficulty: 'Facile',
      score: 92,
      color: '#E91E63'
    },
    {
      icon: 'language-outline',
      title: 'Conjugaison',
      subject: 'Français',
      questions: 15,
      duration: 18,
      difficulty: 'Moyen',
      score: 76,
      color: '#FF9800'
    },
    {
      icon: 'globe-outline',
      title: 'La Renaissance',
      subject: 'Histoire-Géographie',
      questions: 10,
      duration: 15,
      difficulty: 'Facile',
      color: '#9C27B0'
    },
    {
      icon: 'leaf-outline',
      title: 'Les animaux',
      subject: 'Sciences de la Vie et de la Terre',
      questions: 12,
      duration: 20,
      difficulty: 'Facile',
      score: 88,
      color: '#4CAF50'
    },
    {
      icon: 'globe',
      title: 'Present Simple',
      subject: 'Anglais',
      questions: 8,
      duration: 12,
      difficulty: 'Facile',
      color: '#607D8B'
    },
    {
      icon: 'people-outline',
      title: 'Droits et devoirs',
      subject: 'Éducation Civique et Morale',
      questions: 6,
      duration: 10,
      difficulty: 'Facile',
      score: 94,
      color: '#795548'
    }
  ];

  const getBacQuizzes = () => {
    const quizzesByTrack = {
      TSE: [
        {
          icon: 'calculator-outline',
          title: 'Intégrales',
          subject: 'Mathématiques',
          questions: 20,
          duration: 45,
          difficulty: 'Difficile',
          score: 78,
          color: '#2196F3'
        },
        {
          icon: 'nuclear-outline',
          title: 'Mécanique quantique',
          subject: 'Physique',
          questions: 15,
          duration: 35,
          difficulty: 'Difficile',
          color: '#E91E63'
        },
        {
          icon: 'flask-outline',
          title: 'Chimie organique',
          subject: 'Chimie',
          questions: 18,
          duration: 40,
          difficulty: 'Difficile',
          score: 82,
          color: '#9C27B0'
        },
        {
          icon: 'desktop-outline',
          title: 'Algorithmes',
          subject: 'Informatique',
          questions: 12,
          duration: 30,
          difficulty: 'Moyen',
          color: '#607D8B'
        },
        {
          icon: 'bulb-outline',
          title: 'Logique',
          subject: 'Philosophie',
          questions: 10,
          duration: 25,
          difficulty: 'Moyen',
          score: 85,
          color: '#795548'
        }
      ],
      TSEXP: [
        {
          icon: 'calculator-outline',
          title: 'Statistiques',
          subject: 'Mathématiques',
          questions: 16,
          duration: 35,
          difficulty: 'Difficile',
          score: 74,
          color: '#2196F3'
        },
        {
          icon: 'leaf-outline',
          title: 'Écologie',
          subject: 'Sciences de la Vie et de la Terre',
          questions: 14,
          duration: 30,
          difficulty: 'Moyen',
          color: '#4CAF50'
        },
        {
          icon: 'flask-outline',
          title: 'Chimie analytique',
          subject: 'Chimie',
          questions: 12,
          duration: 28,
          difficulty: 'Difficile',
          color: '#9C27B0'
        }
      ],
      TSECO: [
        {
          icon: 'trending-up-outline',
          title: 'Microéconomie',
          subject: 'Économie',
          questions: 20,
          duration: 40,
          difficulty: 'Moyen',
          score: 88,
          color: '#4CAF50'
        },
        {
          icon: 'briefcase-outline',
          title: 'Management',
          subject: 'Gestion',
          questions: 15,
          duration: 30,
          difficulty: 'Moyen',
          color: '#607D8B'
        },
        {
          icon: 'document-text-outline',
          title: 'Droit commercial',
          subject: 'Droit',
          questions: 18,
          duration: 35,
          difficulty: 'Moyen',
          score: 79,
          color: '#795548'
        }
      ]
    };

    return quizzesByTrack[level] || quizzesByTrack.TSE;
  };

  const quizzesData = isDefLevel ? getDefQuizzes() : getBacQuizzes();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {isDefLevel ? 'Quiz DEF' : `Quiz ${level}`}
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>
            {quizzesData.filter(q => q.score).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Terminés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {Math.round(quizzesData.filter(q => q.score).reduce((acc, q) => acc + q.score, 0) / quizzesData.filter(q => q.score).length) || 0}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.text + '80' }]}>Moyenne</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {quizzesData.length - quizzesData.filter(q => q.score).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text + '80' }]}>À faire</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {quizzesData.map((quiz, index) => (
            <QuizCard
              key={index}
              icon={quiz.icon}
              title={quiz.title}
              subject={quiz.subject}
              questions={quiz.questions}
              duration={quiz.duration}
              difficulty={quiz.difficulty}
              score={quiz.score}
              color={quiz.color}
              onPress={() => console.log(`Start quiz: ${quiz.title}`)}
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
  filterButton: {
    padding: 8,
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  quizSubject: {
    fontSize: 12,
    marginBottom: 8,
  },
  quizInfo: {
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 11,
  },
  quizMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});