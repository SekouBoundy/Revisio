// app/(tabs)/courses/[level]/[courseName].js
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CourseDetailScreen() {
  const { level, courseName } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
        {courseName} ({level})
      </Text>
    </View>
  );
}
