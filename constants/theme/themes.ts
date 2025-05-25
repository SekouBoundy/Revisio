// constants/theme/themes.ts
import { Theme } from './types';

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#1976D2',
    secondary: '#DC1637',
    accent: '#FFC107',
    
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceVariant: '#E3F2FD',
    
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#BDBDBD',
    
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    neutralLight: '#F5F5F5',
    neutralDark: '#424242',
    
    pressed: 'rgba(25, 118, 210, 0.12)',
    disabled: '#E0E0E0',
    border: '#E0E0E0',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    ...lightTheme.colors,
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textTertiary: '#666666',
    
    neutralLight: '#2C2C2C',
    neutralDark: '#F5F5F5',
    
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};
