// app/_tabs/dashboard/index.js
import { useRouter } from 'expo-router';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  
  // Get today's date in a nice format
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', options);
  
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, {color: theme.text}]}>Bonjour, étudiant 👋</Text>
          <Text style={[styles.dateText, {color: theme.textSecondary}]}>{capitalizedDate}</Text>
        </View>
        
        {/* Progress Summary */}
        <View style={styles.progressSection}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Votre progression</Text>
          
          <View style={[styles.progressCard, {backgroundColor: theme.cardBackground}]}>
            <View style={styles.progressInfo}>
              <Text style={[styles.progressPercentage, {color: theme.primary}]}>68%</Text>
              <Text style={[styles.progressLabel, {color: theme.textSecondary}]}>Progression totale</Text>
            </View>
            
            <View style={[styles.progressBarContainer, {backgroundColor: isDarkMode ? '#333' : '#E5E7EB'}]}>
              <View style={[styles.progressBar, { width: '68%' }]} />
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, {color: theme.text}]}>5</Text>
                <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Cours</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, {color: theme.text}]}>23</Text>
                <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Leçons</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={[styles.statValue, {color: theme.text}]}>12</Text>
                <Text style={[styles.statLabel, {color: theme.textSecondary}]}>Quiz</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Continue Learning */}
        <View style={styles.continueSection}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Continuez à apprendre</Text>
          
          <TouchableOpacity 
            style={[styles.continueCard, {backgroundColor: theme.cardBackground}]}
            onPress={() => router.push('/_tabs/courses/def-science')}
          >
            <View style={styles.continueCardContent}>
              <View style={[styles.continueIcon, {backgroundColor: isDarkMode ? '#104940' : '#10B98120'}]}>
                <Text style={styles.emojiIcon}>🧪</Text>
              </View>
              
              <View style={styles.continueInfo}>
                <Text style={[styles.continueTitle, {color: theme.text}]}>DEF Science</Text>
                <Text style={[styles.continueLesson, {color: theme.textSecondary}]}>Leçon 5: Les réactions chimiques</Text>
                <View style={styles.continueLabelContainer}>
                  <Text style={styles.continueLabel}>70% complété</Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.continueProgressBar, {backgroundColor: isDarkMode ? '#333' : '#E5E7EB'}]}>
              <View style={[styles.continueFill, { width: '70%' }]} />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Actions rapides</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, {backgroundColor: theme.cardBackground}]}
              onPress={() => router.push('/_tabs/courses')}
            >
              <Text style={styles.actionEmoji}>📚</Text>
              <Text style={[styles.actionText, {color: theme.text}]}>Tous les cours</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, {backgroundColor: theme.cardBackground}]}
              onPress={() => router.push('/_tabs/quizzes')}
            >
              <Text style={styles.actionEmoji}>🧪</Text>
              <Text style={[styles.actionText, {color: theme.text}]}>Quiz</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, {backgroundColor: theme.cardBackground}]}
              onPress={() => {}}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={[styles.actionText, {color: theme.text}]}>Statistiques</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, {backgroundColor: theme.cardBackground}]}
              onPress={() => router.push('/_tabs/profile')}
            >
              <Text style={styles.actionEmoji}>👤</Text>
              <Text style={[styles.actionText, {color: theme.text}]}>Profil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  progressInfo: {
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4361FF',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4361FF',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  continueSection: {
    marginBottom: 24,
  },
  continueCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  continueIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emojiIcon: {
    fontSize: 24,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  continueLesson: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  continueLabelContainer: {
    flexDirection: 'row',
  },
  continueLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  continueProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  continueFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
});
