// path: screens/PDFViewerScreen.tsx

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "../constants/ThemeContext";

const PDFViewerScreen = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  return (
    <View style={styles.container}>
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
  webview: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default PDFViewerScreen;
