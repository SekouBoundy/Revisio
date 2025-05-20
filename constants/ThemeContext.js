// constants/ThemeContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

// Define theme colors
export const lightTheme = {
  background: '#FFFFFF',
  cardBackground: '#F9FAFB',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#4361FF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  inputBackground: '#F9FAFB'
};

export const darkTheme = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  text: '#F3F4F6',
  textSecondary: '#9CA3AF',
  border: '#374151',
  primary: '#4361FF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  inputBackground: '#2C2C2C'
};

// Create the context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    saveThemePreference();
  }, [isDarkMode]);
  
  // Load theme from storage
  const loadThemePreference = async () => {
    try {
      const value = await AsyncStorage.getItem('@theme_mode');
      if (value !== null) {
        setIsDarkMode(value === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference', error);
    }
  };
  
  // Save theme to storage
  const saveThemePreference = async () => {
    try {
      await AsyncStorage.setItem('@theme_mode', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference', error);
    }
  };
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Get current theme
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
