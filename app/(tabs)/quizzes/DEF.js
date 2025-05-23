// File: app/(tabs)/quizzes/DEF.js
import React, { useContext } from 'react';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ThemeContext } from '../../../contexts/ThemeContext';

const DEF_QUIZZES = [
  { id: '1', title: 'Quiz 1 – Introduction aux études fondamentales' },
  { id: '2', title: 'Quiz 2 – Concepts avancés' },
];

export default function DEFQuizzesScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Quiz DEF / Études Fondamentales
      </Text>
      <View style={styles.list}>
        {DEF_QUIZZES.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            style={[styles.item, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
            onPress={() => router.push(`/quizzes/DEF/${quiz.id}`)}
          >
            <Text style={[styles.itemText, { color: theme.text }]}>
              {quiz.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  list: {
    flex: 1
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16
  },
  itemText: {
    fontSize: 18,
    textAlign: 'center'
  }
});
