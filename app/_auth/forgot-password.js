// app/_auth/forgot-password.js
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from '../../components/common/Button';
import * as Theme from '../../constants/Theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const theme = Theme.createTheme(false); // Pass true for dark mode

  const handleResetPassword = async () => {
    // Validate email
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Here you would implement your actual password reset logic
      // For example, calling an API endpoint
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Password reset instructions have been sent to your email');
      // You could navigate back to login after a delay
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (error) {
      setErrorMessage('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Stack.Screen options={{ 
          title: 'Reset Password',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTitleStyle: { color: theme.colors.text },
        }} />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Reset Your Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCompleteType="email"
            />
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}
            
            <Button
              label="Send Reset Instructions"
              onPress={handleResetPassword}
              isLoading={isLoading}
              style={styles.button}
            />
            
            <Button
              label="Back to Login"
              variant="text"
              onPress={() => router.replace('/login')}
              style={styles.linkButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.8,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
  },
  linkButton: {
    marginTop: 12,
    alignSelf: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
  successText: {
    color: '#10B981',
    marginBottom: 16,
  },
});