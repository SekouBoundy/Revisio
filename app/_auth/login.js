import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Theme from '../../constants/Theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Reset error state
    setError('');

    // Validate input
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login (in a real app, call your API here)
      const fakeUserToken = 'fake-auth-token';
      const userData = JSON.stringify({
        id: '123',
        email: email,
        name: 'Test User',
      });

      // Store auth token in secure storage
      await SecureStore.setItemAsync('user_token', fakeUserToken);
      await SecureStore.setItemAsync('user_data', userData);

      // Navigate to tabs
      router.replace('/_tabs');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <Header
        title="Log In"
        showBack={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Welcome Back!</Text>
        <Text style={styles.subheading}>
          Log in to continue your learning journey
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => router.push('/_auth/forgot-password')}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          >
            Log In
          </Button>
        </View>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/_auth/register')}>
            <Text style={styles.registerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
  },
  heading: {
    ...Theme.typography.heading2,
    marginTop: Theme.layout.spacing.lg,
    marginBottom: Theme.layout.spacing.sm,
  },
  subheading: {
    ...Theme.typography.subtitle,
    marginBottom: Theme.layout.spacing.xl,
  },
  form: {
    marginBottom: Theme.layout.spacing.xl,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginVertical: Theme.layout.spacing.md,
  },
  forgotPasswordText: {
    color: Theme.colors.primary,
    fontSize: Theme.layout.fontSize.sm,
  },
  loginButton: {
    marginTop: Theme.layout.spacing.lg,
  },
  errorContainer: {
    backgroundColor: Theme.colors.error + '20', // 20% opacity
    padding: Theme.layout.spacing.md,
    borderRadius: Theme.layout.borderRadius.medium,
    marginBottom: Theme.layout.spacing.lg,
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: Theme.layout.fontSize.sm,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.layout.spacing.xl,
  },
  registerText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.layout.fontSize.sm,
  },
  registerLink: {
    color: Theme.colors.primary,
    fontSize: Theme.layout.fontSize.sm,
    fontWeight: '600',
  },
});