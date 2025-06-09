// ==== FILE 2: app/quiz_example.js ====
import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuizHeader } from '../components/headers/EnhancedHeaders';
import { ThemeContext } from '../constants/ThemeContext';
import Mascot from '../components/Mascot';

export default function QuizExampleScreen() {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [quizState, setQuizState] = useState('start'); // 'start', 'progress', 'success', 'fail'
  const [progress, setProgress] = useState(0);

  const quizTitle = params.title || 'Quiz';

  const handleBackPress = () => {
    router.back();
  };

  // Example: Update quiz state based on progress
  useEffect(() => {
    if (progress === 1) {
      setQuizState('success');
    }
  }, [progress]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Dynamic Header with Mascot */}
      <QuizHeader 
        quizTitle={quizTitle}
        progress={progress}
        quizState={quizState}
        onBackPress={handleBackPress}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {quizState === 'start' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot variant="quizStart" />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Clique pour commencer !
            </Text>
          </View>
        )}

        {quizState === 'success' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot variant="quizSuccess" />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Quiz terminé avec succès !
            </Text>
          </View>
        )}

        {quizState === 'fail' && (
          <View style={{ alignItems: 'center' }}>
            <Mascot variant="quizFail" />
            <Text style={{ marginTop: 20, fontSize: 18, color: theme.text }}>
              Réessaie, tu peux y arriver !
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}