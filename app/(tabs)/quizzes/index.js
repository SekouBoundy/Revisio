// app/(tabs)/quizzes/index.js
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUser } from '../../../constants/UserContext';

export default function QuizzesIndex() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.level) {
      // Use replace to maintain tab state
      router.replace(`/(tabs)/quizzes/${user.level}`);
    }
  }, [router, user?.level]);

  // Show loading while redirecting
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}