// app/_layout.js
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../constants/AuthContext';
import { ThemeProvider } from '../constants/ThemeContext';
import { UserProvider } from '../constants/UserContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider value={{ user: { level: "DEF" } }}>
            <Stack screenOptions={{ headerShown: false }} />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
