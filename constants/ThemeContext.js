// constants/ThemeContext.js - UPDATED WITH MASCOT COLORS
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep these for compatibility with older components
export const Colors = {
  primary: "#FFA726",           // Warm orange
  background: "#FFF8F0",        // Light warm background
  cardBackground: "#FFFFFF",    // Cards & surfaces
  correct: "#66BB6A",           // Success green
  incorrect: "#EF5350",         // Error red
  textPrimary: "#212121",       // Main text
  textSecondary: "#555555",     // Secondary text
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

// Light theme → mascot colors
const lightTheme = {
  primary: '#FFA726',           // Warm orange
  secondary: '#4E342E',         // Deep brown
  accent: '#FFB74D',            // Accent orange
  neutralDark: '#424242',
  neutralLight: '#FFF8F0',      // Light background
  surface: '#FFFFFF',           // Cards & surfaces
  background: '#FFF8F0',        // App background
  text: '#212121',              // Main text
  textSecondary: '#555555',     // Secondary text
  success: '#66BB6A',           // Green
  warning: '#FFC107',           // Yellow
  error: '#EF5350',             // Red
  info: '#2196F3',              // Blue info
};

// Dark theme → mascot colors
const darkTheme = {
  primary: '#FFA726',           // Warm orange
  secondary: '#D7CCC8',         // Light brown
  accent: '#FFB74D',            // Accent orange
  neutralDark: '#E0E0E0',
  neutralLight: '#121212',      // Deep dark background
  surface: '#1E1E1E',           // Cards & surfaces
  background: '#121212',        // App background dark
  text: '#FFFFFF',              // Main text
  textSecondary: '#AAAAAA',     // Secondary text
  success: '#81C784',           // Light green
  warning: '#FFC107',           // Yellow
  error: '#E57373',             // Light red
  info: '#64B5F6',              // Light blue
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

  // Apply theme
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
