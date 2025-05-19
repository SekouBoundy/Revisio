import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SplashScreen } from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here
    // 'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    // 'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="_auth" options={{ headerShown: false }} />
      <Stack.Screen name="_tabs" options={{ headerShown: false }} />
    </Stack>
  );
}