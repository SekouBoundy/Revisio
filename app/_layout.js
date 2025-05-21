// app/_layout.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../constants/AuthContext';
import { ThemeProvider, useTheme } from '../constants/ThemeContext';
import { UserProvider, useUser } from '../constants/UserContext';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <RootLayoutNav />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, isDarkMode } = useTheme();
  const { userProfile, studentLevel } = useUser();
  const { isLoggedIn, isLoading } = useAuth();
  const tabAnimations = useRef([]);

  const getTabs = useCallback(() => {
    if (!isLoggedIn) return [];

    const tabs = [
      {
        name: 'dashboard',
        label: 'Dashboard',
        activeIcon: 'grid',
        inactiveIcon: 'grid-outline',
        route: '/_tabs/dashboard',
        visible: true
      },
      {
        name: 'schedule',
        label: 'Emploi du temps',
        activeIcon: 'calendar',
        inactiveIcon: 'calendar-outline',
        route: '/_tabs/schedule',
        visible: true
      },
      {
        name: 'quizzes',
        label: 'Quiz',
        activeIcon: 'help-circle',
        inactiveIcon: 'help-circle-outline',
        route: '/_tabs/quizzes',
        visible: true
      },
      {
        name: 'profile',
        label: 'Profil',
        activeIcon: 'person',
        inactiveIcon: 'person-outline',
        route: '/_tabs/profile',
        visible: true
      },
    ];

    return tabs.filter(tab => tab.visible);
  }, [isLoggedIn]);

  const isTabRoute = pathname.startsWith('/_tabs/');
  const isAuthRoute = pathname.startsWith('/_auth/');

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isAuthRoute) {
      router.replace('/_auth/login');
    }
  }, [isLoggedIn, isLoading, pathname]);

  const tabs = getTabs();

  if (tabAnimations.current.length !== tabs.length) {
    tabAnimations.current = Array(tabs.length).fill(0).map(() => new Animated.Value(0));
  }

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => pathname.includes(`/${tab.name}`));
    if (activeTabIndex !== -1) {
      tabs.forEach((_, index) => {
        Animated.spring(tabAnimations.current[index], {
          toValue: index === activeTabIndex ? 1 : 0,
          useNativeDriver: true,
          friction: 8
        }).start();
      });
    }
  }, [pathname, tabs]);

  if (isLoading && !isAuthRoute) {
    return (
      <SafeAreaProvider>
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

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
        <Stack.Screen name="_auth" options={{ animation: 'fade' }} />
      </Stack>

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
            const scale = tabAnimations.current[index].interpolate({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
