// File: app/courses/BAC/index.js
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { ThemeContext } from '../../../contexts/ThemeContext';

export default function BACCoursesScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        BAC / Sciences Exactes
      </Text>
      {/* …your BAC course list goes here… */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
