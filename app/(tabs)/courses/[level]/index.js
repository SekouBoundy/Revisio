// app/(tabs)/courses/[level]/index.js
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CoursesLevelScreen() {
  const { level } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
        Courses for {level}
      </Text>
    </View>
  );
}
