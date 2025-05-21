// app/_tabs/study-planner/index.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../../constants/ThemeContext';

// Predefined subject options with colors
const SUBJECTS = [
  { id: 'math', name: 'Mathématiques', color: '#3B82F6' },
  { id: 'phys', name: 'Physique-Chimie', color: '#EC4899' },
  { id: 'fran', name: 'Français', color: '#F59E0B' },
  { id: 'hist', name: 'Histoire-Géo', color: '#8B5CF6' },
  { id: 'phil', name: 'Philosophie', color: '#10B981' },
  { id: 'lang', name: 'Langues', color: '#EF4444' },
  { id: 'svt', name: 'SVT', color: '#14B8A6' },
  { id: 'eco', name: 'Sciences Économiques', color: '#F97316' },
  { id: 'other', name: 'Autre', color: '#6B7280' }
];

export default function StudyPlannerScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [weeklyGoal, setWeeklyGoal] = useState(15); // Default 15 hours per week
  const [subjectGoals, setSubjectGoals] = useState({});
  const [studySessions, setStudySessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editGoalsModal, setEditGoalsModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    id: '',
    subject: '',
    title: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour from now
    duration: 60, // in minutes
    notes: '',
    recurring: false,
    completed: false
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  
  // Load data on component mount
  useEffect(() => {
    loadStudyData();
  }, []);
  
  // Load study planning data from storage
  async function loadStudyData() {
    try {
      const savedGoal = await AsyncStorage.getItem('@weekly_goal');
      if (savedGoal) {
        setWeeklyGoal(parseInt(savedGoal));
      }
      
      const savedSubjectGoals = await AsyncStorage.getItem('@subject_goals');
      if (savedSubjectGoals) {
        setSubjectGoals(JSON.parse(savedSubjectGoals));
      } else {
        // Default subject goals based on typical BAC study distribution
        const defaultGoals = {};
        SUBJECTS.forEach(subject => {
          if (subject.id === 'math') defaultGoals[subject.id] = 4;
          else if (subject.id === 'phys') defaultGoals[subject.id] = 3;
          else if (subject.id === 'fran') defaultGoals[subject.id] = 2;
          else defaultGoals[subject.id] = 1;
        });
        setSubjectGoals(defaultGoals);
        await AsyncStorage.setItem('@subject_goals', JSON.stringify(defaultGoals));
      }
      
      const savedSessions = await AsyncStorage.getItem('@study_sessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions).map(session => ({
          ...session,
          date: new Date(session.date),
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime)
        }));
        setStudySessions(parsedSessions.filter(session => !session.completed));
        setCompletedSessions(parsedSessions.filter(session => session.completed));
      }
    } catch (error) {
      console.error('Failed to load study data:', error);
      Alert.alert('Error', 'Failed to load your study data.');
    }
  }
  
  // Save study session data to storage
  async function saveStudySessions(sessions) {
    try {
      // Combine incomplete and completed sessions for storage
      const allSessions = [...sessions, ...completedSessions];
      await AsyncStorage.setItem('@study_sessions', JSON.stringify(allSessions));
    } catch (error) {
      console.error('Failed to save study sessions:', error);
      Alert.alert('Error', 'Failed to save your study sessions.');
    }
  }
  
  // Save subject goals to storage
  async function saveSubjectGoals(goals) {
    try {
      await AsyncStorage.setItem('@subject_goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save subject goals:', error);
      Alert.alert('Error', 'Failed to save your subject goals.');
    }
  }
  
  // Calculate progress towards goals
  function calculateProgress() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday as first day
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Filter for completed sessions this week
    const thisWeekSessions = completedSessions.filter(session => 
      new Date(session.date) >= startOfWeek && new Date(session.date) <= today
    );
    
    // Calculate total hours and breakdown by subject
    const totalMinutes = thisWeekSessions.reduce((sum, session) => sum + session.duration, 0);
    
    const bySubject = {};
    SUBJECTS.forEach(subject => {
      bySubject[subject.id] = 0;
    });
    
    thisWeekSessions.forEach(session => {
      if (bySubject[session.subject] !== undefined) {
        bySubject[session.subject] += session.duration;
      }
    });
    
    // Convert minutes to hours
    const totalHours = totalMinutes / 60;
    const subjectHours = {};
    Object.keys(bySubject).forEach(subjectId => {
      subjectHours[subjectId] = bySubject[subjectId] / 60;
    });
    
    return {
      totalHours,
      bySubject: subjectHours
    };
  }
  
  // Handle opening the session form modal
  function handleAddSession() {
    setSessionForm({
      id: '',
      subject: SUBJECTS[0].id,
      title: '',
      date: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour from now
      duration: 60, // in minutes
      notes: '',
      recurring: false,
      completed: false
    });
    setModalVisible(true);
  }
  
  // Handle editing an existing session
  function handleEditSession(session) {
    setSessionForm({
      ...session,
      date: new Date(session.date),
      startTime: new Date(session.startTime),
      endTime: new Date(session.endTime)
    });
    setModalVisible(true);
  }
  
  // Calculate session duration when times change
  function updateSessionDuration() {
    const { startTime, endTime } = sessionForm;
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Calculate duration in minutes
    const durationMs = end - start;
    const durationMinutes = Math.max(0, Math.round(durationMs / (1000 * 60)));
    
    setSessionForm(prev => ({
      ...prev,
      duration: durationMinutes
    }));
  }
  
  // Update end time when duration changes
  function updateEndTime(duration) {
    const { startTime } = sessionForm;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60 * 1000);
    
    setSessionForm(prev => ({
      ...prev,
      endTime: end,
      duration
    }));
  }
  
  // Handle changes to date/time pickers
  function handleDateTimeChange(event, selectedDate) {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      setShowStartTimePicker(false);
      setShowEndTimePicker(false);
      return;
    }
    
    if (selectedDate) {
      // Update the appropriate field based on which picker is open
      if (showDatePicker) {
        setSessionForm(prev => ({
          ...prev,
          date: selectedDate
        }));
        setShowDatePicker(false);
      } else if (showStartTimePicker) {
        // Preserve the date but update the time
        const updatedStart = new Date(sessionForm.date);
        updatedStart.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0
        );
        
        setSessionForm(prev => ({
          ...prev,
          startTime: updatedStart,
        }));
        
        // Also update end time to maintain duration
        const newEnd = new Date(updatedStart.getTime() + prev.duration * 60 * 1000);
        setSessionForm(prev => ({
          ...prev,
          endTime: newEnd,
        }));
        
        setShowStartTimePicker(false);
      } else if (showEndTimePicker) {
        // Preserve the date but update the time
        const updatedEnd = new Date(sessionForm.date);
        updatedEnd.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          0,
          0
        );
        
        setSessionForm(prev => ({
          ...prev,
          endTime: updatedEnd,
        }));
        
        // Update duration based on new end time
        updateSessionDuration();
        
        setShowEndTimePicker(false);
      }
    }
  }
  
  // Save study session
  function handleSaveSession() {
    if (!sessionForm.subject || !sessionForm.title) {
      Alert.alert('Error', 'Please enter a subject and title for your study session.');
      return;
    }
    
    const newSession = {
      ...sessionForm,
      id: sessionForm.id || Date.now().toString()
    };
    
    let updatedSessions;
    if (sessionForm.id) {
      // Update existing session
      updatedSessions = studySessions.map(session => 
        session.id === sessionForm.id ? newSession : session
      );
    } else {
      // Add new session
      updatedSessions = [...studySessions, newSession];
    }
    
    setStudySessions(updatedSessions);
    saveStudySessions(updatedSessions);
    setModalVisible(false);
  }
  
  // Delete study session
  function handleDeleteSession() {
    if (!sessionForm.id) {
      setModalVisible(false);
      return;
    }
    
    const updatedSessions = studySessions.filter(session => 
      session.id !== sessionForm.id
    );
    
    setStudySessions(updatedSessions);
    saveStudySessions(updatedSessions);
    setModalVisible(false);
  }
  
  // Mark session as completed
  function handleCompleteSession(sessionId) {
    const sessionIndex = studySessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return;
    
    const session = studySessions[sessionIndex];
    const completedSession = {...session, completed: true};
    
    // Remove from study sessions and add to completed sessions
    const updatedStudySessions = studySessions.filter(s => s.id !== sessionId);
    const updatedCompletedSessions = [...completedSessions, completedSession];
    
    setStudySessions(updatedStudySessions);
    setCompletedSessions(updatedCompletedSessions);
    
    // Save both arrays
    saveStudySessions(updatedStudySessions);
    
    try {
      AsyncStorage.setItem('@completed_sessions', JSON.stringify(updatedCompletedSessions));
    } catch (error) {
      console.error('Failed to save completed sessions:', error);
    }
  }
  
  // Update weekly study goal
  function handleUpdateWeeklyGoal(hours) {
    const numHours = parseInt(hours);
    if (isNaN(numHours) || numHours < 0) return;
    
    setWeeklyGoal(numHours);
    try {
      AsyncStorage.setItem('@weekly_goal', numHours.toString());
    } catch (error) {
      console.error('Failed to save weekly goal:', error);
    }
  }
  
  // Update subject-specific goals
  function handleUpdateSubjectGoal(subjectId, hours) {
    const numHours = parseInt(hours);
    if (isNaN(numHours) || numHours < 0) return;
    
    const updatedGoals = {...subjectGoals, [subjectId]: numHours};
    setSubjectGoals(updatedGoals);
    saveSubjectGoals(updatedGoals);
  }
  
  // Format date for display
  function formatDate(date) {
    if (!date) return '';
    
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
  
  // Format time for display
  function formatTime(date) {
    if (!date) return '';
    
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  }
  
  // Get today's study sessions
  function getTodaySessions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }
  
  // Get upcoming study sessions (excluding today)
  function getUpcomingSessions() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return studySessions.filter(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() > today.getTime();
    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }
  
  // Get subject name and color
  function getSubjectInfo(subjectId) {
    const subject = SUBJECTS.find(s => s.id === subjectId);
    if (!subject) return { name: 'Inconnu', color: '#6B7280' };
    return subject;
  }
  
  // Progress data
  const progress = calculateProgress();
  const todaySessions = getTodaySessions();
  const upcomingSessions = getUpcomingSessions();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Plan d'étude</Text>
        <TouchableOpacity 
          onPress={() => setEditGoalsModal(true)}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Weekly Goal Card */}
        <View style={[styles.weeklyGoalCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.goalHeader}>
            <Text style={[styles.goalTitle, { color: theme.text }]}>
              Objectif hebdomadaire
            </Text>
            <Text style={[styles.goalValue, { color: theme.primary }]}>
              {progress.totalHours.toFixed(1)} / {weeklyGoal}h
            </Text>
          </View>
          
          <View style={[styles.progressBarContainer, { backgroundColor: isDarkMode ? '#333' : '#E5E7EB' }]}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  width: `${Math.min(100, (progress.totalHours / weeklyGoal) * 100)}%`,
                  backgroundColor: theme.primary
                }
              ]} 
            />
          </View>
          
          <View style={styles.subjectGoalsContainer}>
            {SUBJECTS.map(subject => {
              if (!subjectGoals[subject.id]) return null;
              
              const subjectProgress = progress.bySubject[subject.id] || 0;
              const goalHours = subjectGoals[subject.id];
              
              return (
                <View key={subject.id} style={styles.subjectGoalItem}>
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectNameContainer}>
                      <View style={[styles.subjectColorDot, { backgroundColor: subject.color }]} />
                      <Text style={[styles.subjectName, { color: theme.text }]}>
                        {subject.name}
                      </Text>
                    </View>
                    <Text style={[styles.subjectHours, { color: theme.textSecondary }]}>
                      {subjectProgress.toFixed(1)}h / {goalHours}h
                    </Text>
                  </View>
                  
                  <View style={[styles.subjectProgressContainer, { backgroundColor: isDarkMode ? '#333' : '#E5E7EB' }]}>
                    <View 
                      style={[
                        styles.subjectProgressBar,
                        {
                          width: `${Math.min(100, (subjectProgress / goalHours) * 100)}%`,
                          backgroundColor: subject.color
                        }
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Today's Study Sessions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Aujourd'hui
            </Text>
            <TouchableOpacity onPress={handleAddSession}>
              <Text style={[styles.addSessionText, { color: theme.primary }]}>
                + Ajouter une session
              </Text>
            </TouchableOpacity>
          </View>
          
          {todaySessions.length > 0 ? (
            <View style={styles.sessionsContainer}>
              {todaySessions.map(session => {
                const subject = getSubjectInfo(session.subject);
                
                return (
                  <TouchableOpacity 
                    key={session.id}
                    style={[styles.sessionCard, { backgroundColor: theme.cardBackground }]}
                    onPress={() => handleEditSession(session)}
                  >
                    <View style={[styles.sessionColorBar, { backgroundColor: subject.color }]} />
                    
                    <View style={styles.sessionContent}>
                      <Text style={[styles.sessionTitle, { color: theme.text }]}>
                        {session.title}
                      </Text>
                      
                      <Text style={[styles.sessionSubject, { color: subject.color }]}>
                        {subject.name}
                      </Text>
                      
                      <View style={styles.sessionTimeContainer}>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </Text>
                      </View>
                      
                      {session.notes && (
                        <Text 
                          style={[styles.sessionNotes, { color: theme.textSecondary }]}
                          numberOfLines={1}
                        >
                          {session.notes}
                        </Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={() => handleCompleteSession(session.id)}
                    >
                      <Ionicons name="checkmark-circle-outline" size={28} color={theme.primary} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aucune session d'étude planifiée pour aujourd'hui
              </Text>
              <TouchableOpacity 
                style={[styles.emptyButton, { backgroundColor: theme.primary }]}
                onPress={handleAddSession}
              >
                <Text style={styles.emptyButtonText}>Planifier une session</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {/* Upcoming Study Sessions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Sessions à venir
            </Text>
          </View>
          
          {upcomingSessions.length > 0 ? (
            <View style={styles.sessionsContainer}>
              {upcomingSessions.map(session => {
                const subject = getSubjectInfo(session.subject);
                
                return (
                  <TouchableOpacity 
                    key={session.id}
                    style={[styles.sessionCard, { backgroundColor: theme.cardBackground }]}
                    onPress={() => handleEditSession(session)}
                  >
                    <View style={[styles.sessionColorBar, { backgroundColor: subject.color }]} />
                    
                    <View style={styles.sessionContent}>
                      <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
                        {formatDate(session.date)}
                      </Text>
                      
                      <Text style={[styles.sessionTitle, { color: theme.text }]}>
                        {session.title}
                      </Text>
                      
                      <Text style={[styles.sessionSubject, { color: subject.color }]}>
                        {subject.name}
                      </Text>
                      
                      <View style={styles.sessionTimeContainer}>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aucune session d'étude planifiée pour les prochains jours
              </Text>
            </View>
          )}
        </View>
        
        {/* Recent Completed Sessions */}
        {completedSessions.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Sessions terminées récemment
              </Text>
            </View>
            
            <View style={styles.sessionsContainer}>
              {completedSessions.slice(0, 3).map(session => { // Show only 3 most recent
                const subject = getSubjectInfo(session.subject);
                
                return (
                  <View 
                    key={session.id}
                    style={[
                      styles.sessionCard, 
                      { 
                        backgroundColor: theme.cardBackground,
                        opacity: 0.8
                      }
                    ]}
                  >
                    <View style={[styles.sessionColorBar, { backgroundColor: subject.color }]} />
                    
                    <View style={styles.sessionContent}>
                      <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>
                        {formatDate(session.date)}
                      </Text>
                      
                      <Text style={[styles.sessionTitle, { color: theme.text }]}>
                        {session.title}
                      </Text>
                      
                      <Text style={[styles.sessionSubject, { color: subject.color }]}>
                        {subject.name}
                      </Text>
                      
                      <View style={styles.sessionTimeContainer}>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={[styles.sessionTime, { color: theme.textSecondary }]}>
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.completedIcon}>
                      <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
        
        {/* Add Session Button */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddSession}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Planifier une session d'étude</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Add/Edit Session Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {sessionForm.id ? 'Modifier la session' : 'Planifier une session'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Titre</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={sessionForm.title}
                  onChangeText={(text) => setSessionForm({...sessionForm, title: text})}
                  placeholder="Titre de la session d'étude"
                  placeholderTextColor={theme.textSecondary + '80'}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subjectSelector}
                >
                  {SUBJECTS.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectOption,
                        sessionForm.subject === subject.id && { 
                          backgroundColor: subject.color + '30',
                          borderColor: subject.color
                        },
                        { borderColor: theme.border }
                      ]}
                      onPress={() => setSessionForm({...sessionForm, subject: subject.id})}
                    >
                      <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                      <Text 
                        style={[
                          styles.subjectOptionText,
                          { color: theme.text }
                        ]}
                      >
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateTimeInput,
                    { 
                      backgroundColor: theme.cardBackground,
                      borderColor: theme.border
                    }
                  ]}
                  onPress={() => {
                    setPickerMode('date');
                    setShowDatePicker(true);
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                  <Text style={[styles.dateTimeText, { color: theme.text }]}>
                    {formatDate(sessionForm.date)}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>Heure de début</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateTimeInput,
                      { 
                        backgroundColor: theme.cardBackground,
                        borderColor: theme.border
                      }
                    ]}
                    onPress={() => {
                      setPickerMode('time');
                      setShowStartTimePicker(true);
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: theme.text }]}>
                      {formatTime(sessionForm.startTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>Heure de fin</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateTimeInput,
                      { 
                        backgroundColor: theme.cardBackground,
                        borderColor: theme.border
                      }
                    ]}
                    onPress={() => {
                      setPickerMode('time');
                      setShowEndTimePicker(true);
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                    <Text style={[styles.dateTimeText, { color: theme.text }]}>
                      {formatTime(sessionForm.endTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Durée</Text>
                <View style={styles.durationContainer}>
                  <Text style={[styles.durationText, { color: theme.text }]}>
                    {sessionForm.duration} minutes
                  </Text>
                  <View style={styles.durationButtons}>
                    <TouchableOpacity
                      style={[styles.durationPreset, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => updateEndTime(30)}
                    >
                      <Text style={[styles.durationPresetText, { color: theme.primary }]}>30m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.durationPreset, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => updateEndTime(45)}
                    >
                      <Text style={[styles.durationPresetText, { color: theme.primary }]}>45m</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.durationPreset, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => updateEndTime(60)}
                    >
                      <Text style={[styles.durationPresetText, { color: theme.primary }]}>1h</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.durationPreset, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => updateEndTime(90)}
                    >
                      <Text style={[styles.durationPresetText, { color: theme.primary }]}>1h30</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.durationPreset, { backgroundColor: theme.primary + '20' }]}
                      onPress={() => updateEndTime(120)}
                    >
                      <Text style={[styles.durationPresetText, { color: theme.primary }]}>2h</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Notes</Text>
                <TextInput
                  style={[
                    styles.formTextarea,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={sessionForm.notes}
                  onChangeText={(text) => setSessionForm({...sessionForm, notes: text})}
                  placeholder="Notes ou objectifs pour cette session"
                  placeholderTextColor={theme.textSecondary + '80'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.recurringContainer}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Session récurrente</Text>
                <Switch
                  value={sessionForm.recurring}
                  onValueChange={(value) => setSessionForm({...sessionForm, recurring: value})}
                  trackColor={{ false: "#767577", true: theme.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              
              {sessionForm.recurring && (
                <View style={[styles.recurringInfo, { backgroundColor: theme.primary + '10' }]}>
                  <Text style={[styles.recurringText, { color: theme.text }]}>
                    Cette session sera répétée chaque semaine à la même heure.
                  </Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalActions}>
              {sessionForm.id && (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleDeleteSession}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveSession}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Edit Goals Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editGoalsModal}
        onRequestClose={() => setEditGoalsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Objectifs d'étude
              </Text>
              <TouchableOpacity onPress={() => setEditGoalsModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>
                  Objectif hebdomadaire (heures)
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={weeklyGoal.toString()}
                  onChangeText={handleUpdateWeeklyGoal}
                  keyboardType="numeric"
                />
              </View>
              
              <Text style={[styles.subjectGoalsTitle, { color: theme.text }]}>
                Objectifs par matière (heures par semaine)
              </Text>
              
              {SUBJECTS.map(subject => (
                <View key={subject.id} style={styles.subjectGoalEdit}>
                  <View style={styles.subjectGoalName}>
                    <View style={[styles.subjectColorDot, { backgroundColor: subject.color }]} />
                    <Text style={[styles.subjectGoalText, { color: theme.text }]}>
                      {subject.name}
                    </Text>
                  </View>
                  
                  <TextInput
                    style={[
                      styles.subjectGoalInput,
                      { 
                        backgroundColor: theme.cardBackground,
                        color: theme.text,
                        borderColor: theme.border
                      }
                    ]}
                    value={(subjectGoals[subject.id] || 0).toString()}
                    onChangeText={(text) => handleUpdateSubjectGoal(subject.id, text)}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary, marginTop: 16 }]}
              onPress={() => setEditGoalsModal(false)}
            >
              <Text style={styles.saveButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Date Time Picker (iOS & Android) */}
      {(showDatePicker || showStartTimePicker || showEndTimePicker) && (
        <DateTimePicker
          value={
            showDatePicker 
              ? sessionForm.date 
              : showStartTimePicker 
                ? sessionForm.startTime 
                : sessionForm.endTime
          }
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={handleDateTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  
  // Weekly goal card
  weeklyGoalCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 10,
    borderRadius: 5,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  subjectGoalsContainer: {
    marginTop: 8,
  },
  subjectGoalItem: {
    marginBottom: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '500',
  },
  subjectHours: {
    fontSize: 14,
    fontWeight: '400',
  },
  subjectProgressContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  
  // Section styling
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
    fontWeight: '600',
  },
  addSessionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Sessions styling
  sessionsContainer: {
    gap: 12,
  },
  sessionCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sessionColorBar: {
    width: 4,
  },
  sessionContent: {
    flex: 1,
    padding: 12,
  },
  sessionDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionSubject: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  sessionTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionTime: {
    fontSize: 14,
    marginLeft: 4,
  },
  sessionNotes: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  completeButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  completedIcon: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  
  // Empty state
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // Add button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 100,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Modal styling
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalForm: {
    marginBottom: 20,
  },
  
  // Form styling
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  subjectSelector: {
    paddingVertical: 8,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subjectOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateTimeText: {
    fontSize: 16,
    marginLeft: 8,
  },
  timeRow: {
    flexDirection: 'row',
  },
  durationContainer: {
    marginVertical: 8,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationPreset: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  durationPresetText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recurringInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  recurringText: {
    fontSize: 14,
  },
  
  // Modal actions
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Subject goals edit
  subjectGoalsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  subjectGoalEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectGoalName: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectGoalText: {
    fontSize: 16,
  },
  subjectGoalInput: {
    width: 60,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
});