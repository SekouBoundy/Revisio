// app/(tabs)/schedule.js - ENHANCED VERSION WITH MONTH CALENDAR
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

// Helper functions
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

function getMonthCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // Adjust to start from Monday
  const dayOfWeek = firstDay.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(firstDay.getDate() - mondayOffset);
  
  const calendar = [];
  const today = new Date();
  
  for (let week = 0; week < 6; week++) {
    const weekDays = [];
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      weekDays.push({
        date: currentDate.getDate(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        fullDate: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === today.toDateString(),
        isPast: currentDate < today && currentDate.toDateString() !== today.toDateString()
      });
    }
    calendar.push(weekDays);
  }
  
  return calendar;
}

export default function EnhancedScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Date state management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(() => 
    getMonthCalendar(new Date().getFullYear(), new Date().getMonth())
  );
  
  // Enhanced state management
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  
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

  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Animation refs
  const dragAnimation = useRef(new Animated.ValueXY()).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  // Enhanced time slots - more comprehensive
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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

  // Define getScheduleForDate function
  const getScheduleForDate = useCallback((date) => {
    const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    return scheduleData[dateKey] || [];
  }, [scheduleData]);

  // Enhanced schedule data with persistence
  const [scheduleData, setScheduleData] = useState({});
  const [editingClass, setEditingClass] = useState(null);

  // Load schedule from storage
  useEffect(() => {
    loadScheduleData();
  }, []);

  // Update calendar when month changes
  useEffect(() => {
    const newCalendar = getMonthCalendar(currentDate.getFullYear(), currentDate.getMonth());
    setCalendarData(newCalendar);
  }, [currentDate]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem('userSchedule');
      if (stored) {
        setScheduleData(JSON.parse(stored));
      } else {
        // Initialize with sample data
        const initialData = {};
        const today = new Date();
        const dateKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        initialData[dateKey] = [
          { 
            id: `today-1`,
            time: '08:00-09:00', 
            subject: 'Mathématiques', 
            type: 'Cours', 
            color: '#2196F3',
            isRecurring: true,
          },
          { 
            id: `today-2`,
            time: '09:00-10:00', 
            subject: 'Français', 
            type: 'Examen', 
            color: '#FF9800',
            isRecurring: false,
          },
          { 
            id: `today-3`,
            time: '14:00-15:00', 
            subject: 'Informatique', 
            type: 'Cours', 
            color: '#607D8B',
            isRecurring: true,
          }
        ];
        setScheduleData(initialData);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveScheduleData = async () => {
    try {
      if (Object.keys(scheduleData).length > 0) {
        await AsyncStorage.setItem('userSchedule', JSON.stringify(scheduleData));
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Save schedule to storage
  useEffect(() => {
    if (Object.keys(scheduleData).length > 0) {
      saveScheduleData();
    }
  }, [scheduleData]);

  // Navigation functions
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (dateInfo) => {
    setSelectedDate(dateInfo.fullDate);
  };

  // Get current day's classes based on selected date
  const getCurrentDayClasses = () => {
    return getScheduleForDate(selectedDate);
  };

  // Check if a date has exams (only exams, not all classes)
  const dateHasExam = (dateInfo) => {
    const classes = getScheduleForDate(dateInfo.fullDate);
    return classes.some(classItem => ['Contrôle', 'Test', 'Examen'].includes(classItem.type));
  };

  // Format month/year for header
  const getMonthYearText = () => {
    const months = [
      'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
      'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
    ];
    return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };

  // Format selected date
  const getSelectedDateText = () => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (isToday) {
      return 'AUJOURD\'HUI';
    }
    
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return selectedDate.toLocaleDateString('fr-FR', options).toUpperCase();
  };

  // Get classes count for date (no longer used but keeping for compatibility)
  const getClassesCount = (dateInfo) => {
    const classes = getScheduleForDate(dateInfo.fullDate);
    return classes.length;
  };

  // TIME PICKER COMPONENT
  const TimePicker = ({ visible, onClose, onSelect, currentTime, title }) => (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      transparent={true}
    >
      <View style={styles.timePickerOverlay}>
        <View style={[styles.timePickerContainer, { backgroundColor: theme.surface }]}>
          <View style={[styles.timePickerHeader, { borderBottomColor: theme.neutralLight }]}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.timePickerCancel, { color: theme.text }]}>Annuler</Text>
            </TouchableOpacity>
            <Text style={[styles.timePickerTitle, { color: theme.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.timePickerDone, { color: theme.primary }]}>OK</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
            {timeSlots.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timePickerItem,
                  { 
                    backgroundColor: currentTime === time ? theme.primary : 'transparent',
                    borderBottomColor: theme.neutralLight 
                  }
                ]}
                onPress={() => {
                  onSelect(time);
                  onClose();
                }}
              >
                <Text style={[
                  styles.timePickerText,
                  { color: currentTime === time ? '#fff' : theme.text }
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // HELPER FUNCTIONS (keeping existing ones)
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

  // QUICK ADD FUNCTIONS (keeping existing ones)
  const openQuickAdd = (timeSlot = '08:00') => {
    setQuickForm(prev => ({
      ...prev,
      startTime: timeSlot,
      endTime: getNextTimeSlot(timeSlot),
      subject: '',
      type: 'Cours'
    }));
    setShowQuickAdd(true);
  };

  const saveQuickClass = async () => {
    if (!quickForm.subject.trim()) {
      Alert.alert('Erreur', 'Veuillez choisir une matière');
      return;
    }

    const subjectInfo = commonSubjects.find(s => s.name === quickForm.subject) || commonSubjects[0];
    
    try {
      if (editingClass) {
        // Update existing class
        const updatedSchedule = { ...scheduleData };
        
        Object.keys(updatedSchedule).forEach(dateKey => {
          updatedSchedule[dateKey] = updatedSchedule[dateKey].map(c => 
            c.id === editingClass.id 
              ? {
                  ...c,
                  time: `${quickForm.startTime}-${quickForm.endTime}`,
                  subject: quickForm.subject,
                  type: quickForm.type,
                  color: subjectInfo.color,
                }
              : c
          );
        });
        
        setScheduleData(updatedSchedule);
        setEditingClass(null);
        Alert.alert('Succès', 'Cours modifié avec succès');
      } else {
        // Add new class
        const newClass = {
          id: `${Date.now()}-${Math.random()}`,
          time: `${quickForm.startTime}-${quickForm.endTime}`,
          subject: quickForm.subject,
          type: quickForm.type,
          color: subjectInfo.color,
          isRecurring: quickForm.isRecurring,
        };

        const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
        const updatedSchedule = { ...scheduleData };
        
        if (!updatedSchedule[dateKey]) {
          updatedSchedule[dateKey] = [];
        }
        
        updatedSchedule[dateKey].push(newClass);
        updatedSchedule[dateKey].sort((a, b) => {
          const timeA = a.time.split('-')[0];
          const timeB = b.time.split('-')[0];
          return timeA.localeCompare(timeB);
        });

        setScheduleData(updatedSchedule);
        console.log('Added class:', newClass);
        console.log('Updated schedule for date:', dateKey, updatedSchedule[dateKey]);
        Alert.alert('Succès', 'Cours ajouté avec succès');
      }

      setShowQuickAdd(false);
      
      // Reset form
      setQuickForm(prev => ({
        ...prev,
        subject: '',
        type: 'Cours',
        isRecurring: false
      }));
      
      Vibration.vibrate(100);
    } catch (error) {
      console.error('Error saving class:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le cours');
    }
  };

  const navigateToCourse = (classItem) => {
    const courseName = classItem.subject.replace(/\s+/g, '_').replace(/\//g, '_');
    const userLevel = isDefLevel ? 'DEF' : user?.level || 'TSE';
    router.push(`/courses/${userLevel}/${courseName}`);
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
            // Find and remove the class from schedule data
            const updatedSchedule = { ...scheduleData };
            
            Object.keys(updatedSchedule).forEach(dateKey => {
              updatedSchedule[dateKey] = updatedSchedule[dateKey].filter(c => c.id !== classItem.id);
            });
            
            setScheduleData(updatedSchedule);
            Vibration.vibrate(50);
            Alert.alert('Succès', 'Cours supprimé');
          }
        }
      ]
    );
  };

  // MONTH CALENDAR COMPONENT
  const MonthCalendar = () => (
    <View style={[styles.calendarContainer, { backgroundColor: theme.primary }]}>
      {/* Calendar Header */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth(-1)}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.monthYearText}>
          {getMonthYearText()}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth(1)}
        >
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Days of Week */}
      <View style={styles.daysOfWeekHeader}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
          <Text key={index} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarData.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((dateInfo, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                style={[
                  styles.calendarDay,
                  {
                    backgroundColor: dateInfo.isToday 
                      ? '#FFFFFF' 
                      : selectedDate.toDateString() === dateInfo.fullDate.toDateString()
                      ? '#FFFFFF40'
                      : 'transparent'
                  }
                ]}
                onPress={() => selectDate(dateInfo)}
                disabled={!dateInfo.isCurrentMonth}
              >
                <Text style={[
                  styles.calendarDayText,
                  {
                    color: dateInfo.isToday 
                      ? theme.primary
                      : !dateInfo.isCurrentMonth 
                      ? '#FFFFFF40'
                      : selectedDate.toDateString() === dateInfo.fullDate.toDateString()
                      ? '#FFFFFF'
                      : '#FFFFFF',
                    fontWeight: dateInfo.isToday || selectedDate.toDateString() === dateInfo.fullDate.toDateString() 
                      ? 'bold' 
                      : 'normal'
                  }
                ]}>
                  {dateInfo.date}
                </Text>
                
                {dateHasExam(dateInfo) && dateInfo.isCurrentMonth && (
                  <View style={[
                    styles.examDot,
                    { backgroundColor: '#FF4444' }
                  ]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  // CLASS CARD COMPONENT (enhanced version)
  const ClassCard = ({ classItem, onPress, isTracking = false }) => {
    const handleEdit = () => {
      setEditingClass(classItem);
      setQuickForm({
        ...quickForm,
        subject: classItem.subject,
        startTime: classItem.time.split('-')[0],
        endTime: classItem.time.split('-')[1],
        type: classItem.type
      });
      setShowQuickAdd(true);
    };

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
        onPress={isEditMode ? handleEdit : onPress}
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
          
          <View style={styles.classFooter}>
            <View style={[styles.typeBadge, { backgroundColor: classItem.color }]}>
              <Text style={styles.typeBadgeText}>{classItem.type}</Text>
            </View>
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

  // DAY SCHEDULE SECTION
  const DayScheduleSection = () => {
    const todaysClasses = getCurrentDayClasses();
    
    return (
      <View style={[styles.dayScheduleContainer, { backgroundColor: theme.background }]}>
        {/* Day Schedule Header */}
        <View style={styles.dayScheduleHeader}>
          <View>
            <Text style={[styles.todayLabel, { color: theme.textSecondary }]}>
              {getSelectedDateText()}
            </Text>
            <Text style={[styles.activitiesCount, { color: theme.text }]}>
              {todaysClasses.length} Activité{todaysClasses.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          <View style={styles.dayScheduleActions}>
            {isEditMode && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={() => openQuickAdd()}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: isEditMode ? theme.primary : 'transparent' }]}
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Ionicons 
                name={isEditMode ? "checkmark" : "pencil"} 
                size={20} 
                color={isEditMode ? "#fff" : theme.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Classes List */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.classesList}>
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
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Aucune activité prévue
              </Text>
              {isEditMode && (
                <TouchableOpacity
                  style={[styles.addClassButton, { backgroundColor: theme.primary }]}
                  onPress={() => openQuickAdd()}
                >
                  <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.addClassButtonText}>Ajouter une activité</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    );
  };

  // QUICK ADD MODAL
  const QuickAddModal = () => (
    <Modal
      visible={showQuickAdd}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        setShowQuickAdd(false);
        setEditingClass(null);
      }}
    >
      <KeyboardAvoidingView 
        style={[styles.modalContainer, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
          <TouchableOpacity onPress={() => {
            setShowQuickAdd(false);
            setEditingClass(null);
          }}>
            <Text style={[styles.modalCancel, { color: theme.text }]}>Annuler</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {editingClass ? 'Modifier le cours' : 'Nouveau cours'}
          </Text>
          <TouchableOpacity onPress={saveQuickClass}>
            <Text style={[styles.modalSave, { color: theme.primary }]}>Sauver</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.subjectsContainer}>
                {commonSubjects.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectChip,
                      {
                        backgroundColor: quickForm.subject === subject.name ? subject.color : theme.surface,
                        borderColor: subject.color
                      }
                    ]}
                    onPress={() => setQuickForm(prev => ({ ...prev, subject: subject.name }))}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={subject.icon} 
                      size={16} 
                      color={quickForm.subject === subject.name ? '#fff' : subject.color} 
                    />
                    <Text style={[
                      styles.subjectChipText,
                      { color: quickForm.subject === subject.name ? '#fff' : subject.color }
                    ]}>
                      {subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
            <View style={styles.typeContainer}>
              {['Cours', 'TP', 'TD', 'Examen', 'Contrôle'].map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: quickForm.type === type ? theme.primary : theme.surface,
                      borderColor: theme.primary
                    }
                  ]}
                  onPress={() => setQuickForm(prev => ({ ...prev, type }))}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.typeChipText,
                    { color: quickForm.type === type ? '#fff' : theme.primary }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Début</Text>
              <TouchableOpacity 
                style={[styles.timeInput, { backgroundColor: theme.surface }]}
                onPress={() => setShowStartTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeText, { color: theme.text }]}>{quickForm.startTime}</Text>
                <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.formColumn}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Fin</Text>
              <TouchableOpacity 
                style={[styles.timeInput, { backgroundColor: theme.surface }]}
                onPress={() => setShowEndTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeText, { color: theme.text }]}>{quickForm.endTime}</Text>
                <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Time Pickers */}
      <TimePicker
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        onSelect={(time) => setQuickForm(prev => ({ ...prev, startTime: time }))}
        currentTime={quickForm.startTime}
        title="Heure de début"
      />
      
      <TimePicker
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        onSelect={(time) => setQuickForm(prev => ({ ...prev, endTime: time }))}
        currentTime={quickForm.endTime}
        title="Heure de fin"
      />
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.text }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Month Calendar at Top */}
      <MonthCalendar />
      
      {/* Day Schedule at Bottom */}
      <DayScheduleSection />

      {/* Quick Add Modal */}
      <QuickAddModal />

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
  
  // Calendar Styles
  calendarContainer: {
    height: '45%', // Reduced from 60-70% to 45%
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  daysOfWeekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF80',
    marginBottom: 8,
  },
  calendarGrid: {
    gap: 4,
  },
  calendarWeek: {
    flexDirection: 'row',
    gap: 4,
  },
  calendarDay: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activityDot: {
    position: 'absolute',
    bottom: 2,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  examDot: {
    position: 'absolute',
    bottom: 4,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityCount: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Day Schedule Styles
  dayScheduleContainer: {
    flex: 1,
    paddingTop: 20,
  },
  dayScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  todayLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  activitiesCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dayScheduleActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00000020',
  },
  classesList: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Class Card Styles
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

  // Empty State
  emptyState: {
    padding: 40,
    alignItems: 'center',
    borderRadius: 16,
    marginVertical: 20,
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
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  formColumn: {
    flex: 1,
  },
  subjectsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  subjectChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
  },

  // FAB
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

  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },

  // Misc
  bottomPadding: {
    height: 40,
  },

  // Time Picker Styles
  timePickerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  timePickerContainer: {
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  timePickerCancel: {
    fontSize: 16,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timePickerDone: {
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerScroll: {
    flex: 1,
  },
  timePickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  timePickerText: {
    fontSize: 18,
    textAlign: 'center',
  },
});