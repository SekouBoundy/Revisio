// components/common/Input.js
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as Theme from '../../constants/Theme';

/**
 * Custom Input component for forms with built-in validation
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {function} props.onChangeText - Function to call when text changes
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.secureTextEntry - Whether to hide text entry
 * @param {string} props.error - Error message to display
 * @param {string} props.hint - Hint text to display below input
 * @param {string} props.keyboardType - Keyboard type to display
 * @param {string} props.autoCapitalize - Auto capitalization behavior
 * @param {boolean} props.multiline - Whether input can have multiple lines
 * @param {Object} props.style - Additional styles for the container
 * @param {Object} props.inputStyle - Additional styles for the input itself
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left side
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right side
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {number} props.maxLength - Maximum length of input
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  hint,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  style = {},
  inputStyle = {},
  leftIcon,
  rightIcon,
  disabled = false,
  maxLength,
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Handle input focus state
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return '#EF4444'; // Red for error
    if (isFocused) return theme.colors.primary; // Primary color when focused
    return theme.colors.border; // Default border color
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: theme.colors.card,
            height: multiline ? 100 : 50,
          },
          isFocused && styles.focused
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          maxLength={maxLength}
          {...otherProps}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      {hint && !error && (
        <Text style={[styles.hintText, { color: theme.colors.text + '80' }]}>
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  multilineInput: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  focused: {
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  hintText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input;
