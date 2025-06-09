// components/MascotAnimated.js
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export default function MascotAnimated({ source, style }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.Image
      source={source}
      style={[style, { opacity: fadeAnim }]}
      resizeMode="contain"
    />
  );
}
