import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input(props) {
  return (
    <TextInput
      style={[styles.input, props.style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    fontSize: 16,
  },
});
