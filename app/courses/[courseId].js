// Example of using level-based content in a course screen
import { StyleSheet, Text, View } from 'react-native';
import LevelBasedContent, { BACOnly, DEFOnly, LanguageOnly } from '../../components/common/LevelBasedContent';
import { STUDENT_LEVELS } from '../../constants/UserContext';

export default function CourseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Course Content</Text>
      
      {/* Show content to all users */}
      <Text style={styles.commonContent}>This content is visible to all users regardless of level.</Text>
      
      {/* Content specific to BAC students */}
      <BACOnly>
        <View style={styles.levelSpecificSection}>
          <Text style={styles.levelHeader}>BAC Preparation</Text>
          <Text>This specialized content is only visible to BAC students.</Text>
          <Text>It contains exam tips and strategies specific to the BAC exam.</Text>
        </View>
      </BACOnly>
      
      {/* Content specific to DEF students */}
      <DEFOnly>
        <View style={styles.levelSpecificSection}>
          <Text style={styles.levelHeader}>DEF Preparation</Text>
          <Text>This content is tailored for DEF students.</Text>
          <Text>It focuses on fundamentals needed for the DEF exam.</Text>
        </View>
      </DEFOnly>
      
      {/* Content specific to Language learning students */}
      <LanguageOnly>
        <View style={styles.levelSpecificSection}>
          <Text style={styles.levelHeader}>Language Practice</Text>
          <Text>This content is designed for language learners.</Text>
          <Text>It includes vocabulary and conversation practice.</Text>
        </View>
      </LanguageOnly>
      
      {/* Content for multiple levels with custom fallback */}
      <LevelBasedContent 
        levels={[STUDENT_LEVELS.BAC, STUDENT_LEVELS.DEF]} 
        fallback={
          <Text style={styles.fallbackText}>
            This content is not relevant for your level.
          </Text>
        }
      >
        <View style={styles.levelSpecificSection}>
          <Text style={styles.levelHeader}>Exam Preparation</Text>
          <Text>This content is for both BAC and DEF students.</Text>
          <Text>It includes general exam strategies.</Text>
        </View>
      </LevelBasedContent>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commonContent: {
    fontSize: 16,
    marginBottom: 24,
  },
  levelSpecificSection: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  levelHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  fallbackText: {
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 16,
  }
});