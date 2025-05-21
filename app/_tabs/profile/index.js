// app/_tabs/profile/index.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../../constants/AuthContext';
import { useTheme } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { isLoggedIn, isLoading: authLoading, signOut } = useAuth();
  const { userProfile } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Reload data when screen comes into focus
  useFocusEffect(
  useCallback(() => {
    const loadFreshData = async () => {
      if (!isLoggedIn) return;
      
      try {
        setLoading(true);
        
        // Get fresh data directly from storage without modifying it
        const savedUserData = await AsyncStorage.getItem('@user_data');
        
        if (savedUserData) {
          // Use the data exactly as saved from the edit screen
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFreshData();
  }, [isLoggedIn])
);


  // Initial load
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // First check authentication
        if (!isLoggedIn) {
          router.replace('/_auth/login');
          return;
        }

        // Get user data from storage
        const savedUserData = await AsyncStorage.getItem('@user_data');
        
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);
          // Set the email to the desired one
          parsedData.email = "sekouboundy@example.com";
          // Save the updated data
          await AsyncStorage.setItem('@user_data', JSON.stringify(parsedData));
          setUserData(parsedData);
        } else if (userProfile) {
          // If no saved data but we have a user profile, use that
          const profileData = {
            name: userProfile.fullName || 'User',
            email: "sekouboundy@example.com", 
            studentType: userProfile.studentType || '',
            gradeDescription: userProfile.gradeDescription || userProfile.studentType || '',
            joinDate: userProfile.joinDate || new Date().toLocaleDateString(),
            stats: {
              coursesCompleted: 0,
              lessonsCompleted: 0,
              quizzesPassed: 0,
              averageScore: 0
            }
          };
          
          setUserData(profileData);
          await AsyncStorage.setItem('@user_data', JSON.stringify(profileData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [isLoggedIn, userProfile]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut();
      router.replace('/_auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading state
  if (loading || authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.text, marginTop: 16 }}>Chargement du profil...</Text>
      </View>
    );
  }

  // If not logged in or no user data, redirect to login
  if (!isLoggedIn || !userData) {
    router.replace('/_auth/login');
    return null;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: theme.primary }]}>{getInitials(userData.name)}</Text>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{userData.name}</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userData.email}</Text>
        <View style={[styles.badgeContainer, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.badge, { color: theme.primary }]}>{userData.gradeDescription || userData.studentType}</Text>
        </View>
      </View>
      
      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Paramètres</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Mode sombre</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D1D5DB", true: "#4361FF" }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#D1D5DB", true: "#4361FF" }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={() => alert('Langue modifiée')}>
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Langue</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>Français</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={() => alert('Contactez-nous')}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Aide et support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Account Section */}
      <View style={styles.accountContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Compte</Text>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={() => router.push('/_tabs/profile/edit')}>
          <View style={styles.settingLeft}>
            <Ionicons name="person-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Modifier le profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]} onPress={() => alert('Mot de passe modifié')}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.textSecondary} style={styles.settingIcon} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Changer le mot de passe</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: isDarkMode ? '#491818' : '#FEE2E2' }
          ]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.versionText, { color: theme.textSecondary }]}>Revisio v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4361FF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4361FF',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: '#4361FF20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4361FF',
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statInnerCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4361FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  accountContainer: {
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 24,
  },
});