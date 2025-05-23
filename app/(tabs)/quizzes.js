// File: app/(tabs)/quizzes.js
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';


export default function QuizzesTabScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
      <Text style={[styles.header, { color: theme.text }]}>Choisissez un Quiz</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/quizzes/BAC')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>BAC / Sciences Exactes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/quizzes/DEF')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>DEF / Études Fondamentales</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  optionsContainer: { flex: 1, justifyContent: 'center' },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionText: { color: '#FFF', fontSize: 18, textAlign: 'center' },
});
