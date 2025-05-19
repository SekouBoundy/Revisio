// app/_layout.js
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import * as Theme from '../constants/Theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Define a global authentication provider
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check for authentication status on mount
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        // Consider the user authenticated if they have a token
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  }, []);

  // Monitor segments for navigation protection
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === '_auth';
    const inTabs = segments[0] === '(tabs)' || segments[0] === '_tabs';

    // If not authenticated but trying to access protected routes, redirect to login
    if (!isAuthenticated && !inAuthGroup && segments.length > 0) {
      router.replace('/_auth/login');
    }

    // If authenticated but on auth screens, redirect to main app
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }

    // If at root path, redirect based on auth status
    if (segments.length === 0) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/_auth/login');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  // Hide splash screen once we're ready
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return children;
}

export default function RootLayout() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
    // 'InterRegular': require('../assets/fonts/Inter-Regular.ttf'),
    // 'InterBold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  // Define theme (light mode by default)
  const theme = Theme.createTheme(false); // Pass true for dark mode

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
    </AuthProvider>
  );
}