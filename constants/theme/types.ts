// constants/theme/types.ts
export interface Theme {
  name: 'light' | 'dark';
  colors: {
    // Primary colors
    primary: string;
    secondary: string;
    accent: string;
    
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Neutral colors
    neutralLight: string;
    neutralDark: string;
    
    // Interactive colors
    pressed: string;
    disabled: string;
    border: string;
    
    // Shadow
    shadow: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: {
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    weights: {
      regular: '400';
      medium: '500';
      semibold: '600';
      bold: '700';
    };
  };
}