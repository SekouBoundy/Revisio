// components/common/Header.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContextContext';

export default function Header({ title }) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});