// File: app/(auth)/register.js
import React, { useState, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function RegisterScreen() {
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Simple validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Registration successful! You can now login.');
      setFormData({ email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="Register" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background === '#FFF' ? '#f0f0f0' : '#333',
              color: theme.text,
            },
          ]}
          placeholder="you@example.com"
          placeholderTextColor={`${theme.text}80`}
          value={formData.email}
          onChangeText={val => handleChange('email', val)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background === '#FFF' ? '#f0f0f0' : '#333',
              color: theme.text,
            },
          ]}
          placeholder="Enter your password"
          placeholderTextColor={`${theme.text}80`}
          value={formData.password}
          onChangeText={val => handleChange('password', val)}
          secureTextEntry
        />

        <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background === '#FFF' ? '#f0f0f0' : '#333',
              color: theme.text,
            },
          ]}
          placeholder="Confirm your password"
          placeholderTextColor={`${theme.text}80`}
          value={formData.confirmPassword}
          onChangeText={val => handleChange('confirmPassword', val)}
          secureTextEntry
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}

        <Button
          title={
            isLoading ? <ActivityIndicator color={theme.text} /> : 'Register'
          }
          onPress={handleRegister}
          disabled={isLoading}
        />

        <View style={styles.bottomRow}>
          <Text style={{ color: theme.text }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  linkText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
