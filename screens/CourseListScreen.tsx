// path: screens/CourseListScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";
import { coursesByLevelStream } from "../data/coursesByLevelStream";

type RouteParams = {
  level: "DEF" | "BAC";
  stream: string; // "" for DEF or e.g. "Sciences_Exactes_TSE"
};

const CourseListScreen = () => {
  const router = useRouter();
  const { level, stream } = useLocalSearchParams<RouteParams>();

// const courses = coursesByLevelStream[level as keyof typeof coursesByLevelStream][stream as keyof typeof coursesByLevelStream[typeof level]];
  const levelData = coursesByLevelStream[level as keyof typeof coursesByLevelStream];
const courses = levelData[stream as keyof typeof levelData];

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/quiz",
      params: {
        level,
        stream,
        courseId,
      },
    });
  };

  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity style={styles.courseItem} onPress={() => handleCoursePress(item.id)}>
      <Text style={styles.courseTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Cours disponibles ({level})</Text>
      <FlatList
        data={courses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

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


export default CourseListScreen;
