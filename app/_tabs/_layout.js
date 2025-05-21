// 📁 File: app/_layout.js

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import Courses from './courses';
import Dashboard from './dashboard';
import Planning from './planning';
import Profile from './profile';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Dashboard') {
            return <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />;
          } else if (route.name === 'Cours') {
            return <Ionicons name={focused ? 'book' : 'book-outline'} size={22} color={color} />;
          } else if (route.name === 'Planning') {
            return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />;
          } else if (route.name === 'Profil') {
            return <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} size={22} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Cours" component={Courses} />
      <Tab.Screen name="Planning" component={Planning} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}
