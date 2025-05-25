// File: constants/ThemeContext.js
import React, { createContext, useState, useContext } from 'react';

// Light mode palette
const lightTheme = {
  primary:      '#4E8CEE', // Lively blue (accents/CTAs)
  secondary:    '#2E3A59', // Deep navy (brand/headers)
  accent:       '#F57C00', // Orange (active/highlight)
  neutralDark:  '#424242', // Charcoal (body text/icons)
  neutralLight: '#F5F7FA', // Very light gray (background)
  surface:      '#FFFFFF', // Cards, surfaces
  background:   '#F6F7FB', // App background
  text:         '#1B2127', // Main text (almost black)
  textSecondary:'#52606D', // Subtext, labels
  success:      '#43A047', // Green
  warning:      '#FFB300', // Amber
  error:        '#E53935', // Red
  info:         '#1976D2', // Blue info
};

// Dark mode palette
const darkTheme = {
  primary:      '#4E8CEE', // Same lively blue (accents)
  secondary:    '#8FA9C8', // Muted blue (brand/headers)
  accent:       '#FFA040', // Warm orange (highlights)
  neutralDark:  '#F5F7FA', // Almost white (body text/icons)
  neutralLight: '#2E3A59', // Deep navy (background)
  surface:      '#232A36', // Cards, surfaces (slate)
  background:   '#19202A', // Main app background
  text:         '#F5F7FA', // Main text (white-ish)
  textSecondary:'#B2BFD1', // Subtext
  success:      '#66BB6A', // Light green
  warning:      '#FFD54F', // Light amber
  error:        '#EF5350', // Soft red
  info:         '#64B5F6', // Lighter blue info
};




export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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