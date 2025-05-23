import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function LevelCourses() {
  const { level } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Courses for: {level}</Text>
    </View>
  );
}
