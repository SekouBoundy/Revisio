// path: components/ui/ProgressBar.tsx

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../../constants/ThemeContext";

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export default function ProgressBar({ progress, height = 8 }: ProgressBarProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.filler, { width: `${Math.round(progress * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  } as ViewStyle,
  filler: {
    backgroundColor: Colors.primary,
    height: "100%",
  } as ViewStyle,
});
