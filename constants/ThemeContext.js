// constants/ThemeContext.js - Clean implementation
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext();
export const Colors = {
  primary: "#2E86AB",
  background: "#FFFFFF",
  cardBackground: "#F5F5F5",
  correct: "#27AE60",
  incorrect: "#C0392B",
  textPrimary: "#333333",
  textSecondary: "#555555",
  border: "#DDDDDD",
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

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ✅ Only load theme on mount, no navigation
  useEffect(() => {
    loadThemePreference();
  }, []); // Empty dependency array

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

// Clean usage in profile screen:
// app/(tabs)/profile.js
export default function ProfileScreen() {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  // ✅ No navigation-related useEffect with theme dependency
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Your profile content */}
      
      <SwitchItem
        icon="moon"
        title="Mode sombre"
        value={isDarkMode}
        onToggle={toggleTheme} // ✅ Direct function reference, no wrapper
        iconColor={theme.primary}
      />
    </SafeAreaView>
  );
}