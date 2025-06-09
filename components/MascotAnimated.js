import React from 'react';
import { Image, Animated } from 'react-native';

export default function MascotAnimated({ source, style }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
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
