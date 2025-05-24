// app/(tabs)/courses/index.js
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUser } from '../../../constants/UserContext';

export default function CoursesIndex() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.level) {
      router.replace(`/(tabs)/courses/${user.level}`);
    }
  }, [router, user?.level]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}