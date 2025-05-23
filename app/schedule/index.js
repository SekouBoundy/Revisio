// File: app/schedule/index.js
import { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Votre Emploi du Temps
      </Text>
      <View style={styles.content}>
        {/* …render your schedule here… */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header:    { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  content:   { flex: 1 },
});
