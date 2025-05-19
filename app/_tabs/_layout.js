import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Theme from '../../constants/Theme';

// Simple tab icons
const TabIcon = ({ name, focused }) => {
  // Function to determine icon content based on tab name
  const getIconContent = () => {
    switch (name) {
      case 'courses':
        return '📘';
      case 'quizzes':
        return '📝';
      case 'profile':
        return '👤';
      default:
        return '•';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{getIconContent()}</Text>
    </View>
  );
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textLight,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          tabBarIcon: ({ focused }) => <TabIcon name="courses" focused={focused} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      
      <Tabs.Screen
        name="quizzes"
        options={{
          title: 'Quizzes',
          tabBarIcon: ({ focused }) => <TabIcon name="quizzes" focused={focused} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
          tabBarLabelStyle: styles.tabBarLabel,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Theme.colors.backgroundPrimary,
    borderTopColor: Theme.colors.border,
    height: 60,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
});