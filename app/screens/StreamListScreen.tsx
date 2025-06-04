// path: app/screens/StreamListScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../../constants/ThemeContext";

type RouteParams = {
  level: "DEF" | "BAC";
};

const streamsByLevel: Record<string, { id: string; title: string }[]> = {
  DEF: [{ id: "__NONE__", title: "Cours DISPONIBLES" }],
  BAC: [
    { id: "Sciences_Exactes_TSE", title: "Sciences Exactes (TSE)" },
    { id: "Sciences_Expérimentales_TSEXP", title: "Sciences Expérimentales (TSEXP)" },
    { id: "Sciences_Économiques_TSECO", title: "Sciences Économiques (TSECO)" },
    { id: "Sciences_Sociales_TSS", title: "Sciences Sociales (TSS)" },
    { id: "Arts_et_Lettres_TAL", title: "Arts et Lettres (TAL)" },
    { id: "Langues_et_Lettres_TLL", title: "Langues et Lettres (TLL)" },
    {
      id: "Sciences_Technologies_Industrielles_STI",
      title: "Sc. & Tech. Industrielles (STI)",
    },
    {
      id: "Sciences_Technologies_Gestion_STG",
      title: "Sc. & Tech. Gestion (STG)",
    },
  ],
};

export default function StreamListScreen() {
  const { level } = useLocalSearchParams<RouteParams>();
  const router = useRouter();

  if (!level || !streamsByLevel[level]) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Niveau invalide. Revenez en arrière.</Text>
      </View>
    );
  }

  const streams = streamsByLevel[level];
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {level === "DEF" ? "Cours DEF" : "Choisissez votre filière BAC"}
      </Text>
      <FlatList
        data={streams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/screens/CourseListScreen",
                params: { level, stream: item.id === "__NONE__" ? "" : item.id },
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
  errorText: {
    fontSize: FontSizes.medium,
    color: Colors.incorrect,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
