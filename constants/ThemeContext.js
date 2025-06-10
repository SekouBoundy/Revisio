// constants/ThemeContext.js - SIMPLIFIED SYSTEM THEME
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
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

// Light theme
const lightTheme = {
  primary: '#FFA726',
  secondary: '#4E342E',
  accent: '#FFB74D',
  neutralDark: '#424242',
  neutralLight: '#FFF8F0',
  surface: '#FFFFFF',
  background: '#FFF8F0',
  text: '#212121',
  textSecondary: '#555555',
  success: '#66BB6A',
  warning: '#FFC107',
  error: '#EF5350',
  info: '#2196F3',
};

// Dark theme
const darkTheme = {
  primary: '#FFA726',
  secondary: '#D7CCC8',
  accent: '#FFB74D',
  neutralDark: '#E0E0E0',
  neutralLight: '#121212',
  surface: '#1E1E1E',
  background: '#121212',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  success: '#81C784',
  warning: '#FFC107',
  error: '#E57373',
  info: '#64B5F6',
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  // Load settings on startup
  useEffect(() => {
    loadThemeSettings();
  }, []);

  // Listen to system theme changes when enabled
  useEffect(() => {
    if (!useSystemTheme) return;

    // Set initial system theme
    const currentSystemTheme = Appearance.getColorScheme();
    setIsDarkMode(currentSystemTheme === 'dark');

    // Listen for changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('🎨 System theme changed to:', colorScheme);
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, [useSystemTheme]);

  const loadThemeSettings = async () => {
    try {
      const savedUseSystem = await AsyncStorage.getItem('use_system_theme');
      const savedTheme = await AsyncStorage.getItem('manual_theme');
      
      if (savedUseSystem !== null) {
        const useSystem = JSON.parse(savedUseSystem);
        setUseSystemTheme(useSystem);
        
        if (useSystem) {
          // Use system theme
          const systemTheme = Appearance.getColorScheme();
          setIsDarkMode(systemTheme === 'dark');
        } else if (savedTheme) {
          // Use manual theme
          setIsDarkMode(savedTheme === 'dark');
        }
      } else {
        // Default: use system theme
        const systemTheme = Appearance.getColorScheme();
        setIsDarkMode(systemTheme === 'dark');
        setUseSystemTheme(true);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  // Toggle theme (works in both modes)
  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (!useSystemTheme) {
      // Save manual preference
      try {
        await AsyncStorage.setItem('manual_theme', newTheme ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving manual theme:', error);
      }
    }
    // If using system theme, just toggle temporarily (will reset on next system change)
  };

  // Switch to system theme mode
  const enableSystemTheme = async () => {
    setUseSystemTheme(true);
    
    // Apply current system theme
    const systemTheme = Appearance.getColorScheme();
    setIsDarkMode(systemTheme === 'dark');
    
    try {
      await AsyncStorage.setItem('use_system_theme', JSON.stringify(true));
    } catch (error) {
      console.error('Error enabling system theme:', error);
    }
  };

  // Switch to manual theme mode
  const enableManualTheme = async () => {
    setUseSystemTheme(false);
    
    try {
      await AsyncStorage.setItem('use_system_theme', JSON.stringify(false));
      await AsyncStorage.setItem('manual_theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error enabling manual theme:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

return (
  <ThemeContext.Provider value={{ theme }}>
    {children}
  </ThemeContext.Provider>
);

}

export { ThemeContext };
export default ThemeContext;