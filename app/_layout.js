// app/_layout.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../constants/ThemeContext';
import { STUDENT_LEVELS, UserProvider, useUser } from '../constants/UserContext';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [userToken, setUserToken] = useState(null);

  // Load token
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
        }
      } catch (e) {
        console.warn('Failed to load token', e);
      } finally {
        setIsReady(true);
      }
    };

    loadToken();
  }, []);

  // Create auth context
  const authContext = {
    signIn: async (token) => {
      try {
        await SecureStore.setItemAsync('userToken', token);
        setUserToken(token);
        return true;
      } catch (e) {
        console.error('Error storing token', e);
        return false;
      }
    },
    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
        return true;
      } catch (e) {
        console.error('Error removing token', e);
        return false;
      }
    },
    token: userToken,
    isLoggedIn: !!userToken
  };

  // Wait until we've checked token storage
  if (!isReady) {
    return null; // You could show a splash screen here
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <AuthContext.Provider value={authContext}>
          <AppLayout />
        </AuthContext.Provider>
      </UserProvider>
    </ThemeProvider>
  );
}

// Auth context
export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, isDarkMode } = useTheme();
  const { userProfile, studentLevel } = useUser();
  const { isLoggedIn } = useAuth();
  
  // Check if we're in a tab route
  const isTabRoute = pathname.startsWith('/_tabs/');

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn && !pathname.startsWith('/_auth/')) {
      router.replace('/_auth/login');
    }
  }, [isLoggedIn, pathname]);

  // Define tab configuration - personalized based on user level
  const getTabs = useCallback(() => {
    // Base tabs for all users
    const tabs = [
      {
        name: 'dashboard',
        label: 'Dashboard',
        activeIcon: 'grid',
        inactiveIcon: 'grid-outline',
        route: '/_tabs/dashboard',
        visible: true // Always visible
      },
      {
        name: 'courses',
        label: 'Cours',
        activeIcon: 'book',
        inactiveIcon: 'book-outline',
        route: '/_tabs/courses',
        visible: true // Always visible
      },
      {
        name: 'quizzes',
        label: 'Quiz',
        activeIcon: 'help-circle',
        inactiveIcon: 'help-circle-outline',
        route: '/_tabs/quizzes',
        visible: true // Always visible
      }
    ];

    // Add level-specific tabs or customize labels if needed
    if (studentLevel === STUDENT_LEVELS.BAC) {
      tabs.push({
        name: 'exams',
        label: 'BAC',
        activeIcon: 'school',
        inactiveIcon: 'school-outline',
        route: '/_tabs/exams',
        visible: true
      });
    } else if (studentLevel === STUDENT_LEVELS.LANGUAGE) {
      tabs.push({
        name: 'practice',
        label: 'Practice',
        activeIcon: 'mic',
        inactiveIcon: 'mic-outline',
        route: '/_tabs/practice',
        visible: true
      });
    }

    // Profile tab (always last)
    tabs.push({
      name: 'profile',
      label: 'Profil',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
      route: '/_tabs/profile',
      visible: true
    });

    return tabs.filter(tab => tab.visible);
  }, [studentLevel]);

  const tabs = getTabs();
  
  // Animation values for each tab
  const tabAnimations = useRef(
    Array(5).fill(0).map(() => new Animated.Value(0))
  ).current;
  
  useEffect(() => {
    // Find the active tab index
    const activeTabIndex = tabs.findIndex(tab => pathname.includes(`/${tab.name}`));
    
    if (activeTabIndex !== -1) {
      // Animate all tabs
      tabs.forEach((_, index) => {
        Animated.spring(tabAnimations[index], {
          toValue: index === activeTabIndex ? 1 : 0,
          useNativeDriver: true,
          friction: 8
        }).start();
      });
    }
  }, [pathname, tabs]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background
        }
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="_tabs" />
        <Stack.Screen name="_auth" options={{ 
          animation: 'fade',
        }} />
      </Stack>
      
      {/* Custom tab bar - only show when logged in and on tab route */}
      {isLoggedIn && isTabRoute && (
        <View style={[
          styles.tabBar,
          { 
            backgroundColor: theme.background,
            borderTopColor: theme.border
          }
        ]}>
          {tabs.map((tab, index) => {
            const isActive = pathname.includes(`/${tab.name}`);
            
            // Scale animation for the icon
            const scale = tabAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.2]
            });
            
            return (
              <TouchableOpacity 
                key={tab.name}
                style={styles.tabItem} 
                onPress={() => router.push(tab.route)}
                activeOpacity={0.7}
              >
                <Animated.View style={{ transform: [{ scale }] }}>
                  <Ionicons 
                    name={isActive ? tab.activeIcon : tab.inactiveIcon} 
                    size={24} 
                    color={isActive ? theme.primary : theme.textSecondary} 
                  />
                </Animated.View>
                <Text style={[
                  styles.tabLabel, 
                  isActive ? 
                    { color: theme.primary, fontWeight: '600' } : 
                    { color: theme.textSecondary }
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    paddingBottom: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  }
});