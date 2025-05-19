// constants/Theme.ts
import * as Colors from './Colors';
import * as Layout from './Layout';

// Helper to get the current theme colors
export const getThemeColors = (isDarkMode = false) => {
  return isDarkMode ? Colors.dark : Colors.light;
};

// Create a theme that uses the current color scheme
export const createTheme = (isDarkMode = false) => {
  const currentColors = getThemeColors(isDarkMode);

  // Make sure we're actually returning a theme object with all required properties
  return {
    colors: {
      primary: '#4361FF',      // Main brand color
      // Add other color definitions here
      background: currentColors.background,
      text: currentColors.text,
      card: currentColors.card,
      border: currentColors.border,
      notification: currentColors.notification,
    },
    // Add other theme properties as needed
    spacing: Layout.spacing,
    fontSize: Layout.fontSize,
    borderRadius: Layout.borderRadius,
  };
};

// Also export a default theme
const Theme = {
  createTheme,
  getThemeColors
};

export default Theme;
