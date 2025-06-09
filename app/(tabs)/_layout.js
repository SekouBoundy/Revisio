// app/(tabs)/_layout.js - FIXED VERSION
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../constants/ThemeContext';

export default function TabLayout() {
  const { theme } = useContext(ThemeContext);

  const getIconName = (routeName, focused) => {
    switch (routeName) {
      case 'dashboard':
        return focused ? 'home' : 'home-outline';
      case 'courses':
        return focused ? 'book' : 'book-outline';
      case 'quizzes':
        return focused ? 'help-circle' : 'help-circle-outline';
      case 'schedule':
        return focused ? 'calendar' : 'calendar-outline';
      case 'profile':
        return focused ? 'person' : 'person-outline';
      default:
        return focused ? 'ellipse' : 'ellipse-outline';
    }
  };

  const getTabLabel = (routeName) => {
    switch (routeName) {
      case 'dashboard':
        return 'Dashboard';
      case 'courses':
        return 'Cours';
      case 'quizzes':
        return 'Quizzes';
      case 'schedule':
        return 'Schedule';
      case 'profile':
        return 'Profil';
      default:
        return routeName.charAt(0).toUpperCase() + routeName.slice(1);
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // We'll handle labels in custom tabBar
        tabBarStyle: { display: 'none' }, // Hide default tab bar since we're using custom
      }}
      tabBar={({ state, descriptors, navigation }) => (
        <View style={{
          flexDirection: 'row',
          height: 75,
          backgroundColor: theme.surface,
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
          shadowOffset: { width: 0, height: -2 },
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
        }}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const iconName = getIconName(route.name, isFocused);
            const label = getTabLabel(route.name);

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={`${label} tab`}
                testID={`tab-${route.name}`}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 4,
                }}
              >
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 50,
                }}>
                  <Ionicons
                    name={iconName}
                    size={isFocused ? 28 : 24}
                    color={isFocused ? theme.primary : theme.textSecondary}
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    style={{
                      color: isFocused ? theme.primary : theme.textSecondary,
                      fontWeight: isFocused ? 'bold' : '600',
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    {label}
                  </Text>
                  {/* Active indicator dot */}
                  {isFocused && (
                    <View style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.primary,
                      marginTop: 2,
                    }} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="courses" 
        options={{ 
          title: 'Cours',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="quizzes" 
        options={{ 
          title: 'Quizzes',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="schedule" 
        options={{ 
          title: 'Schedule',
          headerShown: false,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profil',
          headerShown: false,
        }} 
      />
    </Tabs>
  );
}