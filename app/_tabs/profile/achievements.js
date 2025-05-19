// app/_tabs/profile/achievements.js
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Card from '../../../components/common/Card';
import Header from '../../../components/common/Header';
import * as Theme from '../../../constants/Theme';

export default function AchievementsScreen() {
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Dummy achievements data
  const achievements = [
    {
      id: 'achievement-1',
      title: 'First Step',
      description: 'Complete your first lesson',
      icon: 'star-outline',
      completed: true,
      progress: 1,
      total: 1,
      dateEarned: '2023-10-15',
      category: 'Beginner'
    },
    {
      id: 'achievement-2',
      title: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes',
      icon: 'ribbon-outline',
      completed: false,
      progress: 3,
      total: 5,
      dateEarned: null,
      category: 'Quiz'
    },
    {
      id: 'achievement-3',
      title: 'Learning Streak',
      description: 'Study for 7 consecutive days',
      icon: 'flame-outline',
      completed: false,
      progress: 4,
      total: 7,
      dateEarned: null,
      category: 'Engagement'
    },
    {
      id: 'achievement-4',
      title: 'Course Champion',
      description: 'Complete 5 courses',
      icon: 'trophy-outline',
      completed: false,
      progress: 2,
      total: 5,
      dateEarned: null,
      category: 'Course'
    },
    {
      id: 'achievement-5',
      title: 'Perfect Score',
      description: 'Get 100% on a quiz',
      icon: 'checkmark-circle-outline',
      completed: true,
      progress: 1,
      total: 1,
      dateEarned: '2023-09-28',
      category: 'Quiz'
    },
    {
      id: 'achievement-6',
      title: 'Language Explorer',
      description: 'Complete 10 language lessons',
      icon: 'globe-outline',
      completed: false,
      progress: 6,
      total: 10,
      dateEarned: null,
      category: 'Language'
    },
    {
      id: 'achievement-7',
      title: 'Math Genius',
      description: 'Complete all math modules for your level',
      icon: 'calculator-outline',
      completed: false,
      progress: 3,
      total: 8,
      dateEarned: null,
      category: 'Math'
    },
    {
      id: 'achievement-8',
      title: 'Early Bird',
      description: 'Study before 8 AM for 5 days',
      icon: 'sunny-outline',
      completed: true,
      progress: 5,
      total: 5,
      dateEarned: '2023-11-02',
      category: 'Engagement'
    }
  ];

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {});

  // Convert grouped achievements to array for FlatList
  const categorizedAchievements = Object.keys(achievementsByCategory).map(category => ({
    category,
    data: achievementsByCategory[category]
  }));

  // Render achievement item
  const renderAchievement = ({ item }) => (
    <Card
      style={[
        styles.achievementCard, 
        { opacity: item.completed ? 1 : 0.7 }
      ]}
    >
      <View style={styles.achievementContent}>
        <View 
          style={[
            styles.achievementIconContainer,
            { backgroundColor: theme.colors.primary + '20' }
          ]}
        >
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
        
        <View style={styles.achievementInfo}>
          <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.achievementDesc, { color: theme.colors.text + '80' }]}>
            {item.description}
          </Text>
          
          {item.completed ? (
            <Text style={[styles.completedText, { color: theme.colors.primary }]}>
              Earned on {formatDate(item.dateEarned)}
            </Text>
          ) : (
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar,
                  {
                    width: `${(item.progress / item.total) * 100}%`,
                    backgroundColor: theme.colors.primary
                  }
                ]}
              />
              <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>
                {item.progress}/{item.total} completed
              </Text>
            </View>
          )}
        </View>
        
        {item.completed && (
          <View 
            style={[
              styles.completedBadge,
              { backgroundColor: theme.colors.primary }
            ]}
          >
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
    </Card>
  );

  // Render category header
  const renderCategoryHeader = ({ category }) => (
    <View style={styles.categoryHeader}>
      <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
        {category}
      </Text>
    </View>
  );

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <Header title="Achievements" onBackPress={() => router.back()} />
      
      <View style={styles.statsContainer}>
        <View 
          style={[
            styles.statsCard, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <Text style={[styles.statsValue, { color: theme.colors.text }]}>
            {achievements.filter(a => a.completed).length}
          </Text>
          <Text style={[styles.statsLabel, { color: theme.colors.text + '80' }]}>
            Achievements Earned
          </Text>
        </View>
        
        <View 
          style={[
            styles.statsCard, 
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
        >
          <Text style={[styles.statsValue, { color: theme.colors.text }]}>
            {achievements.length - achievements.filter(a => a.completed).length}
          </Text>
          <Text style={[styles.statsLabel, { color: theme.colors.text + '80' }]}>
            Remaining
          </Text>
        </View>
      </View>
      
      <FlatList
        data={categorizedAchievements}
        keyExtractor={item => item.category}
        renderItem={({ item }) => (
          <View>
            {renderCategoryHeader(item)}
            {item.data.map(achievement => (
              <View key={achievement.id}>
                {renderAchievement({ item: achievement })}
              </View>
            ))}
          </View>
        )}
        contentContainerStyle={styles.achievementsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  statsCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
  },
  achievementsList: {
    padding: 16,
    paddingBottom: 32,
  },
  categoryHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementCard: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
    marginRight: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
