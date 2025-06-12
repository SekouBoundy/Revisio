// path: screens/QuizzesScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { COURSE_CONTENT } from "../data/courseContentData";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";

export default function QuizzesScreen() {
  const router = useRouter();

  const level = "DEF"; // For now → you can make this dynamic later (BAC, DEF)
  const stream = ""; // For now → not needed for DEF
  const levelData = COURSE_CONTENT[level];

  const courses = Object.keys(levelData);

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/CourseQuizScreen",
      params: {
        level,
        stream,
        courseId,
      },
    });
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress(item)}>
      <Text style={styles.courseTitle}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Explorer par matière</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item}
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
  courseItem: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.lg,
    elevation: 3,
  },
  courseTitle: {
    fontSize: FontSizes.large,
    color: Colors.primary,
  },
});
