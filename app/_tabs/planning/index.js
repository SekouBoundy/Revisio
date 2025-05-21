import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Planning() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Mon Planning</Text>

      <Button
        title="📅 Voir Emploi du Temps"
        onPress={() => navigation.navigate('schedule')}
      />

      <View style={{ marginVertical: 10 }} />

      <Button
        title="🧠 Voir le Plan d’Étude"
        onPress={() => navigation.navigate('study-planner')}
      />
    </View>
  );
}
