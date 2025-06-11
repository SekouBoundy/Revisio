// path: screens/PDFViewerScreen.tsx

import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, FontSizes, Spacing } from "../constants/ThemeContext";

const PDFViewerScreen = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header with Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visualisation PDF</Text>
      </View>

      {/* PDF WebView */}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: FontSizes.large,
    color: "#fff",
  },
  headerTitle: {
    fontSize: FontSizes.large,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: Spacing.md,
  },
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PDFViewerScreen;
