// Example: app/(tabs)/_layout.js
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
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
            <Ionicons name={iconName} size={focused ? 28 : 24} color={color} style={{ marginBottom: 0 }} />
          );
        },
        tabBarActiveTintColor: '#4E8CEE',
        tabBarInactiveTintColor: '#52606D',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarStyle: {
          height: 64,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          backgroundColor: '#fff',
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
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
          height: 64,
          backgroundColor: '#fff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 8,
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
                  color={isFocused ? '#4E8CEE' : '#52606D'}
                  style={{ marginBottom: 0 }}
                  onPress={() => navigation.navigate(route.name)}
                />
                <Text
                  style={{
                    color: isFocused ? '#4E8CEE' : '#52606D',
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
                    backgroundColor: '#4E8CEE',
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
