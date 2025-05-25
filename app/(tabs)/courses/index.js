// app/(tabs)/courses/index.tsx
import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';
import { useApi } from '../../../hooks/useApi';
import { apiClient } from '../../../services/api/client';
import { Course } from '../../../services/api/types';
import CourseCard from '../../../components/CourseCard';

export default function CoursesScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();

  const { data: courses, loading, error, refetch } = useApi<Course[]>(
    () => apiClient.getCourses(user?.level || 'DEF'),
    [user?.level]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.error }}>{error}</Text>
        <TouchableOpacity 
          style={{ marginTop: 16, padding: 12, backgroundColor: theme.colors.primary }}
          onPress={refetch}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CourseCard course={item} />}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
}
