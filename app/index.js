// File: app/index.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function HomeRedirect() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('profile').then((res) => {
      setLoggedIn(!!res);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

return <Redirect href={loggedIn ? '/(tabs)/dashboard' : '/entry'} />;
}
