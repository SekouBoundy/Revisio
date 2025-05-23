import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Button({ title, onPress, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof title === 'string' 
        ? <Text style={styles.text}>{title}</Text> 
        : title}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { /* your styles */ },
  text:   { /* your styles */ },
  disabled: { opacity: 0.5 }
});
