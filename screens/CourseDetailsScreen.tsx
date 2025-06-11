// path: screens/CourseDetailsScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COURSE_CONTENT } from "../data/courseContentData";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";

const CourseDetailsScreen = () => {
  const router = useRouter();
  const { level, stream, courseId } = useLocalSearchParams<{
    level: string;
    stream: string;
    courseId: string;
  }>();

  const levelData = COURSE_CONTENT[level as keyof typeof COURSE_CONTENT];
  const courseData = levelData?.[courseId as keyof typeof levelData] as any;

  const handleNotePress = (note: any) => {
    if (!note.isDownloaded) {
      Alert.alert(
        "Téléchargement requis",
        "Vous devez d'abord télécharger cette note avant de la consulter.",
        [{ text: "OK" }]
      );
      return;
    }

    router.push({
      pathname: "/PDFViewerScreen",
      params: {
        url: note.downloadUrl,
      },
    });
  };

  const renderNoteItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.noteItem} onPress={() => handleNotePress(item)}>
      <Text style={styles.noteTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Aucun contenu disponible pour ce cours.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Notes</Text>
      <FlatList
        data={courseData?.notes ?? []}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
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
  noteItem: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: 10,
    marginBottom: Spacing.lg,
    elevation: 3,
  },
  noteTitle: {
    fontSize: FontSizes.large,
    color: Colors.primary,
  },
});

export default CourseDetailsScreen;
