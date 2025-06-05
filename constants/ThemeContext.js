// constants/ThemeContext.js - FIXED VERSION
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Export these constants that other files expect
export const Colors = {
  primary: "#4E8CEE",
  background: "#F6F7FB",
  cardBackground: "#FFFFFF",
  correct: "#27AE60",
  incorrect: "#C0392B",
  textPrimary: "#1B2127",
  textSecondary: "#52606D",
  border: "#E0E0E0",
};

export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const ThemeContext = createContext(null);

// Light theme
const lightTheme = {
  primary: '#4E8CEE',
  secondary: '#2E3A59',
  accent: '#F57C00',
  neutralDark: '#424242',
  neutralLight: '#F5F7FA',
  surface: '#FFFFFF',
  background: '#F6F7FB',
  text: '#1B2127',
  textSecondary: '#52606D',
  success: '#43A047',
  warning: '#FFB300',
  error: '#E53935',
  info: '#1976D2',
};

// Dark theme
const darkTheme = {
  primary: '#4E8CEE',
  secondary: '#8FA9C8',
  accent: '#FFA040',
  neutralDark: '#F5F7FA',
  neutralLight: '#2E3A59',
  surface: '#232A36',
  background: '#19202A',
  text: '#F5F7FA',
  textSecondary: '#B2BFD1',
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#64B5F6',
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference on startup
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    console.log('🎨 Theme toggle - Before:', isDarkMode);
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      console.log('🎨 Theme toggle - After:', newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // ✅ FIX: Actually switch between themes based on isDarkMode
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
export default ThemeContext;