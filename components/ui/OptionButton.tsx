// path: components/ui/OptionButton.tsx

import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Colors, Spacing, FontSizes } from "../../constants/ThemeContext";

interface OptionButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  highlight?: "correct" | "incorrect" | null;
}

export default function OptionButton({
  label,
  onPress,
  disabled = false,
  highlight = null,
}: OptionButtonProps) {
  let backgroundColor = Colors.cardBackground;
  let borderColor = Colors.border;

  if (highlight === "correct") {
    backgroundColor = Colors.correct;
    borderColor = Colors.correct;
  } else if (highlight === "incorrect") {
    backgroundColor = Colors.incorrect;
    borderColor = Colors.incorrect;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor },
        disabled && { opacity: 0.6 },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: highlight ? "#FFFFFF" : Colors.textPrimary }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: Spacing.xs,
  } as ViewStyle,
  text: {
    fontSize: FontSizes.medium,
    textAlign: "center",
  } as TextStyle,
});
