// app/_layout.js
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Theme from '../constants/Theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(console.warn);

// Auth context for managing authentication state
const AuthContext = React.createContext(null);

// Hook to use auth context
export function useAuth() {
  return React.useContext(AuthContext);
}

// Define a global authentication provider
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  // Check for authentication status on mount
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        console.log('Checking auth status...');
        const token = await SecureStore.getItemAsync('userToken');
        console.log('Auth token:', token ? 'Found' : 'Not found');
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
    const inTabsGroup = segments[0] === '(tabs)' || segments[0] === '_tabs';

    console.log('Current segments:', segments, 'Auth:', isAuthenticated);
    console.log('In auth group:', inAuthGroup, 'In tabs group:', inTabsGroup);

    // If not authenticated but trying to access protected routes, redirect to login
    if (!isAuthenticated && !inAuthGroup && segments.length > 0) {
      console.log('Not authenticated, redirecting to login');
      router.replace('/_auth/login');
    }

    // If authenticated but on auth screens, redirect to main app
    if (isAuthenticated && inAuthGroup) {
      console.log('Already authenticated, redirecting to main app');
      router.replace('/_tabs/courses');
    }

    // If at root path, redirect based on auth status
    if (segments.length === 0) {
      if (isAuthenticated) {
        console.log('Root path, authenticated, redirect to courses');
        router.replace('/_tabs/courses');
      } else {
        console.log('Root path, not authenticated, redirect to login');
        router.replace('/_auth/login');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  // Hide splash screen once we're ready
  useEffect(() => {
    if (!isLoading) {
      console.log('App ready, hiding splash screen');
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isLoading]);

  // Provide auth context to children
  const authContext = {
    signIn: async (token) => {
      try {
        console.log('Signing in...');
        await SecureStore.setItemAsync('userToken', token);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error('Error signing in:', error);
        return false;
      }
    },
    signOut: async () => {
      try {
        console.log('Signing out...');
        await SecureStore.deleteItemAsync('userToken');
        setIsAuthenticated(false);
        return true;
      } catch (error) {
        console.error('Error signing out:', error);
        return false;
      }
    },
    isAuthenticated,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
    // 'InterRegular': require('../assets/fonts/Inter-Regular.ttf'),
  });

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  // Define theme (light mode by default)
  let themeColors;
  try {
    const theme = Theme.createTheme(false); // Pass true for dark mode
    themeColors = theme.colors;
  } catch (error) {
    console.error('Error creating theme:', error);
    themeColors = {
      background: '#FFFFFF',
      text: '#000000',
    };
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
    </AuthProvider>
  );
}