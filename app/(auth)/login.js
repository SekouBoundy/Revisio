// File: app/(auth)/login.js
import React, { useState, useContext } from 'react';
import { Stack, useRouter } from 'expo-router';
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
import { useAuth } from '../../constants/AuthContext';
import { ThemeContext } from '../../constants/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
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
      await login(email, password);        // your auth logic
      router.replace('/dashboard');        // navigate on success
    } catch (err) {
      setErrorMessage('Invalid credentials.');
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
        <Text style={[styles.label, { color: theme.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.background === '#FFF' ? '#f0f0f0' : '#333' }]}
          placeholder="you@example.com"
          placeholderTextColor={`${theme.text}80`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>Password</Text>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.background === '#FFF' ? '#f0f0f0' : '#333' }]}
          placeholder="••••••"
          placeholderTextColor={`${theme.text}80`}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Button
          title={ isLoading 
                    ? <ActivityIndicator color={theme.text} /> 
                    : 'Login' }
          onPress={handleLogin}
          disabled={isLoading}
        />

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Register</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.text }}> | </Text>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={[styles.linkText, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { marginBottom: 8, fontSize: 16, fontWeight: '500' },
  input: { height: 48, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  errorText: { color: 'red', marginBottom: 8 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  linkText: { fontWeight: 'bold', fontSize: 16 },
});
