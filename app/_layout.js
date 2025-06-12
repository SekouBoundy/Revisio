import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../constants/ThemeContext'; // must be correct path and curly braces!
import { AuthProvider } from '../constants/AuthContext';
import { UserProvider } from '../constants/UserContext';

export default function RootLayout() {
  return (
    
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
