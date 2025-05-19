import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Theme from '../../constants/Theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async () => {
    // Reset error state
    setError('');

    // Validate input
    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful password reset request (in a real app, call your API here)
      setIsSubmitted(true);
    } catch (err) {
      setError('Password reset request failed. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToLogin = () => {
    router.replace('/_auth/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <Header
        title="Forgot Password"
        showBack={true}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isSubmitted ? (
          <>
            <Text style={styles.heading}>Reset Your Password</Text>
            <Text style={styles.subheading}>
              Enter your email address and we'll send you instructions to reset your password
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

              <Button
                onPress={handleResetPassword}
                loading={isLoading}
                fullWidth
                style={styles.resetButton}
              >
                Reset Password
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.heading}>Check Your Email</Text>
            <Text style={styles.subheading}>
              We've sent password reset instructions to {email}
            </Text>
            <Text style={styles.instructionText}>
              If you don't see the email in your inbox, please check your spam folder.
            </Text>
            
            <Button
              onPress={handleReturnToLogin}
              fullWidth
              style={styles.returnButton}
            >
              Return to Login
            </Button>
          </View>
        )}
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
  resetButton: {
    marginTop: Theme.layout.spacing.lg,
  },
  returnButton: {
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
  successContainer: {
    paddingVertical: Theme.layout.spacing.xl,
  },
  instructionText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.layout.fontSize.sm,
    lineHeight: 20,
    marginBottom: Theme.layout.spacing.lg,
  },
});