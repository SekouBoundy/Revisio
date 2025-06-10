// path: screens/CourseListScreen.tsx

// Fixed CourseListScreen.tsx
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

  // Fixed: Navigate to the existing course detail screen
  const handleCoursePress = (courseId: string) => {
    const courseName = courseId.replace(/\s+/g, '_');
    router.push(`/(tabs)/courses/${level}/${courseName}`);
  };

  // This function is for when you click on individual notes/documents, not courses
  const handleNotePress = (note: any) => {
    if (!note.isDownloaded) {
      alert("Vous devez d'abord télécharger cette note avant de la consulter.");
      return;
    }

    router.push({
    pathname: '/pdf-viewer',  // Changed from '/screens/PDFViewerScreen'
    params: {
    url: note.downloadUrl,
    title: note.title
  }
});
  };

  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity 
      style={styles.courseItem} 
      onPress={() => handleCoursePress(item.id)}
    >
      <Text style={styles.courseTitle}>{item.title}</Text>
      <View style={styles.courseArrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: FontSizes.large,
    color: Colors.primary,
    flex: 1,
  },
  courseArrow: {
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default CourseListScreen;