// constants/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Colors = {
  primary: "#FFA726",            // Warm orange
  accent: "#FFB74D",             // Lighter orange
  background: "#FFF8F0",         // Soft cream background
  cardBackground: "#FFFFFF",     // Card and surfaces
  info: "#2196F3",               // Info blue (icons, highlights)
  correct: "#66BB6A",            // Success green
  incorrect: "#EF5350",          // Error red
  textPrimary: "#212121",        // Main text (black-ish)
  textSecondary: "#555555",      // Secondary text
  border: "#E0E0E0",             // Borders, dividers
  warning: "#FFC107",            // Yellow for warnings
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

// Light theme colors
const lightTheme = {
  ...Colors,
  surface: Colors.cardBackground,
  neutralDark: "#424242",
  neutralLight: "#FFF8F0",
  text: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  error: Colors.incorrect,
  success: Colors.correct,
  warning: Colors.warning,
  info: Colors.info,
};

// Dark theme colors
const darkTheme = {
  ...Colors,
  background: "#121212",
  cardBackground: "#1E1E1E",
  surface: "#1E1E1E",
  neutralDark: "#E0E0E0",
  neutralLight: "#121212",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  error: "#E57373",
  success: "#81C784",
  info: "#64B5F6",
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (!useSystemTheme) return;
    const currentSystemTheme = Appearance.getColorScheme();
    setIsDarkMode(currentSystemTheme === 'dark');
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
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
          setIsDarkMode(Appearance.getColorScheme() === 'dark');
        } else if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } else {
        setUseSystemTheme(true);
        setIsDarkMode(Appearance.getColorScheme() === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (!useSystemTheme) {
      try {
        await AsyncStorage.setItem('manual_theme', newTheme ? 'dark' : 'light');
      } catch (error) {
        console.error('Error saving manual theme:', error);
      }
    }
  };

  const enableSystemTheme = async () => {
    setUseSystemTheme(true);
    setIsDarkMode(Appearance.getColorScheme() === 'dark');
    try {
      await AsyncStorage.setItem('use_system_theme', JSON.stringify(true));
    } catch (error) {
      console.error('Error enabling system theme:', error);
    }
  };

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
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, enableSystemTheme, enableManualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
export default ThemeContext;
