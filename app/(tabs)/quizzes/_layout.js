// app/(tabs)/quizzes/_layout.js - CREATE THIS FILE
import { Stack } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../../../constants/ThemeContext';

export default function QuizzesLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Main Quizzes Screen */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false  // We handle header in the component
        }} 
      />
      
      {/* Level-based quiz lists */}
      <Stack.Screen 
        name="[level]/index" 
        options={({ route }) => ({
          title: `Quiz ${route.params.level}`,
          headerShown: true,
        })} 
      />
      
      {/* Individual Quiz Details */}
      <Stack.Screen 
        name="[level]/[quizId]" 
        options={({ route }) => ({
          title: `Quiz ${route.params.quizId}`,
          headerShown: true,
          presentation: 'card',
        })} 
      />
    </Stack>
  );
}