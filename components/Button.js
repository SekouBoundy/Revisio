// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../constants/ThemeContext';

export default function Button({ title, onPress, disabled }) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? theme.border : theme.primary },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
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
