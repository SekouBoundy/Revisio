// app/_tabs/dashboard/DEF/index.js
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../constants/ThemeContext';

export default function DEFDashboardScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
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
});