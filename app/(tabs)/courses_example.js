// ==== FILE 1: app/(tabs)/courses_example.js ====
import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { CoursesHeader } from '../../components/headers/EnhancedHeaders';
import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function CoursesExampleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleSearchPress = () => {
    setSearchVisible(!searchVisible);
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header with Mascot */}
      <CoursesHeader 
        user={user}
        onSearchPress={handleSearchPress}
        onFilterPress={handleFilterPress}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Your courses content here */}
      </ScrollView>
    </SafeAreaView>
  );
}
