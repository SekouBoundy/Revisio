// utils/dateUtils.js - DEVELOPMENT HELPER
export const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  
  const weekDates = [];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push({
      day: dayNames[i],
      date: date.getDate(),
      fullDate: new Date(date),
      isToday: date.toDateString() === today.toDateString()
    });
  }
  return weekDates;
};

export const formatScheduleTime = (timeString) => {
  // Convert "08:00-09:00" to readable format
  const [start, end] = timeString.split('-');
  return `${start} - ${end}`;
};

export const isTimeInPast = (timeString) => {
  const now = new Date();
  const [hour, minute] = timeString.split(':').map(Number);
  const timeToday = new Date();
  timeToday.setHours(hour, minute, 0, 0);
  return timeToday < now;
};

// Development helper - mock API delay
export const mockApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// utils/validation.js - FORM VALIDATION HELPERS
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    errors: {
      tooShort: password.length < 6,
      missingUppercase: !/[A-Z]/.test(password),
      missingLowercase: !/[a-z]/.test(password),
      missingNumber: !/\d/.test(password)
    }
  };
};

export const validateName = (name) => {
  return {
    isValid: name.trim().length >= 2,
    error: name.trim().length < 2 ? 'Le nom doit contenir au moins 2 caractères' : null
  };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  return {
    isValid: phoneRegex.test(cleanPhone),
    error: !phoneRegex.test(cleanPhone) ? 'Numéro de téléphone invalide' : null
  };
};

// Validate entire form
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const nameValidation = validateName(formData.name || '');
  if (!nameValidation.isValid) errors.name = nameValidation.error;
  
  if (!validateEmail(formData.email || '')) {
    errors.email = 'Adresse email invalide';
  }
  
  const passwordValidation = validatePassword(formData.password || '');
  if (!passwordValidation.isValid) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// hooks/useDebounce.js - PERFORMANCE HELPER
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/useAsyncStorage.js - SIMPLE DATA PERSISTENCE
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredValue();
  }, [key]);

  const loadStoredValue = async () => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setStoredValue(JSON.parse(value));
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const setValue = async (value) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  return [storedValue, setValue, loading];
};

// components/common/LoadingSpinner.js - REUSABLE LOADING
import React, { useContext } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContextContext';

export const LoadingSpinner = ({ message = 'Chargement...', size = 'large' }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size={size} color={theme.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});

// utils/devHelpers.js - DEVELOPMENT DEBUGGING
export const logUserAction = (action, data) => {
  if (__DEV__) {
    console.log(`🎯 USER ACTION: ${action}`, data);
  }
};

export const logNavigation = (from, to) => {
  if (__DEV__) {
    console.log(`🧭 NAVIGATION: ${from} → ${to}`);
  }
};

export const logApiCall = (endpoint, method, data) => {
  if (__DEV__) {
    console.log(`🌐 API CALL: ${method} ${endpoint}`, data);
  }
};

// Mock data generator for testing
export const generateMockUser = (level = 'DEF') => ({
  id: Date.now().toString(),
  name: 'Test Student',
  email: 'test@example.com',
  level,
  progress: Math.floor(Math.random() * 100),
  coursesCompleted: Math.floor(Math.random() * 10),
  quizzesCompleted: Math.floor(Math.random() * 20)
});

export const generateMockQuizResult = () => ({
  id: Date.now().toString(),
  score: Math.floor(Math.random() * 100),
  timeSpent: Math.floor(Math.random() * 30) + 5, // 5-35 minutes
  completedAt: new Date().toISOString(),
  correctAnswers: Math.floor(Math.random() * 20),
  totalQuestions: 20
});