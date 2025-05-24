// app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3366FF',
      }}
    >
      {/* 1) Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />

      {/* 2) Courses - point to the index that handles redirection */}
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />

      {/* 3) Quizzes - point to the index that handles redirection */}
      <Tabs.Screen
        name="quizzes"
        options={{
          title: 'Quizzes',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="help-circle-outline" size={size} color={color} />,
        }}
      />

      {/* 4) Schedule */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      />

      {/* 5) Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) =>
            <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />

      {/* Hide ALL dynamic routes from tab bar */}
      <Tabs.Screen
        name="courses/[level]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="courses/[level]/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="courses/[level]/[courseName]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="quizzes/[level]"
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