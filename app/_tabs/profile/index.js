// app/_tabs/profile/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Mock user data
const USER = {
  name: 'Amadou Diallo',
  email: 'amadou.diallo@example.com',
  studentType: 'BAC',
  joinDate: 'Septembre 2023',
  stats: {
    coursesCompleted: 3,
    lessonsCompleted: 24,
    quizzesPassed: 8,
    averageScore: 87
  }
};

export default function ProfileScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(USER.name)}</Text>
        </View>
        <Text style={styles.userName}>{USER.name}</Text>
        <Text style={styles.userEmail}>{USER.email}</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>{USER.studentType}</Text>
        </View>
      </View>
      
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.coursesCompleted}</Text>
            <Text style={styles.statLabel}>Cours terminés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Leçons complétées</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.quizzesPassed}</Text>
            <Text style={styles.statLabel}>Quiz réussis</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{USER.stats.averageScore}%</Text>
            <Text style={styles.statLabel}>Score moyen</Text>
          </View>
        </View>
      </View>
      
      {/* Settings Section */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Mode sombre</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#D1D5DB", true: "#4361FF" }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#D1D5DB", true: "#4361FF" }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => alert('Langue modifiée')}>
          <View style={styles.settingLeft}>
            <Ionicons name="language-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Langue</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>Français</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => alert('Contactez-nous')}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Aide et support</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      
      {/* Account Section */}
      <View style={styles.accountContainer}>
        <Text style={styles.sectionTitle}>Compte</Text>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/_tabs/profile/edit')}>
          <View style={styles.settingLeft}>
            <Ionicons name="person-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Modifier le profil</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem} onPress={() => alert('Mot de passe modifié')}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#4B5563" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>Changer le mot de passe</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/_auth/login')}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.versionText}>Revisio v1.0.0</Text>
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