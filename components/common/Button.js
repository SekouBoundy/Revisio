// components/common/Button.js
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Theme from '../../constants/Theme';

/**
 * Custom Button component with various styles and states
 * @param {Object} props - Component props
 * @param {string} props.label - Button text
 * @param {function} props.onPress - Function to call when button is pressed
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'text')
 * @param {boolean} props.isLoading - Whether to show loading indicator
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {Object} props.style - Additional styles to apply
 * @param {Object} props.textStyle - Additional styles for button text
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left side
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right side
 */
const Button = ({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style = {},
  textStyle = {},
  size = 'medium',
  leftIcon,
  rightIcon,
}) => {
  // Use try-catch in case Theme functions are undefined
  let theme;
  try {
    theme = Theme.createTheme(false); // Pass true for dark mode
  } catch (error) {
    console.error('Error creating theme:', error);
    // Fallback theme in case theme creation fails
    theme = {
      colors: {
        primary: '#4361FF',
        text: '#000000',
        background: '#FFFFFF'
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      borderRadius: {
        sm: 8,
        md: 12,
        lg: 16
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18
      }
    };
  }
  
  // Define base styles based on size
  const sizeStyles = {
    small: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.fontSize.xs,
    },
    medium: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      fontSize: theme.fontSize.md,
    },
    large: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.fontSize.lg,
    },
  };
  
  // Define variant styles
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: '#6C757D',
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    text: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 0,
    },
  };
  
  // Define text styles based on variant
  const textVariantStyles = {
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: '#FFFFFF',
    },
    outline: {
      color: theme.colors.primary,
    },
    text: {
      color: theme.colors.primary,
    },
  };
  
  // Apply styles based on disabled state
  const disabledStyles = disabled
    ? {
        opacity: 0.6,
      }
    : {};
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        sizeStyles[size],
        variantStyles[variant],
        disabledStyles,
        style,
      ]}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <React.Fragment>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles[size].fontSize },
              textVariantStyles[variant],
              textStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;