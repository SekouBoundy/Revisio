// app/(tabs)/courses/index.js - Courses Hub Version
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function CoursesHub() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();

  const isDefLevel = user?.level === 'DEF';

  // Auto-redirect to user's level courses
  React.useEffect(() => {
    if (user?.level) {
      router.replace(`/(tabs)/courses/${user.level}`);
    }
  }, [user?.level, router]);

  const LevelCard = ({ title, subtitle, icon, onPress, color }) => (
    <TouchableOpacity 
      style={[styles.levelCard, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View style={[styles.levelIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.levelContent}>
        <Text style={[styles.levelTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.levelSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  if (isDefLevel) {
    // For DEF students, go directly to DEF courses
    router.replace('/(tabs)/courses/DEF');
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Choisir le niveau
        </Text>
      </View>

      <View style={styles.content}>
        <LevelCard
          title="DEF - Secondaire"
          subtitle="Cours du niveau secondaire"
          icon="school-outline"
          color={theme.primary}
          onPress={() => router.push('/(tabs)/courses/DEF')}
        />
        
        <LevelCard
          title="TSE - Sciences Exactes"
          subtitle="Mathématiques, Physique, Chimie"
          icon="calculator-outline"
          color={theme.accent}
          onPress={() => router.push('/(tabs)/courses/TSE')}
        />
        
        <LevelCard
          title="TSEXP - Sciences Expérimentales"
          subtitle="Sciences expérimentales et biologiques"
          icon="flask-outline"
          color={theme.success}
          onPress={() => router.push('/(tabs)/courses/TSEXP')}
        />
        
        <LevelCard
          title="TSECO - Sciences Économiques"
          subtitle="Économie, Gestion, Droit"
          icon="trending-up-outline"
          color={theme.secondary}
          onPress={() => router.push('/(tabs)/courses/TSECO')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  levelIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  levelContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
});