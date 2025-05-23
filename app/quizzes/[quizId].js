// app/(tabs)/profile/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Card from '../../components/common/Card';
import * as Theme from '../../constants/Theme';

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
      total: 1
    },
    {
      id: 'achievement-2',
      title: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes',
      icon: 'ribbon-outline',
      completed: false,
      progress: 3,
      total: 5
    },
    {
      id: 'achievement-3',
      title: 'Learning Streak',
      description: 'Study for 7 consecutive days',
      icon: 'flame-outline',
      completed: false,
      progress: 4,
      total: 7
    }
  ];

  // Dummy stats data
  const stats = {
    coursesCompleted: 2,
    quizzesTaken: 15,
    averageScore: 87,
    totalStudyTime: 32, // hours
    streak: 4 // days
  };

  // Load user profile on mount
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const storedProfile = await SecureStore.getItemAsync('userProfile');
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          // Fallback profile if none exists
          setUserProfile({
            fullName: 'Student User',
            email: 'student@example.com',
            studentType: 'BAC'
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback profile
        setUserProfile({
          fullName: 'Student User',
          email: 'student@example.com',
          studentType: 'BAC'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      // Navigate to login
      router.replace('/_auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading || !userProfile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContent}>
          <Text style={{ color: theme.colors.text }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View 
              style={[
                styles.avatarContainer, 
                { backgroundColor: theme.colors.primary + '20' }
              ]}
            >
              <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                {userProfile.fullName.split(' ').map(name => name[0]).join('').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {userProfile.fullName}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.text + '80' }]}>
                {userProfile.email}
              </Text>
              <View style={styles.userTypeContainer}>
                <Text style={[styles.userType, { color: theme.colors.primary }]}>
                  {userProfile.studentType === 'BAC' ? 'BAC Student' : 
                   userProfile.studentType === 'DEF' ? 'DEF Student' : 'Language Student'}
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.colors.border }]}
            onPress={() => router.push('/(tabs)/profile/edit')}
          >
            <Ionicons name="pencil-outline" size={16} color={theme.colors.text} />
            <Text style={[styles.editButtonText, { color: theme.colors.text }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.coursesCompleted}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                Courses
              </Text>
            </View>
            
            <View 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons name="clipboard-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.quizzesTaken}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                Quizzes
              </Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.averageScore}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                Avg. Score
              </Text>
            </View>
            
            <View 
              style={[
                styles.statCard, 
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border
                }
              ]}
            >
              <Ionicons name="flame-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {stats.streak}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                Day Streak
              </Text>
            </View>
          </View>
        </View>
        
        {/* Achievements Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Achievements
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile/achievements')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {achievements.map(achievement => (
            <Card
              key={achievement.id}
              style={[
                styles.achievementCard, 
                { opacity: achievement.completed ? 1 : 0.7 }
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
                    name={achievement.icon} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                </View>
                
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: theme.colors.text + '80' }]}>
                    {achievement.description}
                  </Text>
                  
                  {!achievement.completed && (
                    <View style={styles.progressContainer}>
                      <View 
                        style={[
                          styles.progressBar,
                          {
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                            backgroundColor: theme.colors.primary
                          }
                        ]}
                      />
                      <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>
                        {achievement.progress}/{achievement.total}
                      </Text>
                    </View>
                  )}
                </View>
                
                {achievement.completed && (
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
          ))}
        </View>
        
        {/* Settings and Logout */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.card }
            ]}
            onPress={() => {
              // Handle settings navigation
            }}
          >
            <Ionicons name="settings-outline" size={20} color={theme.colors.text} />
            <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text + '60'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.card }
            ]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
              Logout
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.text + '60'} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  userTypeContainer: {
    alignSelf: 'flex-start',
  },
  userType: {
    fontSize: 12,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
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
  progressContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    marginLeft: 8,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
});
