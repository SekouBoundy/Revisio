// components/headers/EnhancedHeaders.js - HEADERS WITH MASCOT

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../constants/ThemeContext';
import { HeaderMascot } from '../Mascot';

// Dashboard Header with Mascot
export function DashboardHeader({ user, onProfilePress, onNotificationPress }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <HeaderMascot 
            screen="dashboard" 
            theme={theme}
            onPress={() => console.log('Mascot says hello!')}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerGreeting, { color: '#FFFFFF99' }]}>
              Salut,
            </Text>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              {user?.name || 'Étudiant'} 👋
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onProfilePress}
          >
            <Ionicons name="person-circle-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Courses Header with Mascot
export function CoursesHeader({ user, onSearchPress, onFilterPress }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <HeaderMascot 
            screen="courses" 
            theme={theme}
            onPress={() => console.log('Ready to study!')}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
              Mes Cours {user?.level}
            </Text>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              Bibliothèque
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onSearchPress}
          >
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onFilterPress}
          >
            <Ionicons name="filter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Timetable Header with Mascot
export function TimetableHeader({ user, onCalendarPress, onEditPress, isEditMode }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <HeaderMascot 
            screen="timetable" 
            theme={theme}
            onPress={() => console.log('Time to check schedule!')}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
              {user?.level === 'DEF' ? 'Mon Planning DEF' : `Planning ${user?.level}`}
            </Text>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              Emploi du Temps
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: isEditMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)'
            }]}
            onPress={onEditPress}
          >
            <Ionicons 
              name={isEditMode ? "checkmark" : "pencil"} 
              size={18} 
              color={isEditMode ? theme.primary : '#FFFFFF'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onCalendarPress}
          >
            <Ionicons name="calendar" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Quiz Header with Mascot
export function QuizHeader({ 
  quizTitle, 
  progress, 
  onBackPress, 
  quizState = 'start' // 'start', 'progress', 'success', 'fail'
}) {
  const { theme } = useContext(ThemeContext);
  
  const getMascotScreen = () => {
    switch (quizState) {
      case 'success': return 'quizSuccess';
      case 'fail': return 'quizFail';
      default: return 'quiz';
    }
  };
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <HeaderMascot 
            screen={getMascotScreen()} 
            theme={theme}
            onPress={() => {
              const messages = {
                start: 'Bonne chance !',
                success: 'Bravo ! 🎉',
                fail: 'Ne lâche pas ! 💪'
              };
              console.log(messages[quizState] || 'Courage !');
            }}
          />
          <View style={styles.quizInfo}>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              {quizTitle}
            </Text>
            {progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: '#FFFFFF',
                        width: `${progress * 100}%`
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: '#FFFFFF99' }]}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.headerRight} />
      </View>
    </View>
  );
}

// Profile Header with Mascot
export function ProfileHeader({ user, onEditPress, onSettingsPress }) {
  const { theme } = useContext(ThemeContext);
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <HeaderMascot 
            screen="profile" 
            theme={theme}
            onPress={() => console.log('Hello champion!')}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
              Mon Profil
            </Text>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              {user?.name || 'Utilisateur'}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onEditPress}
          >
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={onSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerRight: {
    width: 80, // Balance the layout
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerGreeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizInfo: {
    marginLeft: 12,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
  },
});