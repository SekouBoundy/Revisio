import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';

export default function Profile() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Profil</Text>

      <Button title="🏆 Mes Succès" onPress={() => navigation.navigate('achievements')} />
      <View style={{ marginVertical: 10 }} />
      <Button title="⚙️ Modifier le Profil" onPress={() => navigation.navigate('edit')} />
      <View style={{ marginVertical: 10 }} />
      <Button title="📊 Trimestres" onPress={() => navigation.navigate('trimestre')} />
    </View>
  );
}
