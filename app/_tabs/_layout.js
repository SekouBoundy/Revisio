// app/_tabs/_layout.js
import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../constants/AuthContext';

export default function TabsLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/_auth/login" />;
  }

  return <Slot />;
}