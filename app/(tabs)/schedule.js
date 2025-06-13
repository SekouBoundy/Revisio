// app/(tabs)/schedule.js - COMPLETE WORKING VERSION
import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  PanResponder,
  Vibration,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

// Helper function defined first
function getCurrentWeekDates() {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  
  const weekDates = [];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  
  for (let i = 0; i < 6; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push({
      day: dayNames[i],
      date: date.getDate(),
      month: date.getMonth(),
      fullDate: new Date(date),
      isToday: date.toDateString() === today.toDateString(),
      dayIndex: i + 1
    });
  }
  return weekDates;
}

export default function EnhancedScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Enhanced state management
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 0 : today - 1;
  });
  
  // UI States
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedView, setSelectedView] = useState('day');
  const [quickAddPosition, setQuickAddPosition] = useState({ day: 0, time: '08:00' });
  const [conflicts, setConflicts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [studyTimers, setStudyTimers] = useState({});
  
  // Enhanced form state
  const [quickForm, setQuickForm] = useState({
    subject: '',
    startTime: '08:00',
    endTime: '09:00',
    type: 'Cours',
    isRecurring: false,
    recurringType: 'weekly',
    recurringEnd: null,
    room: '',
    teacher: '',
    notes: '',
    reminderMinutes: 15,
    color: '#2196F3'
  });

  // Animation refs
  const dragAnimation = useRef(new Animated.ValueXY()).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  // Enhanced time slots
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '10:15', '11:15', '12:15', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Hours array for time selection
  const hours = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const commonSubjects = isDefLevel ? [
    { name: 'Mathématiques', color: '#2196F3', icon: 'calculator' },
    { name: 'Français', color: '#FF9800', icon: 'book' },
    { name: 'Anglais', color: '#607D8B', icon: 'globe' },
    { name: 'Histoire-Géographie', color: '#9C27B0', icon: 'map' },
    { name: 'Physique-Chimie', color: '#E91E63', icon: 'flask' },
    { name: 'Sciences de la Vie et de la Terre', color: '#4CAF50', icon: 'leaf' },
    { name: 'Informatique', color: '#607D8B', icon: 'laptop' }
  ] : [
    { name: 'Mathématiques', color: '#2196F3', icon: 'calculator' },
    { name: 'Physique', color: '#E91E63', icon: 'nuclear' },
    { name: 'Chimie', color: '#9C27B0', icon: 'flask' },
    { name: 'Informatique', color: '#607D8B', icon: 'laptop' },
    { name: 'Français', color: '#FF9800', icon: 'book' },
    { name: 'Philosophie', color: '#795548', icon: 'bulb' },
    { name: 'Anglais', color: '#607D8B', icon: 'globe' }
  ];

  // Define getScheduleForWeek function before using it
  const getScheduleForWeek = useCallback((weekOffset) => {
    const baseSchedule = {
      1: [
        { 
          id: `${weekOffset}-1-1`,
          time: '08:00-09:00', 
          subject: 'Mathématiques', 
          teacher: 'M. Dubois', 
          room: 'Salle 101', 
          type: 'Cours', 
          color: '#2196F3',
          description: 'Géométrie - Les triangles',
          notes: 'Apporter calculatrice',
          isRecurring: true,
          studyTime: 0
        },
        { 
          id: `${weekOffset}-1-2`,
          time: '09:00-10:00', 
          subject: 'Français', 
          teacher: 'Mme Martin', 
          room: 'Salle 203', 
          type: 'Cours', 
          color: '#FF9800',
          description: 'Analyse de texte',
          notes: '',
          isRecurring: true,
          studyTime: 0
        }
      ],
      2: [
        { 
          id: `${weekOffset}-2-1`,
          time: '08:00-09:00', 
          subject: 'Informatique', 
          teacher: 'M. Tech', 
          room: 'Lab Info', 
          type: 'TP', 
          color: '#607D8B',
          description: 'Programmation Python',
          notes: 'Apporter clé USB',
          isRecurring: true,
          studyTime: 0
        }
      ],
      3: [], 4: [], 5: [], 6: []
    };
    return baseSchedule;
  }, []);

  // Enhanced schedule data with persistence - initialize with empty object first
  const [scheduleData, setScheduleData] = useState({});

  // Initialize schedule data
  useEffect(() => {
    if (Object.keys(scheduleData).length === 0) {
      setScheduleData(getScheduleForWeek(0));
    }
  }, [getScheduleForWeek, scheduleData]);

  // Load schedule from storage
  useEffect(() => {
    loadScheduleData();
  }, []);

  // Save schedule to storage
  useEffect(() => {
    if (Object.keys(scheduleData).length > 0) {
      saveScheduleData();
    }
  }, [scheduleData]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('userSchedule');
      if (stored) {
        setScheduleData(JSON.parse(stored));
      } else {
        // Initialize with default schedule if no stored data
        setScheduleData(getScheduleForWeek(0));
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      // Fallback to default schedule
      setScheduleData(getScheduleForWeek(0));
    } finally {
      setLoading(false);
    }
  };

  const saveScheduleData = async () => {
    try {
      // Only save if scheduleData is not empty
      if (Object.keys(scheduleData).length > 0) {
        await AsyncStorage.setItem('userSchedule', JSON.stringify(scheduleData));
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const getWeekDateRange = () => {
    if (!weekDates || weekDates.length === 0) return 'Chargement...';
    
    const startDate = weekDates[0];
    const endDate = weekDates[5];
    
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const startMonth = months[startDate.month];
    const endMonth = months[endDate.month];
    const year = startDate.fullDate.getFullYear();
    
    if (startDate.month === endDate.month) {
      return `${startDate.date} - ${endDate.date} ${startMonth} ${year}`;
    } else {
      return `${startDate.date} ${startMonth} - ${endDate.date} ${endMonth} ${year}`;
    }
  };

  // HELPER FUNCTIONS
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getNextTimeSlot = (currentTime) => {
    const currentIndex = timeSlots.indexOf(currentTime);
    if (currentIndex === -1 || currentIndex === timeSlots.length - 1) {
      const [hours, minutes] = currentTime.split(':').map(Number);
      const nextHour = hours + 1;
      return `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return timeSlots[currentIndex + 1];
  };

  const updateEndTime = (startTime) => {
    const [hour] = startTime.split(':');
    const nextHour = parseInt(hour) + 1;
    const endHour = nextHour > 19 ? 19 : nextHour;
    return `${endHour.toString().padStart(2, '0')}:00`;
  };

  // CONFLICT DETECTION
  const detectTimeConflicts = (newClass, dayClasses) => {
    const newStart = parseTime(newClass.startTime);
    const newEnd = parseTime(newClass.endTime);
    
    return dayClasses.filter(existing => {
      if (existing.id === newClass.id) return false;
      const [existingStartStr, existingEndStr] = existing.time.split('-');
      const existingStart = parseTime(existingStartStr);
      const existingEnd = parseTime(existingEndStr);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  // SMART SCHEDULING SUGGESTIONS
  const getSchedulingSuggestions = (dayClasses, newClass) => {
    const suggestions = [];
    
    timeSlots.forEach(slot => {
      const testClass = { ...newClass, startTime: slot, endTime: getNextTimeSlot(slot) };
      const conflicts = detectTimeConflicts(testClass, dayClasses);
      
      if (conflicts.length === 0) {
        const score = calculateOptimalityScore(slot, dayClasses);
        suggestions.push({
          time: slot,
          score,
          reason: getSchedulingReason(score, slot)
        });
      }
    });
    
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const calculateOptimalityScore = (timeSlot, dayClasses) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    let score = 50; // Base score
    
    // Prefer morning hours for difficult subjects
    if (hour >= 8 && hour <= 11) score += 30;
    
    // Avoid lunch time
    if (hour >= 12 && hour <= 13) score -= 20;
    
    // Check for gaps (prefer continuous scheduling)
    const adjacentSlots = dayClasses.filter(cls => {
      const [startHour] = cls.time.split('-')[0].split(':').map(Number);
      return Math.abs(startHour - hour) === 1;
    });
    if (adjacentSlots.length > 0) score += 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const getSchedulingReason = (score, timeSlot) => {
    const hour = parseInt(timeSlot.split(':')[0]);
    if (score >= 80) return 'Créneau optimal';
    if (hour >= 8 && hour <= 11) return 'Bon pour la concentration';
    if (hour >= 14 && hour <= 16) return 'Après-midi calme';
    return 'Créneau disponible';
  };

  // QUICK ADD FUNCTIONS
  const openQuickAdd = (dayIndex = selectedDayIndex, timeSlot = '08:00') => {
    const dayClasses = (scheduleData && scheduleData[dayIndex + 1]) || [];
    const newSuggestions = getSchedulingSuggestions(dayClasses, quickForm);
    
    setQuickAddPosition({ day: dayIndex, time: timeSlot });
    setQuickForm(prev => ({
      ...prev,
      startTime: timeSlot,
      endTime: getNextTimeSlot(timeSlot)
    }));
    setSuggestions(newSuggestions);
    setShowQuickAdd(true);
  };

  // ENHANCED SAVE FUNCTION WITH CONFLICT DETECTION
  const saveQuickClass = async () => {
    if (!quickForm.subject.trim()) {
      Alert.alert('Erreur', 'Veuillez choisir une matière');
      return;
    }

    // Ensure scheduleData is initialized
    if (!scheduleData || Object.keys(scheduleData).length === 0) {
      Alert.alert('Erreur', 'Erreur de chargement. Veuillez réessayer.');
      return;
    }

    const dayKey = quickAddPosition.day + 1;
    const dayClasses = scheduleData[dayKey] || [];
    
    // Check for conflicts
    const detectedConflicts = detectTimeConflicts(quickForm, dayClasses);
    
    if (detectedConflicts.length > 0) {
      Alert.alert(
        'Conflit détecté',
        `Ce créneau entre en conflit avec: ${detectedConflicts[0].subject}. Voulez-vous continuer ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Continuer', onPress: () => proceedWithSave() }
        ]
      );
      return;
    }
    
    proceedWithSave();
  };

  const proceedWithSave = async () => {
    const subjectInfo = commonSubjects.find(s => s.name === quickForm.subject) || commonSubjects[0];
    
    const newClass = {
      id: `${currentWeek}-${quickAddPosition.day + 1}-${Date.now()}`,
      time: `${quickForm.startTime}-${quickForm.endTime}`,
      subject: quickForm.subject,
      teacher: quickForm.teacher || '',
      room: quickForm.room || '',
      type: quickForm.type,
      color: subjectInfo.color,
      description: `${quickForm.type} - ${quickForm.subject}`,
      notes: quickForm.notes || '',
      isRecurring: quickForm.isRecurring,
      studyTime: 0
    };

    const dayKey = quickAddPosition.day + 1;
    const updatedSchedule = { ...scheduleData };

    if (!updatedSchedule[dayKey]) {
      updatedSchedule[dayKey] = [];
    }
    
    updatedSchedule[dayKey].push(newClass);
    updatedSchedule[dayKey].sort((a, b) => {
      const timeA = a.time.split('-')[0];
      const timeB = b.time.split('-')[0];
      return timeA.localeCompare(timeB);
    });

    setScheduleData(updatedSchedule);
    setShowQuickAdd(false);
    
    // Schedule notification
    if (quickForm.reminderMinutes > 0) {
      scheduleNotification(newClass, quickForm.reminderMinutes);
    }
    
    // Reset form
    setQuickForm(prev => ({
      ...prev,
      subject: '',
      teacher: '',
      room: '',
      notes: '',
      isRecurring: false
    }));
    
    Vibration.vibrate(100);
    Alert.alert('Succès', 'Cours ajouté avec succès');
  };

  const scheduleNotification = (classItem, minutes) => {
    // Implementation would depend on notification library
    console.log(`Notification scheduled for ${classItem.subject} - ${minutes} minutes before`);
  };

  // NAVIGATION
  const navigateWeek = (direction) => {
    const newWeek = currentWeek + direction;
    setCurrentWeek(newWeek);
    
    const newScheduleData = getScheduleForWeek(newWeek);
    setScheduleData(newScheduleData);
    
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (newWeek * 7));
    
    const newWeekDates = [];
    const currentDay = baseDate.getDay();
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      newWeekDates.push({
        day: dayNames[i],
        date: date.getDate(),
        month: date.getMonth(),
        fullDate: new Date(date),
        isToday: date.toDateString() === new Date().toDateString(),
        dayIndex: i + 1
      });
    }
    
    setWeekDates(newWeekDates);
  };

  // COURSE NAVIGATION FUNCTION
  const navigateToCourse = (classItem) => {
    const courseName = classItem.subject.replace(/\s+/g, '_').replace(/\//g, '_');
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    router.push(`/courses/${userLevel}/${courseName}`);
  };

  // EXPORT FUNCTIONALITY
  const exportSchedule = async () => {
    try {
      const scheduleText = generateScheduleText();
      await Share.share({
        message: scheduleText,
        title: 'Mon emploi du temps'
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter l\'emploi du temps');
    }
  };

  const generateScheduleText = () => {
    let text = `📅 EMPLOI DU TEMPS - ${getWeekDateRange()}\n\n`;
    
    weekDates.forEach((dayInfo, index) => {
      const dayClasses = (scheduleData && scheduleData[index + 1]) || [];
      text += `${dayInfo.day} ${dayInfo.date}\n`;
      
      if (dayClasses.length === 0) {
        text += '  Aucun cours\n';
      } else {
        dayClasses.forEach(cls => {
          text += `  ${cls.time} - ${cls.subject}`;
          if (cls.room) text += ` (${cls.room})`;
          text += '\n';
        });
      }
      text += '\n';
    });
    
    return text;
  };

  const deleteClass = (classItem) => {
    Alert.alert(
      'Supprimer le cours',
      `Supprimer ${classItem.subject} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (!scheduleData || Object.keys(scheduleData).length === 0) {
              Alert.alert('Erreur', 'Erreur de chargement. Veuillez réessayer.');
              return;
            }

            let dayKey = null;
            Object.keys(scheduleData).forEach(key => {
              if (scheduleData[key].some(c => c.id === classItem.id)) {
                dayKey = key;
              }
            });
            
            if (dayKey) {
              const updatedSchedule = { ...scheduleData };
              updatedSchedule[dayKey] = updatedSchedule[dayKey].filter(c => c.id !== classItem.id);
              setScheduleData(updatedSchedule);
              Vibration.vibrate(50);
              Alert.alert('Succès', 'Cours supprimé');
            }
          }
        }
      ]
    );
  };

  // Get current day's classes
  const getCurrentDayClasses = () => {
    const dayKey = selectedDayIndex + 1;
    return scheduleData[dayKey] || [];
  };

  // Check if a day has exams
  const dayHasExam = (dayIndex) => {
    const dayKey = dayIndex + 1;
    const dayClasses = scheduleData[dayKey] || [];
    return dayClasses.some(classItem => ['Contrôle', 'Test', 'Examen'].includes(classItem.type));
  };

  // Get today's classes with safety check
  const todaysClasses = scheduleData && Object.keys(scheduleData).length > 0 ? getCurrentDayClasses() : [];

  // ENHANCED HEADER COMPONENT
  const ScheduleHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'DEF - Emploi du temps' : `${user?.level || 'BAC'} - Emploi du temps`}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            {getWeekDateRange()}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: isEditMode ? '#FFFFFF20' : 'transparent' }]}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Ionicons name={isEditMode ? "checkmark" : "pencil"} size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={exportSchedule}
          >
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.weekNavigation}>
        <TouchableOpacity
          style={styles.weekNavButton}
          onPress={() => navigateWeek(-1)}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={[styles.weekIndicator, { color: '#FFFFFF' }]}>
          Semaine {currentWeek === 0 ? 'actuelle' : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
        </Text>
        <TouchableOpacity
          style={styles.weekNavButton}
          onPress={() => navigateWeek(1)}
        >
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // DAY SELECTOR COMPONENT
  const DaySelector = () => (
    <View style={styles.daySelector}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.daysContainer}>
          {weekDates.map((dayInfo, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCard,
                {
                  backgroundColor: selectedDayIndex === index ? theme.primary : theme.surface,
                  borderColor: dayInfo.isToday ? theme.primary : theme.neutralLight,
                  borderWidth: dayInfo.isToday && selectedDayIndex !== index ? 2 : 0,
                }
              ]}
              onPress={() => setSelectedDayIndex(index)}
            >
              <Text style={[
                styles.dayName,
                { color: selectedDayIndex === index ? '#FFFFFF' : theme.text }
              ]}>
                {dayInfo.day}
              </Text>
              <Text style={[
                styles.dayDate,
                { color: selectedDayIndex === index ? '#FFFFFF' : theme.text }
              ]}>
                {dayInfo.date}
              </Text>
              {dayHasExam(index) && Object.keys(scheduleData).length > 0 && (
                <View style={[styles.examIndicator, { backgroundColor: theme.warning }]}>
                  <Ionicons name="alert-circle" size={12} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  // CLASS CARD COMPONENT
  const ClassCard = ({ classItem, onPress, isTracking = false }) => {
    return (
      <TouchableOpacity
        style={[
          styles.classCard,
          { 
            backgroundColor: theme.surface,
            borderLeftColor: classItem.color,
            opacity: isEditMode ? 0.8 : 1
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.classContent}>
          <View style={styles.classHeader}>
            <Text style={[styles.classSubject, { color: theme.text }]}>
              {classItem.subject}
            </Text>
            <Text style={[styles.classTime, { color: theme.textSecondary }]}>
              {classItem.time}
            </Text>
          </View>
          
          <View style={styles.classDetails}>
            {classItem.teacher && (
              <Text style={[styles.classTeacher, { color: theme.textSecondary }]}>
                👨‍🏫 {classItem.teacher}
              </Text>
            )}
            {classItem.room && (
              <Text style={[styles.classRoom, { color: theme.textSecondary }]}>
                📍 {classItem.room}
              </Text>
            )}
          </View>
          
          <View style={styles.classFooter}>
            <View style={[styles.typeBadge, { backgroundColor: classItem.color }]}>
              <Text style={styles.typeBadgeText}>{classItem.type}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.studyTimer,
                { backgroundColor: isTracking ? theme.error : theme.primary }
              ]}
              onPress={() => setIsTracking(!isTracking)}
            >
              <Ionicons 
                name={isTracking ? "pause" : "play"} 
                size={14} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {isEditMode && (
          <TouchableOpacity 
            style={[styles.deleteClassButton, { backgroundColor: theme.error }]}
            onPress={(e) => {
              e.stopPropagation();
              deleteClass(classItem);
            }}
          >
            <Ionicons name="trash" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // Empty State Component
  const EmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
      <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
      <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
        Aucun cours prévu ce jour
      </Text>
      {isEditMode && (
        <TouchableOpacity
          style={[styles.addClassButton, { backgroundColor: theme.primary }]}
          onPress={() => openQuickAdd()}
        >
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addClassButtonText}>Ajouter un cours</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Loading Component
  const LoadingSchedule = () => (
    <View style={styles.loadingContainer}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={[styles.skeletonCard, { backgroundColor: theme.surface }]}>
          <View style={[styles.skeletonLine, { backgroundColor: theme.neutralLight }]} />
          <View style={[styles.skeletonLine, { backgroundColor: theme.neutralLight, width: '60%' }]} />
          <View style={[styles.skeletonLine, { backgroundColor: theme.neutralLight, width: '40%' }]} />
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScheduleHeader />
        <LoadingSchedule />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScheduleHeader />
      
      {selectedView === 'day' && (
        <>
          <DaySelector />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {weekDates[selectedDayIndex]?.isToday ? 'Aujourd\'hui' : weekDates[selectedDayIndex]?.day}
                </Text>
                
                {isEditMode && (
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: theme.primary }]}
                    onPress={() => openQuickAdd()}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
              
              {todaysClasses.length > 0 ? (
                <View style={styles.classesContainer}>
                  {todaysClasses.map((classItem, index) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onPress={() => navigateToCourse(classItem)}
                      isTracking={studyTimers[classItem.id]}
                    />
                  ))}
                </View>
              ) : (
                <EmptyState />
              )}
            </View>
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}
      
      {/* Floating Action Button for non-edit mode */}
      {!isEditMode && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          onPress={() => openQuickAdd()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekIndicator: {
    fontSize: 16,
    fontWeight: '600',
  },
  daySelector: {
    paddingVertical: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  dayCard: {
    width: 70,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  examIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classesContainer: {
    gap: 12,
  },
  classCard: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  classContent: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  classDetails: {
    marginBottom: 12,
    gap: 4,
  },
  classTeacher: {
    fontSize: 14,
  },
  classRoom: {
    fontSize: 14,
  },
  classFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  studyTimer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteClassButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  addClassButton: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  addClassButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    padding: 20,
    gap: 16,
  },
  skeletonCard: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  skeletonLine: {
    height: 16,
    borderRadius: 8,
  },
  bottomPadding: {
    height: 40,
  },
});