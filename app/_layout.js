// Enhanced animated tab bar with Ionicons
// app/_layout.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../constants/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

function AppLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, isDarkMode } = useTheme();
  
  // Check if we're in a tab route
  const isTabRoute = pathname.startsWith('/_tabs/');

  // Define tab configuration
  const tabs = [
    {
      name: 'dashboard',
      label: 'Dashboard',
      activeIcon: 'grid',
      inactiveIcon: 'grid-outline',
      route: '/_tabs/dashboard'
    },
    {
      name: 'courses',
      label: 'Cours',
      activeIcon: 'book',
      inactiveIcon: 'book-outline',
      route: '/_tabs/courses'
    },
    {
      name: 'quizzes',
      label: 'Quiz',
      activeIcon: 'help-circle',
      inactiveIcon: 'help-circle-outline',
      route: '/_tabs/quizzes'
    },
    {
      name: 'profile',
      label: 'Profil',
      activeIcon: 'person',
      inactiveIcon: 'person-outline',
      route: '/_tabs/profile'
    }
  ];

  // Animation values for each tab
  const tabAnimations = useRef(tabs.map(() => new Animated.Value(0))).current;
  
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
  }, [pathname]);

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
      </Stack>
      
      {/* Custom tab bar */}
      {isTabRoute && (
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