// path: screens/CourseQuizScreen.tsx

// import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COURSE_CONTENT } from "../data/courseContentData";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";
import React, { useState, useEffect } from "react";
import { getQuizProgress, setQuizProgress } from "../utils/quizProgress";

export default function CourseQuizScreen() {
  const router = useRouter();
  const { level, stream, courseId } = useLocalSearchParams<{
    level: string;
    stream: string;
    courseId: string;
  }>();

  const levelData = COURSE_CONTENT[level as keyof typeof COURSE_CONTENT];
  const courseData = levelData?.[courseId as keyof typeof levelData] as any;
  const [progressMap, setProgressMap] = useState<{ [key: string]: boolean }>({});


  const handleStartQuiz = (noteId: string) => {
    router.push({
      pathname: "/QuizScreen",
      params: {
        level,
        stream,
        courseId: noteId, // We pass the noteId because QuizScreen loads from `${noteId}Questions.json`
      },
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => handleStartQuiz(item.id)}>
      <Text style={styles.quizTitle}>{item.title}</Text>
      <Text style={styles.quizSubtitle}>Commencer le quiz</Text>
    </TouchableOpacity>
  );

  if (!courseData || !courseData.notes) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Aucun quiz disponible pour ce cours.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Quiz - {courseId}</Text>
      <FlatList
        data={courseData.notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  headerText: {
    fontSize: FontSizes.large,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  listContainer: {
    paddingBottom: Spacing.lg,
  },
  quizItem: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.lg,
    elevation: 3,
  },
  quizTitle: {
    fontSize: FontSizes.large,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  quizSubtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textSecondary,
  },
});
