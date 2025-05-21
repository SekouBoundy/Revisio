// app/_tabs/dashboard/BAC/index.js
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../constants/ThemeContext';

export default function BACDashboardScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  
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
        
        {/* BAC Student Content - More detailed UI */}
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
            <Text style={[styles.continueTitle, {color: theme.text}]}>Cours en cours</Text>
          </TouchableOpacity>
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