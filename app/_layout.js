// app/_layout.js
import { Stack, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/_tabs/dashboard')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.includes('/dashboard') ? 
                [styles.activeTabLabel, { color: theme.primary }] : 
                { color: theme.textSecondary }
            ]}>
              📱 Dashboard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/_tabs/courses')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.includes('/courses') ? 
                [styles.activeTabLabel, { color: theme.primary }] : 
                { color: theme.textSecondary }
            ]}>
              📚 Cours
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/_tabs/quizzes')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.includes('/quizzes') ? 
                [styles.activeTabLabel, { color: theme.primary }] : 
                { color: theme.textSecondary }
            ]}>
              🧪 Quiz
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/_tabs/profile')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.includes('/profile') ? 
                [styles.activeTabLabel, { color: theme.primary }] : 
                { color: theme.textSecondary }
            ]}>
              👤 Profil
            </Text>
          </TouchableOpacity>
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
  },
  tabLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#4361FF',
    fontWeight: 'bold',
  }
});