// app/_tabs/_layout.js
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as Theme from '../../constants/Theme';

export default function TabsLayout() {
  // Use try-catch in case Theme functions are undefined
  let themeColors;
  try {
    const theme = Theme.createTheme(false); // Pass true for dark mode
    themeColors = theme.colors;
  } catch (error) {
    console.error('Error creating theme:', error);
    // Fallback colors in case theme creation fails
    themeColors = {
      background: '#FFFFFF',
      text: '#000000',
      primary: '#4361FF',
      border: '#E0E0E0'
    };
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: '#7F8C9F',
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: themeColors.text,
      }}
    >
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Courses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={24} color={color} />
          ),
          headerTitle: "Courses",
        }}
      />
      <Tabs.Screen
        name="quizzes/index"
        options={{
          title: "Quizzes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={24} color={color} />
          ),
          headerTitle: "Quizzes",
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
          headerTitle: "Profile",
        }}
      />
    </Tabs>
  );
}