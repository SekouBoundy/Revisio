// constants/Theme.ts
// Try importing with default imports
import Colors from './Colors';
import Layout from './Layout';

// Helper to get the current theme colors
const getThemeColors = (isDarkMode = false) => {
  return isDarkMode ? Colors.dark : Colors.light;
};

// Create a theme that uses the current color scheme
const createTheme = (isDarkMode = false) => {
  const currentColors = getThemeColors(isDarkMode);

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

export { createTheme, getThemeColors };

