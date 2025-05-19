// app/_tabs/_layout.js
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4361FF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
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
        contentStyle: {
          paddingBottom: 80,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarLabel: "📱 Dashboard",
          headerTitle: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Cours",
          tabBarLabel: "📚 Cours",
          headerTitle: "Cours",
        }}
      />
      <Tabs.Screen
        name="quizzes/index"
        options={{
          title: "Quiz",
          tabBarLabel: "🧪 Quiz",
          headerTitle: "Quiz",
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profil",
          tabBarLabel: "👤 Profil",
          headerTitle: "Profil",
        }}
      />
      
      {/* Hide all other tab screens */}
      <Tabs.Screen
        name="courses/[courseId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quizzes/[quizId]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/edit"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/achievements"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
} 