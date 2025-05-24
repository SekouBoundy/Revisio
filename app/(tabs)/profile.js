// app/(tabs)/profile.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Modal,
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
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showBacOptions, setShowBacOptions] = useState(false);

  const bacSpecializations = [
    { value: 'TSE', label: 'Sciences Exactes (TSE)' },
    { value: 'TSEXP', label: 'Sciences Expérimentales (TSEXP)' },
    { value: 'TSECO', label: 'Sciences Économiques (TSECO)' },
    { value: 'TSS', label: 'Sciences Sociales (TSS)' },
    { value: 'TAL', label: 'Arts et Lettres (TAL)' },
    { value: 'TLL', label: 'Langues et Lettres (TLL)' },
    { value: 'STI', label: 'Sciences et Technologies Industrielles (STI)' },
    { value: 'STG', label: 'Sciences et Technologies de Gestion (STG)' },
  ];

  const handleLevelChange = (value) => {
    if (value === 'BAC') {
      setShowBacOptions(true);
    } else if (value === 'DEF') {
      setShowBacOptions(false);
      updateUser({ level: 'DEF' });
      setShowLevelModal(false);
    } else {
      updateUser({ level: value });
      setShowLevelModal(false);
    }
  };

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

  const LevelPickerModal = () => {
    const currentLevelIsBac = user?.level !== 'DEF';
    
    return (
      <Modal
        visible={showLevelModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choisir le niveau académique
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowLevelModal(false);
                  setShowBacOptions(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.levelPickerContainer}>
                <View style={styles.mainLevelContainer}>
                  <TouchableOpacity
                    style={[
                      styles.mainLevelOption,
                      { 
                        backgroundColor: user?.level === 'DEF' ? theme.primary : theme.surface,
                        borderColor: user?.level === 'DEF' ? theme.primary : theme.text + '20'
                      }
                    ]}
                    onPress={() => handleLevelChange('DEF')}
                  >
                    <Text style={[
                      styles.mainLevelText,
                      { color: user?.level === 'DEF' ? '#fff' : theme.text }
                    ]}>
                      DEF
                    </Text>
                    <Text style={[
                      styles.mainLevelSubtext,
                      { color: user?.level === 'DEF' ? '#fff' : theme.text + '80' }
                    ]}>
                      Secondaire
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.mainLevelOption,
                      { 
                        backgroundColor: currentLevelIsBac ? theme.primary : theme.surface,
                        borderColor: currentLevelIsBac ? theme.primary : theme.text + '20'
                      }
                    ]}
                    onPress={() => handleLevelChange('BAC')}
                  >
                    <Text style={[
                      styles.mainLevelText,
                      { color: currentLevelIsBac ? '#fff' : theme.text }
                    ]}>
                      BAC
                    </Text>
                    <Text style={[
                      styles.mainLevelSubtext,
                      { color: currentLevelIsBac ? '#fff' : theme.text + '80' }
                    ]}>
                      Baccalauréat
                    </Text>
                  </TouchableOpacity>
                </View>

                {(showBacOptions || currentLevelIsBac) && (
                  <View style={styles.bacOptionsContainer}>
                    <Text style={[styles.bacOptionsTitle, { color: theme.text }]}>
                      Choisissez votre spécialisation :
                    </Text>
                    <View style={styles.bacOptionsGrid}>
                      {bacSpecializations.map((spec) => (
                        <TouchableOpacity
                          key={spec.value}
                          style={[
                            styles.bacOption,
                            { 
                              backgroundColor: user?.level === spec.value ? theme.primary : theme.surface,
                              borderColor: user?.level === spec.value ? theme.primary : theme.text + '20'
                            }
                          ]}
                          onPress={() => handleLevelChange(spec.value)}
                        >
                          <Text style={[
                            styles.bacOptionText,
                            { color: user?.level === spec.value ? '#fff' : theme.text }
                          ]}>
                            {spec.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

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
          {user?.bio && (
            <Text style={[styles.userBio, { color: theme.text + '90' }]}>
              {user.bio}
            </Text>
          )}
          <View style={[styles.levelBadge, { backgroundColor: theme.primary + '20' }]}>
            <Text style={[styles.levelText, { color: theme.primary }]}>
              Niveau: {user?.level || 'DEF'}
            </Text>
          </View>
        </View>

        {/* Profile Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Compte</Text>
          
          <ProfileItem
            icon="person-outline"
            title="Modifier le profil"
            onPress={() => router.push('/edit-profile')}
          />
          
          <ProfileItem
            icon="school-outline"
            title="Niveau académique"
            value={user?.level === 'DEF' ? 'DEF (Secondaire)' : `BAC ${user?.level || ''}`}
            onPress={() => setShowLevelModal(true)}
          />
          
          <ProfileItem
            icon="trophy-outline"
            title="Réussites"
            onPress={() => console.log('Achievements')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Préférences</Text>
          
          <SwitchItem
            icon="moon-outline"
            title="Mode sombre"
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
            title="Langue"
            value="Français"
            onPress={() => console.log('Language')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          
          <ProfileItem
            icon="help-circle-outline"
            title="Aide et support"
            onPress={() => console.log('Help')}
          />
          
          <ProfileItem
            icon="information-circle-outline"
            title="À propos"
            onPress={() => console.log('About')}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#FF3B30' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <LevelPickerModal />
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
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  levelPickerContainer: {
    gap: 16,
  },
  mainLevelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mainLevelOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  mainLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainLevelSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  bacOptionsContainer: {
    marginTop: 8,
  },
  bacOptionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bacOptionsGrid: {
    gap: 8,
  },
  bacOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  bacOptionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});