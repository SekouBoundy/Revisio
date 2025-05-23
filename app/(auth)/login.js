// File: app/(auth)/login.js
import React, { useState, useContext } from 'react';
import { Stack, router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';

export default function LoginScreen() {
  const { theme } = useContext(ThemeContext);
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      // Replace with your real authentication logic
      await login(email, password);
      router.replace('/dashboard');
    } catch (error) {
      setErrorMessage('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: 'Login',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.text,
        }}
      />
      <Header title="Login" />

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
          value={email}
          onChangeText={setEmail}
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <Button
          title={
            isLoading ? <ActivityIndicator color={theme.text} /> : 'Login'
          }
          onPress={handleLogin}
          disabled={isLoading}
        />

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Register</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.text }}>  |  </Text>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Forgot Password?</Text>
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
