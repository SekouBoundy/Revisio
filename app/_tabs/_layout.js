// app/_tabs/_layout.js

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Dashboard from './dashboard';
import Planning from './planning';
import Profile from './profile';
import Quizzes from './quizzes';

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
        tabBarIcon: ({ color, focused }) => {
          switch (route.name) {
            case 'Dashboard':
              return <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={color} />;
            case 'Emploi du temps':
              return <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />;
            case 'Quiz':
              return <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={22} color={color} />;
            case 'Profil':
              return <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} size={22} color={color} />;
            default:
              return null;
          }
        },
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Emploi du temps" component={Planning} />
      <Tab.Screen name="Quiz" component={Quizzes} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}
