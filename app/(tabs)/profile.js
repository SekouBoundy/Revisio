// app/(tabs)/profile.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';
import { useAuth } from '../../constants/AuthContext';

export default function ProfileScreen() {
  const { theme, toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { user, updateUser } = useUser();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const ProfileItem = ({ icon, title, value, onPress, showArrow = true }) => (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: theme.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={[styles.itemValue, { color: theme.text }]}>{value}</Text>}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={20} color={theme.text} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SwitchItem = ({ icon, title, value, onToggle }) => (
    <View style={[styles.profileItem, { backgroundColor: theme.surface }]}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: theme.primary }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.name || 'User Name'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.text + '80' }]}>
            {user?.email || 'user@example.com'}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.levelText, { color: theme.primary }]}>
              Level: {user?.level || 'DEF'}
            </Text>
          </View>
        </View>

        {/* Profile Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          <ProfileItem
            icon="person-outline"
            title="Edit Profile"
            onPress={() => console.log('Edit Profile')}
          />
          
          <ProfileItem
            icon="school-outline"
            title="Academic Level"
            value={user?.level === 'DEF' ? 'DEUG/Formation' : 'Baccalauréat'}
            onPress={() => console.log('Change Level')}
          />
          
          <ProfileItem
            icon="trophy-outline"
            title="Achievements"
            onPress={() => console.log('Achievements')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          
          <SwitchItem
            icon="moon-outline"
            title="Dark Mode"
            value={isDarkMode}
            onToggle={toggleTheme}
          />
          
          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => console.log('Notifications')}
          />
          
          <ProfileItem
            icon="language-outline"
            title="Language"
            value="English"
            onPress={() => console.log('Language')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          
          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => console.log('Help')}
          />
          
          <ProfileItem
            icon="information-circle-outline"
            title="About"
            onPress={() => console.log('About')}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});