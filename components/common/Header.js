// components/common/Header.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Theme from '../../constants/Theme';

/**
 * Custom Header component for consistent navigation headers
 * @param {Object} props - Component props
 * @param {string} props.title - Header title
 * @param {boolean} props.showBackButton - Whether to show back button
 * @param {function} props.onBackPress - Custom back button handler
 * @param {React.ReactNode} props.rightElement - Element to display on the right side
 * @param {boolean} props.transparent - Whether header should be transparent
 * @param {Object} props.style - Additional styles for the header container
 * @param {Object} props.titleStyle - Additional styles for the title text
 */
const Header = ({
  title,
  showBackButton = true,
  onBackPress,
  rightElement,
  transparent = false,
  style = {},
  titleStyle = {},
}) => {
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: transparent ? 'transparent' : theme.colors.background }}>
      <StatusBar
        barStyle={transparent ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : theme.colors.background}
        translucent={transparent}
      />
      <View 
        style={[
          styles.header, 
          { backgroundColor: transparent ? 'transparent' : theme.colors.background },
          style
        ]}
      >
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons 
                name="chevron-back" 
                size={24} 
                color={transparent ? '#FFFFFF' : theme.colors.text} 
              />
            </TouchableOpacity>
          )}
        </View>

        <Text 
          style={[
            styles.title, 
            { color: transparent ? '#FFFFFF' : theme.colors.text },
            titleStyle
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightContainer}>
          {rightElement || <View style={styles.placeholder} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholder: {
    width: 24,
  },
});

export default Header;