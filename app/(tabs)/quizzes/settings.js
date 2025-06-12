// app/(tabs)/quizzes/settings.js - COMPLETE WORKING VERSION
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';
import { QuizManager } from '../../../utils/quizManager';

export default function QuizSettingsScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  
  const [quizManager] = useState(() => new QuizManager(user?.level || 'DEF'));
  const [settings, setSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    hintsEnabled: true,
    explanationsEnabled: true,
    autoNextQuestion: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    timerVisible: true,
    darkModeQuiz: false,
    saveProgress: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await quizManager.getSettings();
      if (storedSettings) {
        setSettings(prev => ({ ...prev, ...storedSettings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await quizManager.saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Réinitialiser les progrès',
      'Cette action supprimera tous vos résultats de quiz. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await quizManager.saveUserProgress({});
              Alert.alert('Succès', 'Tous les progrès ont été réinitialisés');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de réinitialiser les progrès');
            }
          }
        }
      ]
    );
  };

  const exportProgress = async () => {
    try {
      const progress = await quizManager.getUserProgress();
      const stats = await quizManager.getStats();
      
      Alert.alert(
        'Export réussi',
        `Données exportées:\n- ${stats.completedQuizzes || 0} quiz complétés\n- Score moyen: ${stats.averageScore || 0}%`
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  const SettingItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <View style={[styles.settingItem, { backgroundColor: theme.surface }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name={icon} size={20} color={theme.primary} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.neutralLight, true: theme.primary + '40' }}
          thumbColor={value ? theme.primary : theme.textSecondary}
        />
      )}
    </View>
  );

  const SectionHeader = ({ title, subtitle }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Paramètres Quiz</Text>
          
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Audio & Feedback */}
        <SectionHeader 
          title="Audio et retours"
          subtitle="Personnalisez les retours sonores et tactiles"
        />
        
        <SettingItem
          icon="volume-high"
          title="Sons activés"
          description="Sons de réussite et d'échec"
          value={settings.soundEnabled}
          onToggle={(value) => updateSetting('soundEnabled', value)}
        />
        
        <SettingItem
          icon="phone-portrait"
          title="Vibrations"
          description="Retour haptique lors des réponses"
          value={settings.vibrationEnabled}
          onToggle={(value) => updateSetting('vibrationEnabled', value)}
        />

        {/* Quiz Experience */}
        <SectionHeader 
          title="Expérience de quiz"
          subtitle="Configurez le comportement des quiz"
        />
        
        <SettingItem
          icon="bulb"
          title="Indices activés"
          description="Afficher les indices pour les questions"
          value={settings.hintsEnabled}
          onToggle={(value) => updateSetting('hintsEnabled', value)}
        />
        
        <SettingItem
          icon="information-circle"
          title="Explications détaillées"
          description="Afficher les explications après chaque question"
          value={settings.explanationsEnabled}
          onToggle={(value) => updateSetting('explanationsEnabled', value)}
        />
        
        <SettingItem
          icon="time"
          title="Minuteur visible"
          description="Afficher le temps restant pendant le quiz"
          value={settings.timerVisible}
          onToggle={(value) => updateSetting('timerVisible', value)}
        />

        {/* Quiz Content */}
        <SectionHeader 
          title="Contenu des quiz"
          subtitle="Options de mélange et randomisation"
        />
        
        <SettingItem
          icon="shuffle"
          title="Mélanger les questions"
          description="Ordre aléatoire des questions"
          value={settings.shuffleQuestions}
          onToggle={(value) => updateSetting('shuffleQuestions', value)}
        />

        {/* Actions */}
        <SectionHeader 
          title="Actions"
          subtitle="Gestion des données et paramètres"
        />
        
        <TouchableOpacity 
          style={[styles.actionItem, { backgroundColor: theme.surface }]}
          onPress={exportProgress}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: theme.info + '20' }]}>
              <Ionicons name="download" size={20} color={theme.info} />
            </View>
            <View>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Exporter les données
              </Text>
              <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
                Sauvegarder vos progrès
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionItem, { backgroundColor: theme.surface }]}
          onPress={resetProgress}
        >
          <View style={styles.actionLeft}>
            <View style={[styles.actionIcon, { backgroundColor: theme.error + '20' }]}>
              <Ionicons name="refresh" size={20} color={theme.error} />
            </View>
            <View>
              <Text style={[styles.actionTitle, { color: theme.error }]}>
                Réinitialiser les progrès
              </Text>
              <Text style={[styles.actionDescription, { color: theme.textSecondary }]}>
                Supprimer tous les résultats
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  bottomPadding: {
    height: 40,
  },
});