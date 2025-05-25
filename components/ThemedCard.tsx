// components/ThemedCard.tsx
import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../constants/theme/ThemeContext';
import { createThemedStyles } from '../utils/styles';

interface ThemedCardProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function ThemedCard({ title, subtitle, children, style }: ThemedCardProps) {
  const { theme } = useTheme();
  const styles = createThemedStyles(theme);

  return (
    <View style={[styles.modernCard, style]}>
      <Text style={styles.heading2}>{title}</Text>
      {subtitle && <Text style={styles.caption}>{subtitle}</Text>}
      {children}
    </View>
  );
}