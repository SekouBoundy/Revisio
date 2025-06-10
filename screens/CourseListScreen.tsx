// path: screens/CourseListScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { coursesByLevelStream } from "../data/coursesByLevelStream";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";

type RouteParams = {
  level: "DEF" | "BAC";
  stream: string;
};

const CourseListScreen = () => {
  const router = useRouter();
  const { level, stream } = useLocalSearchParams<RouteParams>();

  const levelData = coursesByLevelStream[level as keyof typeof coursesByLevelStream];
  const courses = levelData[stream as keyof typeof levelData];

  const handleCoursePress = (courseId: string) => {
    router.push({
      pathname: "/CourseDetailsScreen",
      params: {
        level,
        stream,
        courseId,
      },
    });
  };
  const handleNotePress = (note: any) => {
  if (!note.isDownloaded) {
    // Show alert
    alert("Vous devez d'abord télécharger cette note avant de la consulter.");
    return; // Stop here → do not open PDF
  }

  // If downloaded → open PDF
  router.push({
    pathname: "/PDFViewerScreen",
    params: {
      url: note.downloadUrl,
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
