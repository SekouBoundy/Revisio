// app/(tabs)/profile.js - MVP VERSION WITH UPDATED STATS
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
  Alert,
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
  const [showAboutModal, setShowAboutModal] = useState(false);

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

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnecter', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

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

  const ProfileItem = ({ icon, title, value, onPress, showArrow = true, iconColor, badge }) => (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: theme.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (iconColor || theme.primary) + '15' }]}>
          <Ionicons name={icon} size={20} color={iconColor || theme.primary} />
          {badge && (
            <View style={[styles.badge, { backgroundColor: theme.error }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        {value && <Text style={[styles.itemValue, { color: theme.textSecondary }]}>{value}</Text>}
        {showArrow && onPress && (
          <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SwitchItem = ({ icon, title, value, onToggle, iconColor }) => (
    <View style={[styles.profileItem, { backgroundColor: theme.surface }]}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (iconColor || theme.primary) + '15' }]}>
          <Ionicons name={icon} size={20} color={iconColor || theme.primary} />
        </View>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.neutralLight, true: theme.primary + '40' }}
        thumbColor={value ? theme.primary : theme.surface}
      />
    </View>
  );

  // Updated StatsCard with MVP-appropriate metrics
  const StatsCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );

  const AboutModal = () => (
    <Modal
      visible={showAboutModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              À propos de l'application
            </Text>
            <TouchableOpacity 
              onPress={() => setShowAboutModal(false)}
              style={[styles.closeButton, { backgroundColor: theme.neutralLight }]}
            >
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.aboutContainer}>
              <View style={[styles.aboutIcon, { backgroundColor: theme.primary + '15' }]}>
                <Text style={[styles.aboutIconText, { color: theme.primary }]}>R</Text>
              </View>
              
              <Text style={[styles.aboutAppName, { color: theme.text }]}>Revisio</Text>
              <Text style={[styles.aboutVersion, { color: theme.textSecondary }]}>Version 1.0 (MVP)</Text>
              
              <View style={[styles.aboutSection, { backgroundColor: theme.surface }]}>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutEmoji}>🎯</Text>
                  <View style={styles.aboutTextContainer}>
                    <Text style={[styles.aboutLabel, { color: theme.text }]}>Objectif</Text>
                    <Text style={[styles.aboutValue, { color: theme.textSecondary }]}>
                      Aider les élèves maliens à réussir leurs études
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.aboutSection, { backgroundColor: theme.surface }]}>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutEmoji}>🛠️</Text>
                  <View style={styles.aboutTextContainer}>
                    <Text style={[styles.aboutLabel, { color: theme.text }]}>Créée par</Text>
                    <Text style={[styles.aboutValue, { color: theme.textSecondary }]}>
                      Sekou Boundy
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.aboutSection, { backgroundColor: theme.surface }]}>
                <View style={styles.aboutRow}>
                  <Text style={styles.aboutEmoji}>📩</Text>
                  <View style={styles.aboutTextContainer}>
                    <Text style={[styles.aboutLabel, { color: theme.text }]}>Contact</Text>
                    <TouchableOpacity>
                      <Text style={[styles.aboutValue, styles.aboutLink, { color: theme.primary }]}>
                        sekouboundy55@gmail.com
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={[styles.aboutValue, styles.aboutLink, { color: theme.primary }]}>
                        +223 93 18 43 67
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.aboutSection, { backgroundColor: theme.surface }]}>
                <Text style={[styles.aboutSectionTitle, { color: theme.text }]}>Fonctionnalités</Text>
                <View style={styles.featuresList}>
                  <Text style={[styles.featureItem, { color: theme.textSecondary }]}>
                    • Quiz interactifs pour DEF et BAC
                  </Text>
                  <Text style={[styles.featureItem, { color: theme.textSecondary }]}>
                    • Cours organisés par filière
                  </Text>
                  <Text style={[styles.featureItem, { color: theme.textSecondary }]}>
                    • Planning d'emploi du temps
                  </Text>
                  <Text style={[styles.featureItem, { color: theme.textSecondary }]}>
                    • Suivi des progrès
                  </Text>
                  <Text style={[styles.featureItem, { color: theme.textSecondary }]}>
                    • Mode sombre/clair
                  </Text>
                </View>
              </View>

              <View style={styles.aboutFooter}>
                <Text style={[styles.aboutCopyright, { color: theme.textSecondary }]}>
                  © 2024 Revisio - Tous droits réservés
                </Text>
                <Text style={[styles.aboutCopyright, { color: theme.textSecondary }]}>
                  Fait avec ❤️ au Mali
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
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
            <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choisir le niveau académique
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowLevelModal(false);
                  setShowBacOptions(false);
                }}
                style={[styles.closeButton, { backgroundColor: theme.neutralLight }]}
              >
                <Ionicons name="close" size={20} color={theme.textSecondary} />
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
                        borderColor: user?.level === 'DEF' ? theme.primary : theme.neutralLight
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
                      { color: user?.level === 'DEF' ? '#fff' : theme.textSecondary }
                    ]}>
                      Secondaire
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.mainLevelOption,
                      { 
                        backgroundColor: currentLevelIsBac ? theme.primary : theme.surface,
                        borderColor: currentLevelIsBac ? theme.primary : theme.neutralLight
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
                      { color: currentLevelIsBac ? '#fff' : theme.textSecondary }
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
                              borderColor: user?.level === spec.value ? theme.primary : theme.neutralLight
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
        <View style={[styles.header, { backgroundColor: theme.primary }]}>
          <View style={styles.headerContent}>
            <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
              <Text style={[styles.avatarText, { color: theme.primary }]}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
              <TouchableOpacity 
                style={[styles.editAvatarButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/edit-profile')}
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.userName, { color: '#FFFFFF' }]}>
              {user?.name || 'User Name'}
            </Text>
            <Text style={[styles.userEmail, { color: '#FFFFFF99' }]}>
              {user?.email || 'user@example.com'}
            </Text>
            <View style={[styles.levelBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Text style={[styles.levelText, { color: '#FFFFFF' }]}>
                Niveau: {user?.level === 'DEF' ? 'DEF (Secondaire)' : `BAC ${user?.level || ''}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Updated Stats Cards - MVP appropriate */}
        <View style={styles.statsContainer}>
          <StatsCard 
            title="Progression" 
            value="68%" 
            icon="trending-up" 
            color={theme.success} 
          />
          <StatsCard 
            title="Quiz" 
            value="12" 
            icon="help-circle" 
            color={theme.info} 
          />
          <StatsCard 
            title="Série" 
            value="5 jours" 
            icon="flame" 
            color={theme.warning} 
          />
        </View>

        {/* Simplified Account Section for MVP */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Compte</Text>
          
          <ProfileItem
            icon="person"
            title="Modifier le profil"
            onPress={() => router.push('/edit-profile')}
            iconColor={theme.primary}
          />
          
          <ProfileItem
            icon="school"
            title="Niveau académique"
            value={user?.level === 'DEF' ? 'DEF (Secondaire)' : `BAC ${user?.level || ''}`}
            onPress={() => setShowLevelModal(true)}
            iconColor={theme.secondary}
          />
        </View>

        {/* Simplified Preferences Section for MVP */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Préférences</Text>
          
          <SwitchItem
            icon="moon"
            title="Mode sombre"
            value={isDarkMode}
            onToggle={toggleTheme}
            iconColor={theme.primary}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          
          <ProfileItem
            icon="information-circle"
            title="À propos"
            onPress={() => setShowAboutModal(true)}
            iconColor={theme.info}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <LevelPickerModal />
      <AboutModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 12,
  },
  levelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  levelPickerContainer: {
    gap: 20,
  },
  mainLevelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mainLevelOption: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  mainLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainLevelSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  bacOptionsContainer: {
    marginTop: 8,
  },
  bacOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  bacOptionsGrid: {
    gap: 10,
  },
  bacOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  bacOptionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  // About Modal Styles
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  aboutIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutIconText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  aboutAppName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 16,
    marginBottom: 32,
  },
  aboutSection: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutEmoji: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  aboutTextContainer: {
    flex: 1,
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  aboutLink: {
    textDecorationLine: 'underline',
    marginBottom: 4,
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  aboutFooter: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
  },
  aboutCopyright: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});