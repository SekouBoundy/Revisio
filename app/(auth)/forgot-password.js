// File: app/(auth)/forgot-password.js
import { Stack, router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Button from '../../components/common/Button';
import { ThemeContext } from '../../constants/ThemeContext';

export default function ForgotPasswordScreen() {
  const { theme } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call; replace this with your real reset logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage(
        'If an account exists for that email, you’ll receive a reset link shortly.'
      );
    } catch (err) {
      setErrorMessage('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Set header title and colors */}
      <Stack.Screen
        options={{
          title: 'Forgot Password',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.text,
        }}
      />

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

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}

        <Button
          title={
            isLoading ? <ActivityIndicator color={theme.text} /> : 'Reset Password'
          }
          onPress={handleResetPassword}
          disabled={isLoading}
        />

        <View style={styles.bottomRow}>
          <Text style={{ color: theme.text }}>Remembered it? </Text>
          <Text
            style={[styles.linkText, { color: theme.primary }]}
            onPress={() => router.push('/login')}
          >
            Back to Login
          </Text>
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
  },
});
