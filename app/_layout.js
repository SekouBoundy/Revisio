// app/_layout.js
import { Stack, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're in a tab route
  const isTabRoute = pathname.startsWith('/dashboard') || 
                    pathname.startsWith('/courses') || 
                    pathname.startsWith('/quizzes') || 
                    pathname.startsWith('/profile');

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="courses" />
        <Stack.Screen name="quizzes" />
        <Stack.Screen name="profile" />
      </Stack>
      
      {/* Custom tab bar */}
      {isTabRoute && (
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/dashboard')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.startsWith('/dashboard') && styles.activeTabLabel
            ]}>
              📱 Dashboard
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/courses')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.startsWith('/courses') && styles.activeTabLabel
            ]}>
              📚 Cours
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/quizzes')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.startsWith('/quizzes') && styles.activeTabLabel
            ]}>
              🧪 Quiz
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tabItem} 
            onPress={() => router.push('/profile')}
          >
            <Text style={[
              styles.tabLabel, 
              pathname.startsWith('/profile') && styles.activeTabLabel
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