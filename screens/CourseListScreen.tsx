// path: app/screens/CourseListScreen.tsx

import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";

type RouteParams = {
  level: "DEF" | "BAC";
  stream: string; // "" for DEF or e.g. "Sciences_Exactes_TSE"
};

const coursesByLevelStream: Record<
  string,
  Record<string, { id: string; title: string }[]>
> = {
  DEF: {
    "": [
      { id: "Français", title: "Français" },
      { id: "Mathématiques", title: "Mathématiques" },
      { id: "Physique-Chimie", title: "Physique-Chimie" },
      { id: "Histoire-Géographie", title: "Histoire-Géographie" },
      { id: "Sciences_de_la_Vie_et_de_la_Terre", title: "SVT" },
      { id: "Anglais", title: "Anglais" },
      { id: "Éducation_Civique_et_Morale", title: "Éducation Civique et Morale" },
    ],
  },
  BAC: {
    Sciences_Exactes_TSE: [
      { id: "Mathématiques", title: "Mathématiques" },
      { id: "Physique", title: "Physique" },
      { id: "Chimie", title: "Chimie" },
      { id: "Bio_Geo", title: "Bio/Geo" },
      { id: "Français", title: "Français" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Anglais", title: "Anglais" },
    ],
    Sciences_Expérimentales_TSEXP: [
      { id: "Mathématiques", title: "Mathématiques" },
      { id: "Physique_Chimie", title: "Physique/Chimie" },
      { id: "Bio", title: "Biologie" },
      { id: "Geo", title: "Géographie" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Anglais", title: "Anglais" },
    ],
    Sciences_Économiques_TSECO: [
      { id: "Mathématiques_appliquées", title: "Mathématiques appliquées" },
      { id: "Économie", title: "Économie" },
      { id: "Gestion", title: "Gestion" },
      { id: "Droit", title: "Droit" },
      { id: "Français", title: "Français" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Anglais", title: "Anglais" },
      { id: "Histoire-Géographie", title: "Histoire-Géographie" },
      { id: "Éducation_Civique", title: "Éducation Civique" },
    ],
    Sciences_Sociales_TSS: [
      { id: "Sociologie", title: "Sociologie" },
      { id: "Histoire-Géographie", title: "Histoire-Géographie" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Français", title: "Français" },
      { id: "Anglais", title: "Anglais" },
      { id: "Éducation_Civique_et_Morale", title: "Éducation Civique et Morale" },
      { id: "Mathématiques_adaptées", title: "Mathématiques adaptées" },
    ],
    Arts_et_Lettres_TAL: [
      { id: "Littérature", title: "Littérature" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Histoire_de_l’art", title: "Histoire de l’art" },
      { id: "Français", title: "Français" },
      { id: "Anglais", title: "Anglais" },
      { id: "Arts_plastiques_ou_musique", title: "Arts plastiques / Musique" },
      { id: "Histoire-Géographie", title: "Histoire-Géographie" },
    ],
    Langues_et_Lettres_TLL: [
      { id: "Langues_vivantes", title: "Langues vivantes" },
      { id: "Littérature", title: "Littérature" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Histoire-Géographie", title: "Histoire-Géographie" },
      { id: "Français", title: "Français" },
      { id: "Éducation_Civique", title: "Éducation Civique" },
    ],
    Sciences_Technologies_Industrielles_STI: [
      { id: "Mathématiques_appliquées", title: "Mathématiques appliquées" },
      { id: "Physique_appliquée", title: "Physique appliquée" },
      { id: "Technologie_industrielle", title: "Technologie industrielle" },
      { id: "Informatique_industrielle", title: "Informatique industrielle" },
      { id: "Français", title: "Français" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Anglais", title: "Anglais" },
    ],
    Sciences_Technologies_Gestion_STG: [
      { id: "Gestion_et_administration", title: "Gestion et administration" },
      { id: "Comptabilité", title: "Comptabilité" },
      { id: "Économie", title: "Économie" },
      { id: "Mathématiques_appliquées", title: "Mathématiques appliquées" },
      { id: "Droit", title: "Droit" },
      { id: "Français", title: "Français" },
      { id: "Philosophie", title: "Philosophie" },
      { id: "Anglais", title: "Anglais" },
    ],
  },
};

export default function CourseListScreen() {
  const { level, stream } = useLocalSearchParams<RouteParams>();
  const router = useRouter();

  if (
    !level ||
    !coursesByLevelStream[level] ||
    !coursesByLevelStream[level][stream]
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Informations invalides. Revenez en arrière.
        </Text>
      </View>
    );
  }

  const courses = coursesByLevelStream[level][stream];
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {level === "DEF"
          ? "Cours DEF"
          : `Cours BAC (${stream.replace(/_/g, " ")})`}
      </Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/screens/QuizScreen",
                params: { level, stream, course: item.id },
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
