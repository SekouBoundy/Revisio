// File: app/(tabs)/_layout.js - Fixed missing icons
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from '../../constants/ThemeContext';

export default function TabsLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.neutralLight,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {/* 1) Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 2) Courses */}
      <Tabs.Screen
        name="courses/index"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 3) Quizzes - Fixed icon name */}
      <Tabs.Screen
        name="quizzes/index"
        options={{
          title: 'Quizzes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 4) Schedule - Fixed icon name */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 5) Profile - Fixed icon name */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hide dynamic routes */}
      <Tabs.Screen
        name="courses/[level]/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="courses/[level]/[courseName]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="quizzes/[level]/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="quizzes/[level]/[quizId]"
        options={{ href: null }}
      />
    </Tabs>
  );
}