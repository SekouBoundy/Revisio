import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Theme from '../../constants/Theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [learningType, setLearningType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Reset error state
    setError('');

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!learningType) {
      setError('Please select a learning track');
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful registration (in a real app, call your API here)
      const fakeUserToken = 'fake-auth-token';
      const userData = JSON.stringify({
        id: '123',
        email: email,
        name: name,
        learningType: learningType
      });

      // Store auth token in secure storage
      await SecureStore.setItemAsync('user_token', fakeUserToken);
      await SecureStore.setItemAsync('user_data', userData);

      // Navigate to tabs
      router.replace('/_tabs');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const LearningTypeButton = ({ title, value, color }) => (
    <TouchableOpacity
      style={[
        styles.learningTypeButton,
        { borderColor: color },
        learningType === value && { backgroundColor: color + '20' } // 20% opacity
      ]}
      onPress={() => setLearningType(value)}
    >
      <Text
        style={[
          styles.learningTypeText,
          { color },
          learningType === value && styles.selectedLearningTypeText
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <Header
        title="Create Account"
        showBack={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Join Revisio</Text>
        <Text style={styles.subheading}>
          Create an account to start your learning journey
        </Text>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
          />

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
            placeholder="Create a password"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />

          <Text style={styles.learningTypeLabel}>
            Choose Your Learning Track
          </Text>
          
          <View style={styles.learningTypeContainer}>
            <LearningTypeButton
              title="BAC Prep"
              value="bac"
              color={Theme.colors.bac}
            />
            
            <LearningTypeButton
              title="DEF Prep"
              value="def"
              color={Theme.colors.def}
            />
            
            <LearningTypeButton
              title="Languages"
              value="languages"
              color={Theme.colors.languages}
            />
          </View>

          <Button
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            style={styles.registerButton}
          >
            Create Account
          </Button>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/_auth/login')}>
            <Text style={styles.loginLink}>Log In</Text>
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
    paddingBottom: Theme.layout.spacing.xxl * 2,
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
  registerButton: {
    marginTop: Theme.layout.spacing.xl,
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
  learningTypeLabel: {
    ...Theme.typography.subtitle,
    marginTop: Theme.layout.spacing.lg,
    marginBottom: Theme.layout.spacing.md,
  },
  learningTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.layout.spacing.md,
  },
  learningTypeButton: {
    flex: 1,
    padding: Theme.layout.spacing.md,
    borderWidth: 1,
    borderRadius: Theme.layout.borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: Theme.layout.spacing.xs,
  },
  learningTypeText: {
    fontWeight: '500',
  },
  selectedLearningTypeText: {
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Theme.layout.spacing.xl,
  },
  loginText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.layout.fontSize.sm,
  },
  loginLink: {
    color: Theme.colors.primary,
    fontSize: Theme.layout.fontSize.sm,
    fontWeight: '600',
  },
});