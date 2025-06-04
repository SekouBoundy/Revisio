// path: app/screens/LevelListScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../constants/ThemeContext";

const levels = [
  { id: "DEF", title: "DEF" },
  { id: "BAC", title: "BAC" },
];

export default function LevelListScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choisissez votre niveau</Text>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/screens/StreamListScreen",
                params: { level: item.id },
              })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: Spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  header: {
    fontSize: FontSizes.large,
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.medium,
    color: Colors.textPrimary,
  },
});
