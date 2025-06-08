// app/(tabs)/quizzes/_layout.js - ENHANCED LAYOUT
import { Stack } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function QuizzesLayout() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();

  return (
    <Stack
      screenOptions={{
        headerShown: false, // We handle headers in components
        animation: 'slide_from_right',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      {/* Main Quizzes Dashboard */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Quiz'
        }} 
      />
      
      {/* Level-based quiz lists */}
      <Stack.Screen 
        name="[level]/index" 
        options={({ route }) => ({
          headerShown: false,
          title: `Quiz ${route.params?.level || 'DEF'}`,
          animation: 'slide_from_right',
        })} 
      />
      
      {/* Individual Quiz Taking */}
      <Stack.Screen 
        name="[level]/[quizId]" 
        options={({ route }) => ({
          headerShown: false,
          title: 'Quiz en cours',
          presentation: 'card',
          gestureEnabled: false, // Prevent accidental exits during quiz
          animation: 'slide_from_bottom',
        })} 
      />

      {/* Subject-specific quizzes */}
      <Stack.Screen 
        name="[level]/subject" 
        options={({ route }) => ({
          headerShown: false,
          title: route.params?.subject || 'Matière',
          animation: 'slide_from_right',
        })} 
      />

      {/* Quiz results and analytics */}
      <Stack.Screen 
        name="results/[quizId]" 
        options={{
          headerShown: false,
          title: 'Résultats',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />

      {/* Quiz settings */}
      <Stack.Screen 
        name="settings" 
        options={{
          headerShown: false,
          title: 'Paramètres Quiz',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} 
      />
    </Stack>
  );
}