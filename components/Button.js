import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../constants/ThemeContext';

export default function Button({ title, onPress }) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
