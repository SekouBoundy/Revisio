// components/Mascot.js - FIXED VERSION WITH HEADER MASCOT

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Try to load mascot images, with fallbacks
const getMascotSource = (variant) => {
  try {
    switch (variant) {
      case 'full':
        return require('../assets/mascot/mascot_full.png');
      case 'small':
        return require('../assets/mascot/mascot_small.png');
      case 'quizStart':
        return require('../assets/mascot/Quiz-start.png');
      case 'quizFail':
        return require('../assets/mascot/Quiz-fail.png');
      case 'quizSuccess':
        return require('../assets/mascot/Quiz-success.png');
      default:
        return require('../assets/icons/app-icon.png'); // Fallback
    }
  } catch (error) {
    // If mascot images don't exist, try the app icon
    try {
      return require('../assets/icons/app-icon.png');
    } catch (fallbackError) {
      return null; // No image available
    }
  }
};

const mascotSizes = {
  full: { width: 250, height: 250 },
  small: { width: 64, height: 64 },
  header: { width: 48, height: 48 }, // New size for headers
  quizStart: { width: 180, height: 180 },
  quizFail: { width: 180, height: 180 },
  quizSuccess: { width: 200, height: 200 },
};

const mascotEmojis = {
  full: '🦸‍♂️',
  small: '📚',
  header: '🎓', // New emoji for headers
  quizStart: '🎯',
  quizFail: '😔',
  quizSuccess: '🎉',
};

// Main Mascot Component
export default function Mascot({ variant = 'full' }) {
  const source = getMascotSource(variant);
  const size = mascotSizes[variant] || mascotSizes.full;
  const emoji = mascotEmojis[variant] || mascotEmojis.full;

  // If no image source available, show emoji fallback
  if (!source) {
    return (
      <View style={[styles.fallbackContainer, size]}>
        <Text style={styles.fallbackEmoji}>{emoji}</Text>
        <Text style={styles.fallbackText}>R</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[styles.image, size]}
      resizeMode="contain"
      onError={() => {
        console.warn(`Failed to load mascot image for variant: ${variant}`);
      }}
    />
  );
}

// Header Mascot Component (smaller, optimized for headers)
export function HeaderMascot({ 
  screen = 'dashboard', 
  theme, 
  onPress, 
  showGreeting = false,
  greeting = '' 
}) {
  // Map screen types to mascot variants
  const getVariantForScreen = (screenType) => {
    switch (screenType) {
      case 'quiz':
      case 'quizStart':
        return 'quizStart';
      case 'quizSuccess':
        return 'quizSuccess';
      case 'quizFail':
        return 'quizFail';
      case 'dashboard':
      case 'courses':
      case 'timetable':
      case 'profile':
      default:
        return 'header'; // Use header size
    }
  };

  const variant = getVariantForScreen(screen);
  const source = getMascotSource(variant);
  const size = { width: 48, height: 48 }; // Fixed header size
  const emoji = mascotEmojis[variant] || '🎓';

  const MascotContent = () => {
    if (!source) {
      return (
        <View style={[styles.headerFallbackContainer, { backgroundColor: theme?.primary || '#FFA726' }]}>
          <Text style={styles.headerFallbackEmoji}>{emoji}</Text>
        </View>
      );
    }

    return (
      <Image
        source={source}
        style={[styles.headerImage, size]}
        resizeMode="contain"
        onError={() => {
          console.warn(`Failed to load header mascot image for screen: ${screen}`);
        }}
      />
    );
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.headerMascotContainer}>
        <MascotContent />
        {showGreeting && greeting && (
          <View style={[styles.greetingBubble, { backgroundColor: theme?.surface || '#FFFFFF' }]}>
            <Text style={[styles.greetingText, { color: theme?.text || '#000000' }]}>
              {greeting}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.headerMascotContainer}>
      <MascotContent />
      {showGreeting && greeting && (
        <View style={[styles.greetingBubble, { backgroundColor: theme?.surface || '#FFFFFF' }]}>
          <Text style={[styles.greetingText, { color: theme?.text || '#000000' }]}>
            {greeting}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Original Mascot styles
  image: {
    alignSelf: 'center',
  },
  fallbackContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA726',
    borderRadius: 20,
    padding: 20,
  },
  fallbackEmoji: {
    fontSize: 60,
    textAlign: 'center',
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
  },

  // Header Mascot styles
  headerMascotContainer: {
    position: 'relative',
  },
  headerImage: {
    borderRadius: 24,
  },
  headerFallbackContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerFallbackEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  greetingBubble: {
    position: 'absolute',
    top: -40,
    left: -20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greetingText: {
    fontSize: 10,
    fontWeight: '600',
  },
});