// app/_tabs/quizzes/index.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function QuizzesRouter() {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { studentLevel } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    async function loadComponent() {
      setLoading(true);
      try {
        let QuizzesComponent;
        
        if (studentLevel === 'BAC') {
          QuizzesComponent = (await import('./BAC')).default;
        } else if (studentLevel === 'DEF') {
          QuizzesComponent = (await import('./DEF')).default;
        } else {
          // Fallback to BAC
          QuizzesComponent = (await import('./BAC')).default;
        }
        
        setComponent(() => QuizzesComponent);
      } catch (error) {
        console.error('Error loading quizzes component:', error);
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