// app/(tabs)/schedule.js - ENHANCED VERSION WITH ALL IMPROVEMENTS
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

  // Enhanced schedule data with persistence
  const [scheduleData, setScheduleData] = useState(() => getScheduleForWeek(0));

  // Load schedule from storage
  useEffect(() => {
    loadScheduleData();
  }, []);

  // Save schedule to storage
  useEffect(() => {
    saveScheduleData();
  }, [scheduleData]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('userSchedule');
      if (stored) {
        setScheduleData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScheduleData = async () => {
    try {
      await AsyncStorage.setItem('userSchedule', JSON.stringify(scheduleData));
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

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

  // Enhanced time slots
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '10:15', '11:15', '12:15', 
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

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

  // COURSE NAVIGATION FUNCTION
  const navigateToCourse = (classItem) => {
    const courseName = classItem.subject.replace(/\s+/g, '_').replace(/\//g, '_');
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    router.push(`/courses/${userLevel}/${courseName}`);
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

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
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

  const getNextTimeSlot = (currentTime) => {
    const currentIndex = timeSlots.indexOf(currentTime);
    if (currentIndex === -1 || currentIndex === timeSlots.length - 1) {
      const [hours, minutes] = currentTime.split(':').map(Number);
      const nextHour = hours + 1;
      return `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return timeSlots[currentIndex + 1];
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

  const getWeekDateRange = () => {
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

  // QUICK ADD FUNCTIONS
  const openQuickAdd = (dayIndex = selectedDayIndex, timeSlot = '08:00') => {
    const dayClasses = scheduleData[dayIndex + 1] || [];
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
      const dayClasses = scheduleData[index + 1] || [];
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

  // ENHANCED HEADER COMPONENT
  const ScheduleHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Mon Planning DEF' : `Planning ${user?.level}`}
          </Text>
          
          <View style={styles.weekNavigationContainer}>
            <TouchableOpacity 
              style={styles.weekNavButton}
              onPress={() => navigateWeek(-1)}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.weekTitleContainer}>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
                {getWeekDateRange()}
              </Text>
              <View style={styles.weekIndicators}>
                {[-2, -1, 0, 1, 2].map((offset) => (
                  <View
                    key={offset}
                    style={[
                      styles.weekIndicator,
                      {
                        backgroundColor: offset === currentWeek ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                        width: offset === currentWeek ? 24 : 6,
                      }
                    ]}
                  />
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.weekNavButton}
              onPress={() => navigateWeek(1)}
            >
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.weekStatus}>
            <Text style={[styles.weekStatusText, { color: '#FFFFFF99' }]}>
              {currentWeek === 0 ? 'Cette semaine' : 
               currentWeek === -1 ? 'Semaine dernière' :
               currentWeek === 1 ? 'Semaine prochaine' :
               currentWeek < 0 ? `Il y a ${Math.abs(currentWeek)} semaines` :
               `Dans ${currentWeek} semaines`}
            </Text>
            <View style={styles.weekStats}>
              <View style={styles.weekStat}>
                <Ionicons name="calendar" size={12} color="#FFFFFF99" />
                <Text style={[styles.weekStatText, { color: '#FFFFFF99' }]}>
                  {Object.values(scheduleData).flat().length} cours
                </Text>
              </View>
              <View style={styles.weekStat}>
                <Ionicons name="alert-circle" size={12} color="#FFFFFF99" />
                <Text style={[styles.weekStatText, { color: '#FFFFFF99' }]}>
                  {Object.values(scheduleData).flat().filter(c => ['Contrôle', 'Test', 'Examen'].includes(c.type)).length} examens
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={exportSchedule}
          >
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: selectedView === 'week' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)' }
            ]}
            onPress={() => setSelectedView(selectedView === 'day' ? 'week' : 'day')}
          >
            <Ionicons 
              name={selectedView === 'day' ? "grid" : "list"} 
              size={20} 
              color={selectedView === 'week' ? theme.primary : "#FFFFFF"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: isEditMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)' }
            ]}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Ionicons 
              name={isEditMode ? "checkmark" : "pencil"} 
              size={20} 
              color={isEditMode ? theme.primary : '#FFFFFF'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Day Selector Component
  const DaySelector = () => (
    <View style={[styles.daySelector, { backgroundColor: theme.surface }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weekDates.map((dayInfo, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDayIndex === index && { backgroundColor: theme.primary },
              dayInfo.isToday && selectedDayIndex !== index && { 
                borderWidth: 2, 
                borderColor: theme.primary 
              }
            ]}
            onPress={() => setSelectedDayIndex(index)}
          >
            <Text style={[
              styles.dayText,
              { color: selectedDayIndex === index ? '#FFFFFF' : theme.textSecondary }
            ]}>
              {dayInfo.day}
            </Text>
            <Text style={[
              styles.dateText,
              { color: selectedDayIndex === index ? '#FFFFFF' : theme.text }
            ]}>
              {dayInfo.date}
            </Text>
            {dayInfo.isToday && (
              <View style={[styles.todayIndicator, { 
                backgroundColor: selectedDayIndex === index ? '#FFFFFF' : theme.primary 
              }]} />
            )}
            {dayHasExam(index) && (
              <View style={[styles.examIndicator, { backgroundColor: theme.error }]} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {isEditMode && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => openQuickAdd()}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  // Enhanced Class Card Component
  const ClassCard = ({ classItem, index }) => {
    const isUpcoming = () => {
      const now = new Date();
      const [hour, minute] = classItem.time.split('-')[0].split(':').map(Number);
      const classTime = new Date();
      classTime.setHours(hour, minute, 0, 0);
      return classTime > now && weekDates[selectedDayIndex].isToday;
    };

    const [isTracking, setIsTracking] = useState(false);
    const [studyTime, setStudyTime] = useState(classItem.studyTime || 0);

    useEffect(() => {
      let interval = null;
      if (isTracking) {
        interval = setInterval(() => {
          setStudyTime(time => time + 1);
        }, 1000);
      } else if (studyTime !== classItem.studyTime) {
        // Update the class with new study time
        const dayKey = selectedDayIndex + 1;
        const updatedSchedule = { ...scheduleData };
        const classIndex = updatedSchedule[dayKey].findIndex(c => c.id === classItem.id);
        if (classIndex !== -1) {
          updatedSchedule[dayKey][classIndex].studyTime = studyTime;
          setScheduleData(updatedSchedule);
        }
      }
      return () => clearInterval(interval);
    }, [isTracking, studyTime]);

    const formatTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <TouchableOpacity 
        style={[
          styles.classCard, 
          { 
            backgroundColor: theme.surface,
            borderLeftWidth: isUpcoming() ? 4 : 0,
            borderLeftColor: theme.success
          }
        ]}
        onPress={() => {
          if (!isEditMode) {
            navigateToCourse(classItem);
          }
        }}
      >
        <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
        
        <View style={styles.classContent}>
          <View style={styles.classHeader}>
            <View style={styles.classMainInfo}>
              <Text style={[styles.classSubject, { color: theme.text }]}>
                {classItem.subject}
              </Text>
              <View style={[styles.classType, { 
                backgroundColor: ['Contrôle', 'Test', 'Examen'].includes(classItem.type) ? theme.error + '20' : classItem.color + '20'
              }]}>
                <Text style={[styles.classTypeText, { 
                  color: ['Contrôle', 'Test', 'Examen'].includes(classItem.type) ? theme.error : classItem.color,
                  fontWeight: ['Contrôle', 'Test', 'Examen'].includes(classItem.type) ? 'bold' : '600'
                }]}>
                  {classItem.type}
                </Text>
                {['Contrôle', 'Test', 'Examen'].includes(classItem.type) && (
                  <Ionicons name="alert-circle" size={12} color={theme.error} />
                )}
              </View>
            </View>
            
            <View style={styles.classTime}>
              <Text style={[styles.classTimeText, { color: theme.textSecondary }]}>
                {classItem.time}
              </Text>
              {isUpcoming() && (
                <View style={[styles.upcomingBadge, { backgroundColor: theme.success }]}>
                  <Text style={styles.upcomingText}>Suivant</Text>
                </View>
              )}
            </View>
          </View>

          {/* Enhanced class details */}
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
            {classItem.notes && (
              <Text style={[styles.classNotes, { color: theme.textSecondary }]}>
                📝 {classItem.notes}
              </Text>
            )}
          </View>

          {/* Study time tracker */}
          <View style={styles.studyTracker}>
            <View style={styles.studyTrackerLeft}>
              <Text style={[styles.studyTrackerLabel, { color: theme.textSecondary }]}>
                Temps d'étude:
              </Text>
              <Text style={[styles.studyTrackerTime, { color: theme.text }]}>
                {formatTime(studyTime)}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.studyTrackerButton,
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

  // ENHANCED Quick Add Modal
  const QuickAddModal = () => {
    const hours = Array.from({ length: 12 }, (_, i) => {
      const hour = 8 + i;
      return `${hour.toString().padStart(2, '0')}:00`;
    });

    const updateEndTime = (startTime) => {
      const [hour] = startTime.split(':');
      const nextHour = parseInt(hour) + 1;
      const endHour = nextHour > 19 ? 19 : nextHour;
      return `${endHour.toString().padStart(2, '0')}:00`;
    };

    return (
      <Modal
        visible={showQuickAdd}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Ajouter un cours</Text>
            <TouchableOpacity onPress={() => setShowQuickAdd(false)}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={[styles.suggestionsTitle, { color: theme.text }]}>
                  💡 Créneaux recommandés
                </Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionItem, { backgroundColor: theme.surface }]}
                    onPress={() => {
                      setQuickForm(prev => ({
                        ...prev,
                        startTime: suggestion.time,
                        endTime: updateEndTime(suggestion.time)
                      }));
                    }}
                  >
                    <View style={styles.suggestionContent}>
                      <Text style={[styles.suggestionTime, { color: theme.text }]}>
                        {suggestion.time}
                      </Text>
                      <Text style={[styles.suggestionReason, { color: theme.textSecondary }]}>
                        {suggestion.reason}
                      </Text>
                    </View>
                    <View style={styles.suggestionScore}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={12}
                          color={i < suggestion.score / 20 ? theme.warning : theme.neutralLight}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Subject Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.horizontalScroll}>
                  {commonSubjects.map(subject => (
                    <TouchableOpacity
                      key={subject.name}
                      style={[
                        styles.courseChip,
                        { 
                          backgroundColor: quickForm.subject === subject.name ? subject.color : theme.surface,
                          borderColor: quickForm.subject === subject.name ? subject.color : theme.neutralLight
                        }
                      ]}
                      onPress={() => {
                        setQuickForm(prev => ({...prev, subject: subject.name, color: subject.color}));
                      }}
                    >
                      <Ionicons 
                        name={subject.icon} 
                        size={16} 
                        color={quickForm.subject === subject.name ? '#fff' : subject.color}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[
                        styles.courseChipText,
                        { color: quickForm.subject === subject.name ? '#fff' : theme.text }
                      ]}>
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Enhanced Time Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Heure</Text>
              
              <View style={[styles.timeDisplayRow, { backgroundColor: theme.surface }]}>
                <Text style={[styles.timeDisplayText, { color: theme.text }]}>
                  {quickForm.startTime} → {quickForm.endTime}
                </Text>
              </View>

              <View style={styles.timeGrid}>
                {hours.map(hour => {
                  const dayClasses = scheduleData[quickAddPosition.day + 1] || [];
                  const testClass = { startTime: hour, endTime: updateEndTime(hour) };
                  const hasConflict = detectTimeConflicts(testClass, dayClasses).length > 0;
                  
                  return (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.timeGridItem,
                        { 
                          backgroundColor: quickForm.startTime === hour ? theme.primary : 
                                          hasConflict ? theme.error + '20' : theme.surface,
                          borderColor: quickForm.startTime === hour ? theme.primary : 
                                      hasConflict ? theme.error : theme.neutralLight
                        }
                      ]}
                      onPress={() => {
                        if (!hasConflict) {
                          const endTime = updateEndTime(hour);
                          setQuickForm(prev => ({
                            ...prev, 
                            startTime: hour,
                            endTime: endTime
                          }));
                        }
                      }}
                      disabled={hasConflict}
                    >
                      <Text style={[
                        styles.timeGridText,
                        { 
                          color: quickForm.startTime === hour ? '#fff' : 
                                 hasConflict ? theme.error : theme.text,
                          fontWeight: quickForm.startTime === hour ? 'bold' : 'normal'
                        }
                      ]}>
                        {hour}
                      </Text>
                      {hasConflict && (
                        <Ionicons name="warning" size={12} color={theme.error} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Type Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
              <View style={styles.typeGrid}>
                {[
                  { type: 'Cours', icon: 'book-outline', color: theme.primary },
                  { type: 'TP', icon: 'flask-outline', color: theme.accent },
                  { type: 'TD', icon: 'create-outline', color: theme.info },
                  { type: 'Contrôle', icon: 'alert-circle-outline', color: theme.warning },
                  { type: 'Test', icon: 'checkmark-circle-outline', color: theme.success },
                  { type: 'Examen', icon: 'school-outline', color: theme.error }
                ].map(({ type, icon, color }) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeChip,
                      { 
                        backgroundColor: quickForm.type === type ? color : theme.surface,
                        borderColor: quickForm.type === type ? color : theme.neutralLight
                      }
                    ]}
                    onPress={() => {
                      setQuickForm(prev => ({...prev, type}));
                    }}
                  >
                    <Ionicons 
                      name={icon} 
                      size={16} 
                      color={quickForm.type === type ? '#fff' : color} 
                      style={{ marginBottom: 4 }} 
                    />
                    <Text style={[
                      styles.typeChipText,
                      { color: quickForm.type === type ? '#fff' : theme.text }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Details */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Détails</Text>
              
              <TextInput
                style={[styles.detailInput, { backgroundColor: theme.surface, color: theme.text }]}
                placeholder="Professeur"
                placeholderTextColor={theme.textSecondary}
                value={quickForm.teacher}
                onChangeText={(text) => setQuickForm(prev => ({...prev, teacher: text}))}
              />
              
              <TextInput
                style={[styles.detailInput, { backgroundColor: theme.surface, color: theme.text }]}
                placeholder="Salle"
                placeholderTextColor={theme.textSecondary}
                value={quickForm.room}
                onChangeText={(text) => setQuickForm(prev => ({...prev, room: text}))}
              />
              
              <TextInput
                style={[styles.detailInputMulti, { backgroundColor: theme.surface, color: theme.text }]}
                placeholder="Notes (matériel à apporter, etc.)"
                placeholderTextColor={theme.textSecondary}
                value={quickForm.notes}
                onChangeText={(text) => setQuickForm(prev => ({...prev, notes: text}))}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Recurring Options */}
            <View style={styles.formGroup}>
              <View style={styles.recurringToggle}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Cours récurrent</Text>
                <Switch
                  value={quickForm.isRecurring}
                  onValueChange={(value) => setQuickForm(prev => ({...prev, isRecurring: value}))}
                  trackColor={{ false: theme.neutralLight, true: theme.primary + '40' }}
                  thumbColor={quickForm.isRecurring ? theme.primary : theme.textSecondary}
                />
              </View>
              
              {quickForm.isRecurring && (
                <TouchableOpacity
                  style={[styles.recurringButton, { backgroundColor: theme.surface }]}
                  onPress={() => setShowRecurringModal(true)}
                >
                  <Text style={[styles.recurringButtonText, { color: theme.text }]}>
                    Configurer la récurrence
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Notification Settings */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Rappel</Text>
              <View style={styles.reminderGrid}>
                {[0, 5, 15, 30].map(minutes => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.reminderChip,
                      { 
                        backgroundColor: quickForm.reminderMinutes === minutes ? theme.primary : theme.surface,
                        borderColor: quickForm.reminderMinutes === minutes ? theme.primary : theme.neutralLight
                      }
                    ]}
                    onPress={() => setQuickForm(prev => ({...prev, reminderMinutes: minutes}))}
                  >
                    <Text style={[
                      styles.reminderChipText,
                      { color: quickForm.reminderMinutes === minutes ? '#fff' : theme.text }
                    ]}>
                      {minutes === 0 ? 'Aucun' : `${minutes} min`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            {quickForm.subject && (
              <View style={[styles.previewCard, { backgroundColor: quickForm.color + '10' }]}>
                <View style={styles.previewHeader}>
                  <Ionicons name="eye-outline" size={20} color={quickForm.color} />
                  <Text style={[styles.previewTitle, { color: quickForm.color }]}>Aperçu</Text>
                </View>
                <View style={styles.previewContent}>
                  <Text style={[styles.previewSubject, { color: theme.text }]}>
                    {quickForm.subject}
                  </Text>
                  <View style={styles.previewMeta}>
                    <View style={[styles.previewTypeBadge, { backgroundColor: quickForm.color + '20' }]}>
                      <Text style={[styles.previewTypeText, { color: quickForm.color }]}>
                        {quickForm.type}
                      </Text>
                    </View>
                    <Text style={[styles.previewTime, { color: theme.textSecondary }]}>
                      {quickForm.startTime} - {quickForm.endTime}
                    </Text>
                  </View>
                  {quickForm.teacher && (
                    <Text style={[styles.previewDetail, { color: theme.textSecondary }]}>
                      👨‍🏫 {quickForm.teacher}
                    </Text>
                  )}
                  {quickForm.room && (
                    <Text style={[styles.previewDetail, { color: theme.textSecondary }]}>
                      📍 {quickForm.room}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: theme.background, borderTopColor: theme.neutralLight }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.neutralLight }]}
              onPress={() => setShowQuickAdd(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: quickForm.subject ? quickForm.color : theme.neutralLight,
                  opacity: quickForm.subject ? 1 : 0.5
                }
              ]}
              onPress={saveQuickClass}
              disabled={!quickForm.subject}
            >
              <Ionicons name="add" size={20} color={quickForm.subject ? '#fff' : theme.textSecondary} />
              <Text style={[
                styles.saveButtonText,
                { color: quickForm.subject ? '#fff' : theme.textSecondary }
              ]}>
                Ajouter
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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

  const todaysClasses = getCurrentDayClasses();

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
                  {weekDates[selectedDayIndex].isToday ? "Aujourd'hui" : `${weekDates[selectedDayIndex].day} ${weekDates[selectedDayIndex].date}`}
                </Text>
                <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                  {todaysClasses.length} cours
                </Text>
              </View>
              
              {todaysClasses.length > 0 ? (
                todaysClasses.map((classItem, index) => (
                  <ClassCard key={classItem.id} classItem={classItem} index={index} />
                ))
              ) : (
                <EmptyState />
              )}
            </View>
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}

      <QuickAddModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 20,
  },
  skeletonCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  weekNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  weekNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  weekIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weekIndicator: {
    height: 4,
    borderRadius: 2,
  },
  weekStatus: {
    alignItems: 'flex-start',
  },
  weekStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  weekStats: {
    flexDirection: 'row',
    gap: 16,
  },
  weekStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  weekStatText: {
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelector: {
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 14,
    minWidth: 64,
    position: 'relative',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  examIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  classCard: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  classColorBar: {
    width: 4,
  },
  classContent: {
    flex: 1,
    padding: 16,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  classMainInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
  },
  classType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  classTypeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  classTime: {
    alignItems: 'flex-end',
  },
  classTimeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  upcomingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  upcomingText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  classDetails: {
    marginBottom: 8,
  },
  classTeacher: {
    fontSize: 12,
    marginBottom: 2,
  },
  classRoom: {
    fontSize: 12,
    marginBottom: 2,
  },
  classNotes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  studyTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    padding: 8,
  },
  studyTrackerLeft: {
    flex: 1,
  },
  studyTrackerLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  studyTrackerTime: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  studyTrackerButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteClassButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    alignSelf: 'center',
    marginRight: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 16,
  },
  addClassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addClassButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Smart Suggestions
  suggestionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTime: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  suggestionReason: {
    fontSize: 12,
  },
  suggestionScore: {
    flexDirection: 'row',
    gap: 2,
  },
  
  formGroup: {
    marginBottom: 28,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  courseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    minWidth: 120,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeDisplayRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  timeDisplayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  timeGridItem: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  timeGridText: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  typeChip: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  detailInputMulti: {
    minHeight: 80,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  recurringToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recurringButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  recurringButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reminderGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  reminderChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  previewContent: {
    gap: 8,
  },
  previewSubject: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  previewTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewDetail: {
    fontSize: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});