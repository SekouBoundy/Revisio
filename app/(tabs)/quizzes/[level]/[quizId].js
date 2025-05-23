// app/(tabs)/quizzes/[level]/[quizId].js
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function QuizDetailScreen() {
  const { level, quizId } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>
        Quiz {quizId} ({level})
      </Text>
    </View>
  );
}
