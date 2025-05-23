// File: app/courses/DEF/index.js
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../../../constants/ThemeContext';

export default function DEFCoursesScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        DEF / Études Fondamentales
      </Text>
      {/* …your DEF course list goes here… */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
