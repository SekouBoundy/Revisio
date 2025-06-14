import React, { useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

// Constants
const STORAGE_KEY = 'userSchedule';
const TIME_SLOT_INTERVAL = 30; // minutes
const START_HOUR = 7;
const END_HOUR = 19;
const MONTHS = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const CLASS_TYPES = ['Cours', 'Examen', 'Devoirs'];

// Subject configurations
const SUBJECT_CONFIGS = {
  DEF: [
    { name: 'Mathématiques', color: '#2196F3', icon: 'calculator' },
    { name: 'Français', color: '#FF9800', icon: 'book' },
    { name: 'Anglais', color: '#607D8B', icon: 'globe' },
    { name: 'Histoire-Géographie', color: '#9C27B0', icon: 'map' },
    { name: 'Physique-Chimie', color: '#E91E63', icon: 'flask' },
    { name: 'Sciences de la Vie et de la Terre', color: '#4CAF50', icon: 'leaf' },
    { name: 'Informatique', color: '#607D8B', icon: 'laptop' },
  ],
  default: [
    { name: 'Mathématiques', color: '#2196F3', icon: 'calculator' },
    { name: 'Physique', color: '#E91E63', icon: 'nuclear' },
    { name: 'Chimie', color: '#9C27B0', icon: 'flask' },
    { name: 'Informatique', color: '#607D8B', icon: 'laptop' },
    { name: 'Français', color: '#FF9800', icon: 'book' },
    { name: 'Philosophie', color: '#795548', icon: 'bulb' },
    { name: 'Anglais', color: '#607D8B', icon: 'globe' },
  ]
};

// Helper functions
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    for (let min = 0; min < 60; min += TIME_SLOT_INTERVAL) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(time);
    }
  }
  return slots;
};

const getDateKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const formatDateHeader = (date) => 
  date.toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).toUpperCase();

const getMonthCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const today = new Date();
  const startDate = new Date(firstDay);
  
  // Adjust to start from Monday
  const dayOfWeek = firstDay.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(firstDay.getDate() - mondayOffset);

  const calendar = [];
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
      });
    }
    calendar.push(weekDays);
  }
  return calendar;
};

// Custom hooks
const useScheduleData = () => {
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(false);

  const loadScheduleData = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setScheduleData(stored ? JSON.parse(stored) : {});
    } catch (error) {
      console.error('Error loading schedule:', error);
      setScheduleData({});
    } finally {
      setLoading(false);
    }
  }, []);

  const saveScheduleData = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setScheduleData(data);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  }, []);

  const getScheduleForDate = useCallback((date) => {
    const key = getDateKey(date);
    return scheduleData[key] || [];
  }, [scheduleData]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  return {
    scheduleData,
    loading,
    saveScheduleData,
    getScheduleForDate,
  };
};

// Components
const LoadingScreen = ({ theme }) => (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, { color: theme.text }]}>Chargement...</Text>
    </View>
  </SafeAreaView>
);

const CalendarDay = React.memo(({ dateInfo, selectedDate, onSelect, theme }) => {
  const isSelected = selectedDate.toDateString() === dateInfo.fullDate.toDateString();
  
  return (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        {
          backgroundColor: dateInfo.isToday
            ? '#FFFFFF'
            : isSelected
            ? '#FFFFFF40'
            : 'transparent'
        }
      ]}
      onPress={() => onSelect(dateInfo)}
      disabled={!dateInfo.isCurrentMonth}
      accessibilityLabel={`${dateInfo.date} ${MONTHS[dateInfo.month]}`}
      accessibilityRole="button"
    >
      <Text style={[
        styles.calendarDayText,
        {
          color: dateInfo.isToday
            ? theme.primary
            : !dateInfo.isCurrentMonth
            ? '#FFFFFF40'
            : isSelected
            ? '#FFFFFF'
            : '#FFFFFF',
          fontWeight: dateInfo.isToday || isSelected ? 'bold' : 'normal'
        }
      ]}>
        {dateInfo.date}
      </Text>
    </TouchableOpacity>
  );
});

const ClassCard = React.memo(({ classItem, isEditMode, onEdit, onDelete, onPress, theme }) => (
  <View style={[
    styles.classCard,
    { 
      backgroundColor: theme.surface, 
      borderLeftColor: classItem.color, 
      opacity: isEditMode ? 0.85 : 1 
    },
  ]}>
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityLabel={`${classItem.subject} de ${classItem.time}`}
      accessibilityRole="button"
    >
      <View style={styles.classContent}>
        <View style={styles.classHeader}>
          <Text style={[styles.classSubject, { color: theme.text }]} numberOfLines={2}>
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
          {isEditMode && (
            <View style={styles.classActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={() => onEdit(classItem)}
                accessibilityLabel="Modifier"
                accessibilityRole="button"
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.error }]}
                onPress={() => onDelete(classItem)}
                accessibilityLabel="Supprimer"
                accessibilityRole="button"
              >
                <Ionicons name="trash" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  </View>
));

const HourScrollPicker = ({ selected, onSelect, label, timeSlots }) => {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      const idx = timeSlots.indexOf(selected);
      if (idx >= 0) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({ y: idx * 50, animated: true });
        }, 150);
      }
    }
  }, [selected, timeSlots]);

  return (
    <View style={styles.hourPickerContainer}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.hourPickerWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.hourPickerContent}
          ref={scrollRef}
          style={styles.hourScrollView}
        >
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => onSelect(time)}
              style={[
                styles.hourChip,
                { backgroundColor: selected === time ? '#4E8CEE' : '#F0F2FA' }
              ]}
              accessibilityLabel={time}
              accessibilityRole="button"
            >
              <Text style={[
                styles.hourChipText,
                { color: selected === time ? '#fff' : '#4E8CEE' }
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const SubjectPicker = ({ subjects, selected, onSelect, theme }) => (
  <View style={styles.formSection}>
    <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.subjectsContainer}>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.name}
            style={[
              styles.subjectChip,
              {
                backgroundColor: selected === subject.name ? subject.color : theme.surface,
                borderColor: subject.color,
              },
            ]}
            onPress={() => onSelect(subject.name)}
            activeOpacity={0.7}
            accessibilityLabel={subject.name}
            accessibilityRole="button"
          >
            <Ionicons 
              name={subject.icon} 
              size={16} 
              color={selected === subject.name ? '#fff' : subject.color} 
            />
            <Text style={[
              styles.subjectChipText,
              { color: selected === subject.name ? '#fff' : subject.color }
            ]}>
              {subject.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

const TypePicker = ({ types, selected, onSelect, theme }) => (
  <View style={styles.formSection}>
    <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
    <View style={styles.typeContainer}>
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeChip,
            {
              backgroundColor: selected === type ? theme.primary : theme.surface,
              borderColor: theme.primary,
            },
          ]}
          onPress={() => onSelect(type)}
          activeOpacity={0.7}
          accessibilityLabel={type}
          accessibilityRole="button"
        >
          <Text style={[
            styles.typeChipText,
            { color: selected === type ? '#fff' : theme.primary }
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Main component
export default function EnhancedScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const { scheduleData, loading, saveScheduleData, getScheduleForDate } = useScheduleData();

  // Memoized values
  const isDefLevel = useMemo(() => user?.level === 'DEF', [user?.level]);
  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const subjects = useMemo(() => 
    SUBJECT_CONFIGS[isDefLevel ? 'DEF' : 'default'], 
    [isDefLevel]
  );

  // State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [quickForm, setQuickForm] = useState({
    subject: '',
    startTime: '07:00',
    endTime: '08:00',
    type: 'Cours',
  });

  // Memoized calendar data
  const calendarData = useMemo(() => 
    getMonthCalendar(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate]
  );

  const classesToday = useMemo(() => 
    getScheduleForDate(selectedDate),
    [selectedDate, getScheduleForDate]
  );

  // Handlers
  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const selectDate = useCallback((dateInfo) => {
    setSelectedDate(dateInfo.fullDate);
  }, []);

  const resetForm = useCallback(() => {
    setQuickForm({
      subject: subjects[0]?.name || '',
      startTime: '07:00',
      endTime: '08:00',
      type: 'Cours',
    });
  }, [subjects]);

  const handleCloseQuickAdd = useCallback(() => {
    setShowQuickAdd(false);
    setEditingClass(null);
    setTimeout(resetForm, 350);
  }, [resetForm]);

  const handleOpenQuickAdd = useCallback(() => {
    resetForm();
    setShowQuickAdd(true);
    setEditingClass(null);
  }, [resetForm]);

  const validateForm = useCallback(() => {
    if (!quickForm.subject || !quickForm.type || !quickForm.startTime || !quickForm.endTime) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return false;
    }

    const startIdx = timeSlots.indexOf(quickForm.startTime);
    const endIdx = timeSlots.indexOf(quickForm.endTime);

    if (startIdx === -1 || endIdx === -1) {
      Alert.alert('Erreur', 'Sélectionnez des heures valides.');
      return false;
    }

    if (endIdx <= startIdx) {
      Alert.alert('Erreur', "L'heure de fin doit être après l'heure de début.");
      return false;
    }

    return true;
  }, [quickForm, timeSlots]);

  const checkTimeConflict = useCallback((startTime, endTime, excludeId = null) => {
    const dateKey = getDateKey(selectedDate);
    const existingClasses = scheduleData[dateKey] || [];
    
    return existingClasses.some((c) => {
      if (excludeId && c.id === excludeId) return false;
      
      const [startA, endA] = c.time.split('-').map((t) => timeSlots.indexOf(t));
      const [startB, endB] = [timeSlots.indexOf(startTime), timeSlots.indexOf(endTime)];
      
      return (
        (startB < endA && startB >= startA) ||
        (endB > startA && endB <= endA) ||
        (startB <= startA && endB >= endA)
      );
    });
  }, [selectedDate, scheduleData, timeSlots]);

  const saveQuickClass = useCallback(() => {
    if (!validateForm()) return;

    const { subject, startTime, endTime, type } = quickForm;
    const subjectInfo = subjects.find((s) => s.name === subject) || subjects[0];
    const dateKey = getDateKey(selectedDate);
    let updatedSchedule = { ...scheduleData };

    if (editingClass) {
      // Check conflict excluding current class
      if (checkTimeConflict(startTime, endTime, editingClass.id)) {
        Alert.alert('Conflit', "Ce créneau horaire chevauche une autre activité.");
        return;
      }

      // Update existing class
      updatedSchedule[dateKey] = (updatedSchedule[dateKey] || []).map((c) =>
        c.id === editingClass.id
          ? {
              ...c,
              time: `${startTime}-${endTime}`,
              subject,
              type,
              color: subjectInfo.color,
            }
          : c
      );
      ToastAndroid.show('Cours modifié avec succès', ToastAndroid.SHORT);
    } else {
      // Check conflict for new class
      if (checkTimeConflict(startTime, endTime)) {
        Alert.alert('Conflit', "Ce créneau horaire chevauche une autre activité.");
        return;
      }

      // Add new class
      const newClass = {
        id: `${Date.now()}-${Math.random()}`,
        time: `${startTime}-${endTime}`,
        subject,
        type,
        color: subjectInfo.color,
      };
      
      if (!updatedSchedule[dateKey]) updatedSchedule[dateKey] = [];
      updatedSchedule[dateKey].push(newClass);
      updatedSchedule[dateKey].sort((a, b) => a.time.localeCompare(b.time));
      ToastAndroid.show('Cours ajouté avec succès', ToastAndroid.SHORT);
    }

    saveScheduleData(updatedSchedule);
    Vibration.vibrate(50);
    handleCloseQuickAdd();
  }, [quickForm, validateForm, subjects, selectedDate, scheduleData, editingClass, checkTimeConflict, saveScheduleData, handleCloseQuickAdd]);

  const handleEditClass = useCallback((classItem) => {
    setEditingClass(classItem);
    setQuickForm({
      subject: classItem.subject,
      startTime: classItem.time.split('-')[0],
      endTime: classItem.time.split('-')[1],
      type: classItem.type,
    });
    setShowQuickAdd(true);
  }, []);

  const deleteClass = useCallback((classItem) => {
    Alert.alert(
      'Supprimer le cours',
      `Supprimer ${classItem.subject} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const dateKey = getDateKey(selectedDate);
            let updated = { ...scheduleData };
            updated[dateKey] = (updated[dateKey] || []).filter((c) => c.id !== classItem.id);
            saveScheduleData(updated);
            ToastAndroid.show('Supprimé', ToastAndroid.SHORT);
          },
        },
      ]
    );
  }, [selectedDate, scheduleData, saveScheduleData]);

  const handleClassPress = useCallback((classItem) => {
    if (!isEditMode) {
      const level = isDefLevel ? 'DEF' : user?.level;
      const subjectPath = classItem.subject.replace(/\s+/g, '_');
      router.push(`/courses/${level}/${subjectPath}`);
    }
  }, [isEditMode, isDefLevel, user?.level, router]);

  // Format functions
  const getMonthYearText = useCallback(() => 
    `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
    [currentDate]
  );

  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Month Calendar */}
      <View style={[styles.calendarContainer, { backgroundColor: theme.primary }]}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateMonth(-1)}
            accessibilityLabel="Mois précédent"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.monthYearText}>
            {getMonthYearText()}
          </Text>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigateMonth(1)}
            accessibilityLabel="Mois suivant"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Days of Week */}
        <View style={styles.daysOfWeekHeader}>
          {WEEKDAYS.map((day, index) => (
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
                <CalendarDay
                  key={dayIndex}
                  dateInfo={dateInfo}
                  selectedDate={selectedDate}
                  onSelect={selectDate}
                  theme={theme}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Day Schedule */}
      <View style={styles.dayScheduleContainer}>
        {/* Header */}
        <View style={styles.dayScheduleHeader}>
          <View>
            <Text style={[styles.todayLabel, { color: theme.textSecondary }]}>
              {formatDateHeader(selectedDate)}
            </Text>
            <Text style={[styles.activitiesCount, { color: theme.text }]}>
              {classesToday.length} Activité{classesToday.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.dayScheduleActions}>
            <TouchableOpacity 
              style={[
                styles.editButton, 
                { backgroundColor: isEditMode ? theme.primary : 'transparent' }
              ]} 
              onPress={() => setIsEditMode(v => !v)}
              accessibilityLabel={isEditMode ? 'Terminer modification' : 'Modifier planning'}
              accessibilityRole="button"
            >
              <Ionicons 
                name={isEditMode ? 'checkmark' : 'pencil'} 
                size={20} 
                color={isEditMode ? '#fff' : theme.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Classes List */}
        <ScrollView 
          style={styles.classesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.classesListContent}
        >
          {classesToday.length > 0 ? (
            <View style={styles.classesContainer}>
              {classesToday.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  isEditMode={isEditMode}
                  onEdit={handleEditClass}
                  onDelete={deleteClass}
                  onPress={() => handleClassPress(classItem)}
                  theme={theme}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Aucune activité prévue
              </Text>
              <TouchableOpacity
                style={[styles.addClassButton, { backgroundColor: theme.primary }]}
                onPress={handleOpenQuickAdd}
                accessibilityLabel="Ajouter une activité"
                accessibilityRole="button"
              >
                <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.addClassButtonText}>Ajouter une activité</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      {/* Quick Add/Edit Modal */}
      <Modal 
        visible={showQuickAdd} 
        animationType="slide" 
        transparent={true} 
        onRequestClose={handleCloseQuickAdd}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView 
              style={styles.modalKeyboardView} 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              {/* Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={handleCloseQuickAdd}>
                  <Text style={[styles.modalCancel, { color: theme.text }]}>Annuler</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  {editingClass ? 'Modifier' : 'Nouveau cours'}
                </Text>
                <TouchableOpacity onPress={saveQuickClass}>
                  <Text style={[styles.modalSave, { color: theme.primary }]}>Sauver</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Subject Selection */}
                <SubjectPicker
                  subjects={subjects}
                  selected={quickForm.subject}
                  onSelect={(subject) => setQuickForm(prev => ({ ...prev, subject }))}
                  theme={theme}
                />

                {/* Type Selection */}
                <TypePicker
                  types={CLASS_TYPES}
                  selected={quickForm.type}
                  onSelect={(type) => setQuickForm(prev => ({ ...prev, type }))}
                  theme={theme}
                />

                {/* Time Selection */}
                <View style={styles.formRow}>
                  <View style={{ flex: 1 }}>
                    <HourScrollPicker
                      selected={quickForm.startTime}
                      onSelect={(startTime) => {
                        const startIdx = timeSlots.indexOf(startTime);
                        const endIdx = Math.min(startIdx + 1, timeSlots.length - 1);
                        setQuickForm(prev => ({ 
                          ...prev, 
                          startTime,
                          endTime: timeSlots[endIdx]
                        }));
                      }}
                      label="Début"
                      timeSlots={timeSlots}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <HourScrollPicker
                      selected={quickForm.endTime}
                      onSelect={(endTime) => setQuickForm(prev => ({ ...prev, endTime }))}
                      label="Fin"
                      timeSlots={timeSlots}
                    />
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* FAB */}
      {!isEditMode && (
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary }]} 
          onPress={handleOpenQuickAdd}
          accessibilityLabel="Ajouter un cours"
          accessibilityRole="button"
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Calendar
  calendarContainer: {
    height: '45%',
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
  calendarGrid: { gap: 4 },
  calendarWeek: { flexDirection: 'row', gap: 4 },
  calendarDay: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: { fontSize: 16, fontWeight: '500' },

  // Day Schedule
  dayScheduleContainer: { flex: 1, paddingTop: 20 },
  dayScheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  todayLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  activitiesCount: { fontSize: 24, fontWeight: 'bold' },
  dayScheduleActions: { flexDirection: 'row', gap: 8 },
  editButton: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1, 
    borderColor: '#00000020',
  },
  
  // Classes List
  classesList: { flex: 1, paddingHorizontal: 20 },
  classesListContent: { paddingBottom: 100 },
  classesContainer: { gap: 12 },
  classCard: {
    borderRadius: 16, 
    padding: 16, 
    borderLeftWidth: 4,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 3,
    marginBottom: 12,
  },
  classContent: { flex: 1 },
  classHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    marginBottom: 8,
  },
  classSubject: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 8 },
  classTime: { fontSize: 14, fontWeight: '600' },
  classFooter: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginTop: 8,
  },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  typeBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  classActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
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
    marginBottom: 24 
  },
  addClassButton: {
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    borderRadius: 24, 
    alignItems: 'center',
  },
  addClassButtonText: { color: '#fff', fontWeight: '600' },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: { 
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalKeyboardView: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1,
  },
  modalCancel: { fontSize: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalSave: { fontSize: 16, fontWeight: '600' },
  modalContent: { flex: 1, padding: 20 },
  
  // Form
  formSection: { marginBottom: 20 },
  formLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#333'
  },
  formRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  
  // Subjects
  subjectsContainer: { flexDirection: 'row', gap: 8 },
  subjectChip: {
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 8,
    borderRadius: 20, 
    borderWidth: 1, 
    gap: 6, 
    marginRight: 8,
  },
  subjectChipText: { fontSize: 14, fontWeight: '500' },
  
  // Types
  typeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1 
  },
  typeChipText: { fontSize: 14, fontWeight: '500' },
  
  // Hour Picker
  hourPickerContainer: { marginBottom: 12 },
  hourPickerWrapper: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    padding: 4,
  },
  hourScrollView: {
    flex: 1,
  },
  hourPickerContent: { 
    paddingVertical: 4,
    alignItems: 'center',
  },
  hourChip: {
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    marginVertical: 2,
    alignItems: 'center', 
    justifyContent: 'center',
    minWidth: 80,
    height: 40,
  },
  hourChipText: { fontWeight: 'bold', fontSize: 15 },
  
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
    gap: 16
  },
  loadingText: { fontSize: 16 },
  bottomPadding: { height: 40 },
});