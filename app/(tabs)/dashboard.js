// app/(tabs)/dashboard.js
import { View, Text } from 'react-native';

export default function DashboardScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Welcome to the Dashboard!</Text>
    </View>
  );
}
