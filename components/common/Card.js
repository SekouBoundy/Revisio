// components/common/Card.js
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Theme from '../../constants/Theme';

/**
 * Custom Card component for displaying content in a card format
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {function} props.onPress - Function to call when card is pressed
 * @param {Object} props.style - Additional styles for the card container
 * @param {Object} props.contentStyle - Additional styles for the content area
 * @param {boolean} props.elevated - Whether to add elevation/shadow
 * @param {string} props.variant - Card variant (default, outlined, filled)
 * @param {ReactNode} props.rightElement - Element to display on the right side of header
 * @param {boolean} props.disabled - Whether card is disabled/non-interactive
 */
const Card = ({
  children,
  title,
  subtitle,
  onPress,
  style = {},
  contentStyle = {},
  elevated = false,
  variant = 'default',
  rightElement,
  disabled = false,
}) => {
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Define base card styles based on variant
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.card,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filled: {
      backgroundColor: theme.colors.primary + '10', // Primary color with 10% opacity
      borderWidth: 0,
    },
  };

  // Container for the card content
  const CardContainer = ({ children }) => (
    <View
      style={[
        styles.container,
        variantStyles[variant],
        elevated && styles.elevated,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
    </View>
  );

  // If onPress is provided, wrap with TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <CardContainer>
          {(title || subtitle) && (
            <View style={styles.header}>
              <View style={styles.headerTextContainer}>
                {title && (
                  <Text
                    style={[styles.title, { color: theme.colors.text }]}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text
                    style={[styles.subtitle, { color: theme.colors.text + '80' }]}
                    numberOfLines={2}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
              {rightElement && (
                <View style={styles.rightElement}>{rightElement}</View>
              )}
            </View>
          )}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </CardContainer>
      </TouchableOpacity>
    );
  }

  // If no onPress, render as a regular View
  return (
    <CardContainer>
      {(title || subtitle) && (
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            {title && (
              <Text
                style={[styles.title, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[styles.subtitle, { color: theme.colors.text + '80' }]}
                numberOfLines={2}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {rightElement && (
            <View style={styles.rightElement}>{rightElement}</View>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 0,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  rightElement: {
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
});

export default Card;