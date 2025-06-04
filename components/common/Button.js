// components/common/Button.js
import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContextContext';

export default function Button({ title, onPress, disabled = false, style = {} }) {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#ccc' : theme.primary },
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof title === 'string' ? (
        <Text style={[styles.buttonText, { color: theme.text }]}>{title}</Text>
      ) : (
        title
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});