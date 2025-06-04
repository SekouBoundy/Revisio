// app/(tabs)/courses/_layout.js - CREATE THIS FILE
import { Stack } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../../../constants/ThemeContext';

export default function CoursesLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* Main Courses Screen */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false  // We handle header in the component
        }} 
      />
      
      {/* Level-based course lists */}
      <Stack.Screen 
        name="[level]/index" 
        options={({ route }) => ({
          title: `Cours ${route.params.level}`,
          headerShown: true,
        })} 
      />
      
      {/* Individual Course Details */}
      <Stack.Screen 
        name="[level]/[courseName]" 
        options={{
          headerShown: false,  // We handle custom header in component
          presentation: 'card',  // Nice transition
        }} 
      />
    </Stack>
  );
}