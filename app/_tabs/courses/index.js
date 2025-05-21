// app/_tabs/courses/index.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function CoursesRouter() {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { studentLevel } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    async function loadComponent() {
      setLoading(true);
      try {
        let CoursesComponent;
        
        if (studentLevel === 'BAC') {
          CoursesComponent = (await import('./BAC')).default;
        } else if (studentLevel === 'DEF') {
          CoursesComponent = (await import('./DEF')).default;
        } else {
          // Fallback to BAC
          CoursesComponent = (await import('./BAC')).default;
        }
        
        setComponent(() => CoursesComponent);
      } catch (error) {
        console.error('Error loading courses component:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadComponent();
  }, [studentLevel]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return Component ? <Component /> : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});