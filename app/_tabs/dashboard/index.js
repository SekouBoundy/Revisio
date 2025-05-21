// app/_tabs/dashboard/index.js
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';
import { UserContext } from '../../../constants/UserContext';

// Simple components for level-specific content
const DEFOnly = ({ children }) => {
  const userContext = useContext(UserContext);
  const studentLevel = userContext?.studentLevel;
  return studentLevel === 'DEF' ? <>{children}</> : null;
};

const BACOnly = ({ children }) => {
  const userContext = useContext(UserContext);
  const studentLevel = userContext?.studentLevel;
  return studentLevel === 'BAC' ? <>{children}</> : null;
};

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const userContext = useContext(UserContext);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Common Header */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, {color: theme.text}]}>Bonjour, étudiant 👋</Text>
          <Text style={[styles.dateText, {color: theme.textSecondary}]}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        
        {/* DEF Student Content - Simplified UI */}
        <DEFOnly>
          <View style={styles.defContentContainer}>
            <View style={[styles.defProgressCard, { backgroundColor: theme.cardBackground || '#F9FAFB' }]}>
              <Text style={[styles.defCardTitle, { color: theme.text }]}>Mon Progrès</Text>
              <View style={styles.defProgressBar}>
                <View style={[styles.defProgressFill, { width: '65%' }]} />
              </View>
              <Text style={[styles.defProgressText, { color: theme.textSecondary }]}>65% complété</Text>
              
              <View style={styles.defActionButtons}>
                <TouchableOpacity 
                  style={[styles.defActionButton, { backgroundColor: '#4361FF' }]}
                  onPress={() => router.push('/_tabs/courses')}
                >
                  <Text style={styles.defActionButtonText}>Continuer</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Simple Courses Section */}
            <Text style={[styles.defSectionTitle, { color: theme.text }]}>Mes Cours</Text>
            <View style={styles.defCoursesList}>
              {/* Course cards would go here */}
            </View>
          </View>
        </DEFOnly>
        
        {/* BAC Student Content - More detailed UI */}
        <BACOnly>
          {/* Progress Summary */}
          <View style={styles.progressSection}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Votre progression</Text>
            
            <View style={[styles.progressCard, {backgroundColor: theme.cardBackground || '#F9FAFB'}]}>
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
          
          {/* Continue Learning Section */}
          <View style={styles.continueSection}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>Continuez à apprendre</Text>
            
            <TouchableOpacity 
              style={[styles.continueCard, {backgroundColor: theme.cardBackground || '#F9FAFB'}]}
              onPress={() => router.push('/_tabs/courses')}
            >
              {/* Course continuation card content */}
              <Text style={[styles.continueTitle, {color: theme.text}]}>Cours en cours</Text>
            </TouchableOpacity>
          </View>
        </BACOnly>
      </ScrollView>
    </SafeAreaView>
  );
}

// Add all your existing styles here
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
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
  
  // DEF styles - simpler, more visual
  defContentContainer: {
    marginBottom: 24,
  },
  defProgressCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  defCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  defProgressBar: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  defProgressFill: {
    height: '100%',
    backgroundColor: '#4361FF',
    borderRadius: 10,
  },
  defProgressText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  defActionButtons: {
    alignItems: 'center',
  },
  defActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  defActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  defSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  defCoursesList: {
    // Styles for course list
  },
  
  // BAC styles - more detail and statistics
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
    padding: 16,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
});