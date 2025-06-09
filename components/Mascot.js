// components/Mascot.js

import React from 'react';
import { Image, StyleSheet } from 'react-native';

const mascotSources = {
  full: require('../assets/mascot/mascot_full.png'),
  small: require('../assets/mascot/mascot_small.png'),
  quizStart: require('../assets/mascot/Quiz-start.png'),
  quizFail: require('../assets/mascot/Quiz-fail.png'),
  quizSuccess: require('../assets/mascot/Quiz-success.png'),
};

const mascotSizes = {
  full: { width: 250, height: 250 },
  small: { width: 64, height: 64 },
  quizStart: { width: 180, height: 180 },
  quizFail: { width: 180, height: 180 },
  quizSuccess: { width: 200, height: 200 },
};

export default function Mascot({ variant = 'full' }) {
  const source = mascotSources[variant] || mascotSources.full;
  const size = mascotSizes[variant] || mascotSizes.full;

  return (
    <Image
      source={source}
      style={[styles.image, size]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
