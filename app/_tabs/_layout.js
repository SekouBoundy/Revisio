// app/_tabs/_layout.js
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  // Calculate bottom padding to ensure tab bar doesn't hide content
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4361FF', // Primary blue color
        tabBarInactiveTintColor: '#9CA3AF', // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 5,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 5 : 8,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        headerTitleAlign: 'center',
        // Add bottom padding to all screens to prevent content from being hidden behind the tab bar
        contentStyle: {
          paddingBottom: 80, // Ensure enough space at the bottom
        },
        // Remove default icon space
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: "📱 Dashboard",
          headerTitle: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarLabel: "📚 Cours",
          headerTitle: "Cours",
        }}
      />
      <Tabs.Screen
        name="quizzes"
        options={{
          title: "Quizzes",
          tabBarLabel: "🧪 Quiz",
          headerTitle: "Quiz",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "👤 Profil",
          headerTitle: "Profil",
        }}
      />
    </Tabs>
  );
}
