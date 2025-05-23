// app/_layout.js
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UserProvider } from '../contexts/UserContext';

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
