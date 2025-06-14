// constants/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Color theme presets - your current orange as default
const colorThemes = {
  orange: {
    primary: "#FFA726",
    accent: "#FFB74D",
    name: "Orange Chaleureux"
  },
  blue: {
    primary: "#2196F3", 
    accent: "#64B5F6",
    name: "Bleu Professionnel"
  },
  green: {
    primary: "#4CAF50",
    accent: "#81C784", 
    name: "Vert Nature"
  },
  purple: {
    primary: "#9C27B0",
    accent: "#BA68C8",
    name: "Violet Créatif"
  }
};

// Base colors that don't change with theme
const baseColors = {
  background: "#FFF8F0",         // Your perfect cream background
  cardBackground: "#FFFFFF",     
  info: "#2196F3",               
  correct: "#66BB6A",            // Keep these consistent for UX
  incorrect: "#EF5350",          
  textPrimary: "#212121",        
  textSecondary: "#555555",      
  border: "#E0E0E0",             
  warning: "#FFC107",
};

export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  xl: 24,        // Added for headers
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,       // Added for larger spacing
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [selectedColorTheme, setSelectedColorTheme] = useState('blue');

  // Create dynamic Colors object based on selected theme
  const Colors = {
    ...baseColors,
    primary: colorThemes[selectedColorTheme].primary,
    accent: colorThemes[selectedColorTheme].accent,
  };

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
    // Add some opacity variants for better UI
    primaryLight: Colors.primary + '20',  // 20% opacity
    primaryDark: Colors.primary + 'DD',   // Darker variant
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
    primaryLight: Colors.primary + '30',
    primaryDark: Colors.primary + 'BB',
  };

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
      const savedColorTheme = await AsyncStorage.getItem('color_theme');
      
      if (savedColorTheme && colorThemes[savedColorTheme]) {
        setSelectedColorTheme(savedColorTheme);
      }
      
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

  const changeColorTheme = async (themeKey) => {
    if (colorThemes[themeKey]) {
      setSelectedColorTheme(themeKey);
      try {
        await AsyncStorage.setItem('color_theme', themeKey);
      } catch (error) {
        console.error('Error saving color theme:', error);
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
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      toggleTheme, 
      enableSystemTheme, 
      enableManualTheme,
      selectedColorTheme,
      changeColorTheme,
      availableThemes: colorThemes,
      Colors,  // Export dynamic Colors
      FontSizes,
      Spacing
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
export default ThemeContext;