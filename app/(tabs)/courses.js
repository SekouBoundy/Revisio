// File: app/(tabs)/courses.js
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContext';


export default function CoursesTabScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
      <Text style={[styles.header, { color: theme.text }]}>Sélectionnez votre filière</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/courses/BAC')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>BAC / Sciences Exactes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/courses/DEF')}
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
