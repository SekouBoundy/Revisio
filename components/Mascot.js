// components/Mascot.js - WITH FALLBACK

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

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
  quizStart: { width: 180, height: 180 },
  quizFail: { width: 180, height: 180 },
  quizSuccess: { width: 200, height: 200 },
};

const mascotEmojis = {
  full: '🦸‍♂️',
  small: '📚',
  quizStart: '🎯',
  quizFail: '😔',
  quizSuccess: '🎉',
};

export default function Mascot({ variant = 'full' }) {
  const source = getMascotSource(variant);
  const size = mascotSizes[variant] || mascotSizes.full;
  const emoji = mascotEmojis[variant] || mascotEmojis.full;

  // If no image source available, show emoji fallback
  if (!source) {
    return (
      <View style={[styles.fallbackContainer, size]}>
        <Text style={styles.fallbackEmoji}>{emoji}</Text>
        <Text style={styles.fallbackText}>Revisio</Text>
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

const styles = StyleSheet.create({
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
});