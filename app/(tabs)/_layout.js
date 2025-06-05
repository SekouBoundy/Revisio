// app/(tabs)/_layout.js - FIXED WITH THEME SUPPORT
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../constants/ThemeContext';

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          switch (route.name) {
            case 'dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'courses':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'quiz':
              iconName = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'schedule':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = focused ? 'ellipse' : 'ellipse-outline';
          }
          return (
            <Ionicons 
              name={iconName} 
              size={focused ? 28 : 24} 
              color={focused ? theme.primary : theme.textSecondary} 
              style={{ marginBottom: 0 }} 
            />
          );
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarStyle: {
          height: 75,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          backgroundColor: theme.surface, // ✅ Now uses theme
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={{
          flexDirection: 'row',
          height: 75,
          backgroundColor: theme.surface, // ✅ Now uses theme
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 10,
        }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.title || route.name.charAt(0).toUpperCase() + route.name.slice(1);
            const isFocused = state.index === index;
            let iconName;
            switch (route.name) {
              case 'dashboard':
                iconName = isFocused ? 'grid' : 'grid-outline';
                break;
              case 'courses':
                iconName = isFocused ? 'book' : 'book-outline';
                break;
              case 'quizzes':
                iconName = isFocused ? 'help-circle' : 'help-circle-outline';
                break;
              case 'schedule':
                iconName = isFocused ? 'calendar' : 'calendar-outline';
                break;
              case 'profile':
                iconName = isFocused ? 'person' : 'person-outline';
                break;
              default:
                iconName = isFocused ? 'ellipse' : 'ellipse-outline';
            }

            return (
              <View key={route.key} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name={iconName}
                  size={isFocused ? 28 : 24}
                  color={isFocused ? theme.primary : theme.textSecondary} // ✅ Now uses theme
                  style={{ marginBottom: 0 }}
                  onPress={() => navigation.navigate(route.name)}
                />
                <Text
                  style={{
                    color: isFocused ? theme.primary : theme.textSecondary, // ✅ Now uses theme
                    fontWeight: isFocused ? 'bold' : '600',
                    fontSize: 12,
                  }}
                  onPress={() => navigation.navigate(route.name)}
                >
                  {label}
                </Text>
                {/* Dot under the label */}
                {isFocused && (
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.primary, // ✅ Now uses theme
                    marginTop: 2,
                  }} />
                )}
              </View>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="courses" options={{ title: 'Cours' }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
      <Tabs.Screen name="quizzes" options={{ title: 'Quizzes' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}