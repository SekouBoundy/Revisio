// app/_auth/login.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import { useAuth } from '../../contexts/AuthContext';
import * as Theme from '../../contexts/Theme';

// Make sure this component is exported as default
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const themeColors = Theme.createTheme(false).colors;
  // No need to check isLoggedIn here as it's handled by the root layout

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // For demo purposes, any email/password combination works
      const userData = {
        email,
        name: email.split('@')[0], // Use part of email as name for demo
        studentType: 'BAC' // Default student type
      };

      const success = await signIn(userData);
      if (success) {
        router.replace('/(tabs)/dashboard');
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Stack.Screen options={{ 
          headerShown: false
        }} />
        
        <Header 
          title="Login"
          showBackButton={false}
        />
        
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {/* Try to load logo if it exists, otherwise just show app name */}
            <Text style={[styles.appName, { color: themeColors.text }]}>Revisio</Text>
            <Text style={[styles.tagline, { color: themeColors.text }]}>
              Your Learning Companion
            </Text>
          </View>
          
          <View style={styles.form}>
            <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: themeColors.card,
                  color: themeColors.text,
                  borderColor: themeColors.border
                }
              ]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
              }}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <Text style={[styles.label, { color: themeColors.text }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  { 
                    backgroundColor: themeColors.card,
                    color: themeColors.text,
                    borderColor: themeColors.border
                  }
                ]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage('');
                }}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20} 
                  color={themeColors.primary}
                />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              onPress={() => router.push('/_auth/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={{ color: themeColors.primary }}>Forgot Password?</Text>
            </TouchableOpacity>
            
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            <Button
              label="Login"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: themeColors.text }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/_auth/register')}>
                <Text style={[styles.registerLink, { color: themeColors.primary }]}>
                  {' Register'}
                </Text>
              </TouchableOpacity>
            </View>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
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
  passwordContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 50,
    marginBottom: 0,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 0,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  button: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 15,
  },
  registerLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
});