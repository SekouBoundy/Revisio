// app/_auth/register.js
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import * as Theme from '../../constants/Theme';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentType: '', // BAC, DEF, or Language
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  // Select student type
  const selectStudentType = (type) => {
    handleChange('studentType', type);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Student type validation
    if (!formData.studentType) {
      newErrors.studentType = 'Please select your student type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Here you would implement your actual registration logic
      // For example, calling your API to create a new user
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, immediately log the user in
      await SecureStore.setItemAsync('userToken', 'demo-token-123');
      await SecureStore.setItemAsync('userProfile', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        studentType: formData.studentType
      }));
      
      // Navigate to the main app
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Student type option button
  const StudentTypeOption = ({ type, label, description }) => (
    <TouchableOpacity
      style={[
        styles.studentTypeOption,
        {
          backgroundColor: theme.colors.card,
          borderColor: formData.studentType === type 
            ? theme.colors.primary 
            : theme.colors.border
        }
      ]}
      onPress={() => selectStudentType(type)}
    >
      <View style={styles.studentTypeContent}>
        <Text style={[styles.studentTypeLabel, { color: theme.colors.text }]}>
          {label}
        </Text>
        <Text style={[styles.studentTypeDescription, { color: theme.colors.text + '80' }]}>
          {description}
        </Text>
      </View>
      <View 
        style={[
          styles.radioButton,
          {
            borderColor: formData.studentType === type 
              ? theme.colors.primary 
              : theme.colors.border
          }
        ]}
      >
        {formData.studentType === type && (
          <View 
            style={[
              styles.radioButtonInner,
              { backgroundColor: theme.colors.primary }
            ]} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Stack.Screen options={{ 
          headerShown: false
        }} />
        
        <Header 
          title="Create Account" 
          onBackPress={() => router.replace('/_auth/login')}
        />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Join Revisio
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
            Create an account to track your learning progress
          </Text>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              error={errors.fullName}
            />
            
            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
            />
            
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
              hint="Must be at least 6 characters"
            />
            
            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleChange('confirmPassword', text)}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />
            
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              What are you preparing for?
            </Text>
            
            <StudentTypeOption
              type="BAC"
              label="BAC Exam"
              description="For high school students preparing for the Baccalaureate"
            />
            
            <StudentTypeOption
              type="DEF"
              label="DEF Exam"
              description="For middle school students preparing for the DEF"
            />
            
            <StudentTypeOption
              type="LANGUAGE"
              label="Language Learning"
              description="For students learning English and Arabic"
            />
            
            {errors.studentType && (
              <Text style={styles.errorText}>{errors.studentType}</Text>
            )}
            
            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}
            
            <Button
              label="Create Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: theme.colors.text }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.replace('/_auth/login')}>
                <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                  {' Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  studentTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  studentTypeContent: {
    flex: 1,
    marginRight: 12,
  },
  studentTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentTypeDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  button: {
    marginTop: 24,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});