// app/(tabs)/quizzes/index.js - Updated with new course structure
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

export default function QuizzesIndex() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';

  const getPerformanceColor = (score) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.warning;
    return theme.error;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Facile': return theme.success;
      case 'Moyen': return theme.warning;
      case 'Difficile': return theme.error;
      default: return theme.primary;
    }
  };

  const getDefQuizzes = () => [
    { icon: 'calculator-outline', title: 'Les Fractions', subject: 'Mathématiques', questions: 10, duration: 15, difficulty: 'Facile', score: 85, color: theme.primary },
    { icon: 'calculator-outline', title: 'Géométrie', subject: 'Mathématiques', questions: 12, duration: 20, difficulty: 'Moyen', color: theme.primary },
    { icon: 'flask-outline', title: 'États de la matière', subject: 'Physique-Chimie', questions: 8, duration: 12, difficulty: 'Facile', score: 92, color: theme.accent },
    { icon: 'language-outline', title: 'Conjugaison', subject: 'Français', questions: 15, duration: 18, difficulty: 'Moyen', score: 76, color: theme.secondary },
    { icon: 'globe-outline', title: 'La Renaissance', subject: 'Histoire-Géographie', questions: 10, duration: 15, difficulty: 'Facile', color: theme.info },
    { icon: 'leaf-outline', title: 'Les animaux', subject: 'Sciences de la Vie et de la Terre', questions: 12, duration: 20, difficulty: 'Facile', score: 88, color: theme.success },
    { icon: 'globe', title: 'Present Simple', subject: 'Anglais', questions: 8, duration: 12, difficulty: 'Facile', color: theme.neutralDark },
    { icon: 'people-outline', title: 'Droits et devoirs', subject: 'Éducation Civique et Morale', questions: 6, duration: 10, difficulty: 'Facile', score: 94, color: theme.warning }
  ];

  const getBacQuizzes = () => {
    const quizzesByTrack = {
      TSE: [
        { icon: 'calculator-outline', title: 'Intégrales', subject: 'Mathématiques', questions: 20, duration: 45, difficulty: 'Difficile', score: 78, color: theme.primary },
        { icon: 'nuclear-outline', title: 'Mécanique quantique', subject: 'Physique', questions: 15, duration: 35, difficulty: 'Difficile', color: theme.accent },
        { icon: 'flask-outline', title: 'Chimie organique', subject: 'Chimie', questions: 18, duration: 40, difficulty: 'Difficile', score: 82, color: theme.info },
        { icon: 'leaf-outline', title: 'Géologie', subject: 'Bio/Geo', questions: 12, duration: 25, difficulty: 'Moyen', color: theme.success },
        { icon: 'language-outline', title: 'Dissertation', subject: 'Français', questions: 3, duration: 60, difficulty: 'Difficile', color: theme.secondary },
        { icon: 'bulb-outline', title: 'Logique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', score: 85, color: theme.warning },
        { icon: 'globe', title: 'Advanced Grammar', subject: 'Anglais', questions: 15, duration: 20, difficulty: 'Moyen', score: 91, color: theme.neutralDark }
      ],
      TSEXP: [
        { icon: 'calculator-outline', title: 'Statistiques', subject: 'Mathématiques', questions: 16, duration: 35, difficulty: 'Difficile', score: 74, color: theme.primary },
        { icon: 'flask-outline', title: 'Analyses chimiques', subject: 'Physique/Chimie', questions: 14, duration: 30, difficulty: 'Difficile', color: theme.accent },
        { icon: 'leaf-outline', title: 'Écologie', subject: 'Bio', questions: 12, duration: 28, difficulty: 'Moyen', score: 88, color: theme.success },
        { icon: 'globe-outline', title: 'Environnement', subject: 'Geo', questions: 10, duration: 20, difficulty: 'Moyen', color: theme.warning },
        { icon: 'bulb-outline', title: 'Éthique scientifique', subject: 'Philosophie', questions: 8, duration: 25, difficulty: 'Moyen', color: theme.info },
        { icon: 'globe', title: 'Scientific English', subject: 'Anglais', questions: 12, duration: 18, difficulty: 'Moyen', score: 89, color: theme.neutralDark }
      ],
      TSECO: [
        { icon: 'trending-up-outline', title: 'Microéconomie', subject: 'Économie', questions: 20, duration: 40, difficulty: 'Moyen', score: 88, color: theme.success },
        { icon: 'briefcase-outline', title: 'Management', subject: 'Gestion', questions: 15, duration: 30, difficulty: 'Moyen', color: theme.neutralDark },
        { icon: 'document-text-outline', title: 'Droit commercial', subject: 'Droit', questions: 18, duration: 35, difficulty: 'Moyen', score: 79, color: theme.warning },
        { icon: 'calculator-outline', title: 'Statistiques économiques', subject: 'Mathématiques appliquées', questions: 14, duration: 25, difficulty: 'Moyen', color: theme.primary },
        { icon: 'language-outline', title: 'Communication professionnelle', subject: 'Français', questions: 12, duration: 30, difficulty: 'Moyen', score: 85, color: theme.secondary },
        { icon: 'bulb-outline', title: 'Philosophie politique', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Moyen', color: theme.info },
        { icon: 'globe', title: 'Business English', subject: 'Anglais', questions: 12, duration: 20, difficulty: 'Moyen', score: 87, color: theme.accent },
        { icon: 'globe-outline', title: 'Géographie économique', subject: 'Histoire-Géographie', questions: 15, duration: 25, difficulty: 'Facile', score: 92, color: theme.error },
        { icon: 'people-outline', title: 'Citoyenneté', subject: 'Éducation Civique', questions: 8, duration: 15, difficulty: 'Facile', score: 96, color: theme.neutralLight }
      ],
      TSS: [
        { icon: 'people-outline', title: 'Comportements sociaux', subject: 'Sociologie', questions: 18, duration: 35, difficulty: 'Moyen', score: 83, color: theme.info },
        { icon: 'globe-outline', title: 'Histoire sociale', subject: 'Histoire-Géographie', questions: 16, duration: 30, difficulty: 'Moyen', score: 78, color: theme.warning },
        { icon: 'bulb-outline', title: 'Philosophie politique', subject: 'Philosophie', questions: 12, duration: 30, difficulty: 'Difficile', color: theme.neutralDark },
        { icon: 'language-outline', title: 'Argumentation', subject: 'Français', questions: 10, duration: 35, difficulty: 'Moyen', score: 84, color: theme.secondary },
        { icon: 'globe', title: 'Communication internationale', subject: 'Anglais', questions: 12, duration: 20, difficulty: 'Moyen', score: 89, color: theme.accent },
        { icon: 'school-outline', title: 'Droits humains', subject: 'Éducation Civique et Morale', questions: 8, duration: 15, difficulty: 'Facile', score: 95, color: theme.success },
        { icon: 'calculator-outline', title: 'Statistiques sociales', subject: 'Mathématiques adaptées', questions: 10, duration: 20, difficulty: 'Facile', score: 76, color: theme.primary }
      ],
      TAL: [
        { icon: 'book-outline', title: 'Littérature moderne', subject: 'Littérature', questions: 15, duration: 40, difficulty: 'Difficile', score: 76, color: theme.accent },
        { icon: 'bulb-outline', title: 'Esthétique', subject: 'Philosophie', questions: 12, duration: 35, difficulty: 'Difficile', color: theme.info },
        { icon: 'color-palette-outline', title: 'Art contemporain', subject: 'Histoire de l\'art', questions: 12, duration: 25, difficulty: 'Moyen', score: 89, color: theme.error },
        { icon: 'language-outline', title: 'Expression créative', subject: 'Français', questions: 8, duration: 45, difficulty: 'Moyen', score: 82, color: theme.secondary },
        { icon: 'globe', title: 'Anglais littéraire', subject: 'Anglais', questions: 10, duration: 25, difficulty: 'Moyen', score: 87, color: theme.neutralDark },
        { icon: 'brush-outline', title: 'Pratique artistique', subject: 'Arts plastiques ou musique', questions: 6, duration: 30, difficulty: 'Moyen', score: 74, color: theme.warning },
        { icon: 'globe-outline', title: 'Histoire culturelle', subject: 'Histoire-Géographie', questions: 12, duration: 20, difficulty: 'Facile', score: 91, color: theme.success }
      ],
      TLL: [
        { icon: 'language-outline', title: 'Grammaire comparée', subject: 'Langues vivantes', questions: 20, duration: 35, difficulty: 'Difficile', score: 81, color: theme.success },
        { icon: 'book-outline', title: 'Analyse littéraire', subject: 'Littérature', questions: 14, duration: 30, difficulty: 'Difficile', score: 77, color: theme.accent },
        { icon: 'bulb-outline', title: 'Philosophie du langage', subject: 'Philosophie', questions: 10, duration: 25, difficulty: 'Difficile', color: theme.info },
        { icon: 'globe-outline', title: 'Histoire des civilisations', subject: 'Histoire-Géographie', questions: 15, duration: 25, difficulty: 'Moyen', score: 86, color: theme.warning },
        { icon: 'create-outline', title: 'Linguistique', subject: 'Français', questions: 12, duration: 30, difficulty: 'Moyen', score: 83, color: theme.secondary },
        { icon: 'people-outline', title: 'Diversité culturelle', subject: 'Éducation Civique', questions: 8, duration: 15, difficulty: 'Facile', score: 92, color: theme.neutralDark }
      ],
      STI: [
        { icon: 'calculator-outline', title: 'Mathématiques industrielles', subject: 'Mathématiques appliquées', questions: 18, duration: 35, difficulty: 'Difficile', score: 73, color: theme.primary },
        { icon: 'nuclear-outline', title: 'Physique industrielle', subject: 'Physique appliquée', questions: 16, duration: 30, difficulty: 'Difficile', color: theme.accent },
        { icon: 'construct-outline', title: 'Systèmes industriels', subject: 'Technologie industrielle', questions: 14, duration: 35, difficulty: 'Difficile', score: 81, color: theme.warning },
        { icon: 'desktop-outline', title: 'Automatisation', subject: 'Informatique industrielle', questions: 12, duration: 25, difficulty: 'Moyen', score: 88, color: theme.neutralDark },
        { icon: 'language-outline', title: 'Communication technique', subject: 'Français', questions: 10, duration: 20, difficulty: 'Moyen', score: 85, color: theme.secondary },
        { icon: 'bulb-outline', title: 'Éthique technologique', subject: 'Philosophie', questions: 8, duration: 20, difficulty: 'Moyen', color: theme.info },
        { icon: 'globe', title: 'Anglais technique', subject: 'Anglais', questions: 10, duration: 18, difficulty: 'Moyen', score: 79, color: theme.success }
      ],
      STG: [
        { icon: 'briefcase-outline', title: 'Gestion d\'entreprise', subject: 'Gestion et administration', questions: 18, duration: 35, difficulty: 'Moyen', score: 84, color: theme.success },
        { icon: 'calculator-outline', title: 'Comptabilité analytique', subject: 'Comptabilité', questions: 15, duration: 30, difficulty: 'Moyen', score: 79, color: theme.primary },
        { icon: 'trending-up-outline', title: 'Économie d\'entreprise', subject: 'Économie', questions: 16, duration: 25, difficulty: 'Moyen', score: 86, color: theme.error },
        { icon: 'stats-chart-outline', title: 'Statistiques de gestion', subject: 'Mathématiques appliquées', questions: 12, duration: 25, difficulty: 'Moyen', color: theme.info },
        { icon: 'document-text-outline', title: 'Droit des affaires', subject: 'Droit', questions: 14, duration: 30, difficulty: 'Moyen', score: 82, color: theme.warning },
        { icon: 'language-outline', title: 'Communication d\'entreprise', subject: 'Français', questions: 10, duration: 25, difficulty: 'Moyen', score: 88, color: theme.secondary },
        { icon: 'bulb-outline', title: 'Éthique des affaires', subject: 'Philosophie', questions: 8, duration: 20, difficulty: 'Moyen', color: theme.neutralDark },
        { icon: 'globe', title: 'Anglais commercial', subject: 'Anglais', questions: 10, duration: 18, difficulty: 'Moyen', score: 91, color: theme.accent }
      ]
    };

    return quizzesByTrack[user?.level] || quizzesByTrack.TSE;
  };

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
              <Text style={[styles.scoreText, { color: getPerformanceColor(score) }]}>
                {score}%
              </Text>
            )}
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={theme.text + '40'} />
    </TouchableOpacity>
  );

  const quizzesData = isDefLevel ? getDefQuizzes() : getBacQuizzes();

  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            Performance
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Quiz Dashboard
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
          onPress={() => console.log('Filter')}
        >
          <Ionicons name="analytics" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const PerformanceRing = ({ percentage, size = 80 }) => (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      <View style={[styles.ringBackground, { 
        width: size, 
        height: size, 
        borderRadius: size/2,
        borderColor: theme.neutralLight 
      }]}>
        <View style={[styles.ringFill, { 
          width: size, 
          height: size, 
          borderRadius: size/2,
          borderTopColor: getPerformanceColor(percentage),
          borderRightColor: getPerformanceColor(percentage),
          transform: [{ rotate: `${(percentage / 100) * 360}deg` }]
        }]} />
        <View style={[styles.ringInner, { 
          width: size - 16, 
          height: size - 16, 
          borderRadius: (size - 16)/2,
          backgroundColor: theme.surface
        }]}>
          <Text style={[styles.ringText, { color: theme.text, fontSize: size * 0.2 }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );

  const PerformanceCard = () => {
    const completedQuizzes = quizzesData.filter(q => q.score);
    const averageScore = completedQuizzes.length > 0 
      ? Math.round(completedQuizzes.reduce((acc, q) => acc + q.score, 0) / completedQuizzes.length) 
      : 0;

    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.surface }]}>
        <View style={styles.performanceHeader}>
          <Text style={[styles.performanceTitle, { color: theme.text }]}>Performance Globale</Text>
          <TouchableOpacity onPress={() => console.log('Details')}>
            <Text style={[styles.detailsLink, { color: theme.primary }]}>Détails</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.performanceContent}>
          <PerformanceRing percentage={averageScore} size={100} />
          
          <View style={styles.performanceStats}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Quiz terminés</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>{completedQuizzes.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Temps moyen</Text>
              <Text style={[styles.statValue, { color: theme.text }]}>23 min</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Meilleur score</Text>
              <Text style={[styles.statValue, { color: theme.success }]}>
                {completedQuizzes.length > 0 ? Math.max(...completedQuizzes.map(q => q.score)) : 0}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Performance Overview */}
        <View style={styles.performanceSection}>
          <PerformanceCard />
        </View>

        {/* Quiz List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isDefLevel ? 'Quiz DEF' : `Quiz ${user?.level}`}
            </Text>
          </View>
          
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  performanceSection: {
    marginBottom: 24,
  },
  performanceCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: -15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  performanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringContainer: {
    marginRight: 24,
  },
  ringBackground: {
    borderWidth: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringFill: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: 'transparent',
  },
  ringInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    fontWeight: 'bold',
  },
  performanceStats: {
    flex: 1,
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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