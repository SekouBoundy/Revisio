// app/(tabs)/schedule.js

import React, { useContext, useState, useMemo, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Vibration,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

const { width } = Dimensions.get('window');

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const hour = 6 + i;
  return `${hour.toString().padStart(2, '0')}:00`;
});
const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const MONTHS = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];
const CLASS_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];
const CLASS_TYPES = ['Cours', 'Devoir', 'Examen'];
const SUBJECTS_BY_LEVEL = {
  DEF: ['Français', 'Mathématiques', 'Sciences', 'Histoire-Géo', 'Anglais', 'Sport'],
  '6ème': ['Français', 'Mathématiques', 'SVT', 'Histoire-Géo', 'Anglais', 'Arts', 'Sport'],
  '5ème': ['Français', 'Mathématiques', 'SVT', 'Histoire-Géo', 'Anglais', 'Espagnol', 'Arts', 'Sport'],
  '4ème': ['Français', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Histoire-Géo', 'Anglais', 'Espagnol', 'Arts', 'Sport'],
  '3ème': ['Français', 'Mathématiques', 'SVT', 'Physique-Chimie', 'Histoire-Géo', 'Anglais', 'Espagnol', 'Arts', 'Sport', 'Technologie'],
};

// --- Helper Functions ---
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day === 0 ? 6 : day - 1));
  return new Date(d.setDate(diff));
}
function getWeekDates(date) {
  const monday = getMonday(date);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
function getDateKey(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// --- Components ---
const ErrorBoundary = ({ children, theme }) => {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="warning-outline" size={64} color={theme.primary} />
        <Text style={[styles.errorText, { color: theme.text }]}>
          Une erreur est survenue
        </Text>
        <TouchableOpacity
          style={[styles.errorButton, { backgroundColor: theme.primary }]}
          onPress={() => setHasError(false)}
        >
          <Text style={styles.errorButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return children;
};

const LoadingScreen = ({ theme }) => (
  <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
    <ActivityIndicator size="large" color={theme.primary} />
    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
      Chargement...
    </Text>
  </View>
);

const ViewSwitcher = ({ view, setView, theme }) => (
  <View style={styles.switcherContainer}>
    {[
      { key: 'day', icon: 'today', label: 'Jour' },
      { key: 'week', icon: 'calendar', label: 'Semaine' },
      { key: 'month', icon: 'calendar-outline', label: 'Mois' }
    ].map(({ key, icon, label }) => (
      <TouchableOpacity
        key={key}
        style={[
          styles.switchButton,
          {
            backgroundColor: view === key ? theme.primary : 'transparent',
            borderColor: theme.primary,
          }
        ]}
        onPress={() => setView(key)}
      >
        <Ionicons
          name={icon}
          size={18}
          color={view === key ? '#FFFFFF' : theme.primary}
        />
        <Text style={[
          styles.switchText,
          { color: view === key ? '#FFFFFF' : theme.primary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const FilterChips = ({ filterType, onFilterChange, theme }) => (
  <View style={styles.chipsRow}>
    {['all', ...CLASS_TYPES].map((type, i, arr) => (
      <TouchableOpacity
        key={type}
        style={[
          styles.chipPill,
          {
            backgroundColor: filterType === type ? theme.primary : theme.cardBackground,
            borderColor: theme.primary,
            marginRight: i === arr.length - 1 ? 0 : 8,
          }
        ]}
        onPress={() => onFilterChange(type)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.chipText,
            { color: filterType === type ? '#fff' : theme.primary }
          ]}
        >
          {type === 'all' ? 'Tous' : type}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const WeekNavigation = ({ selectedDate, onPrevious, onNext, onToday, theme }) => {
  const monthName = MONTHS[selectedDate.getMonth()];
  return (
    <View style={[styles.navigationContainer, { backgroundColor: theme.cardBackground }]}>
      <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
        <Ionicons name="chevron-back" size={24} color={theme.primary} />
      </TouchableOpacity>
      <View style={styles.dateInfo}>
        <Text style={[styles.monthText, { color: theme.text }]}>
          {monthName} {selectedDate.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={onToday}
          style={[styles.todayButton, { borderColor: theme.primary }]}
        >
          <Text style={[styles.todayText, { color: theme.primary }]}>
            Aujourd'hui
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onNext} style={styles.navButton}>
        <Ionicons name="chevron-forward" size={24} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
};

const QuickActionMenu = ({ visible, classItem, onEdit, onDelete, onClose, theme }) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.quickMenuOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.quickMenu, { backgroundColor: theme.surface }]}>
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => { onEdit(); onClose(); }}
          >
            <Ionicons name="pencil" size={20} color={theme.primary} />
            <Text style={[styles.quickMenuText, { color: theme.text }]}>Modifier</Text>
          </TouchableOpacity>
          <View style={[styles.quickMenuDivider, { backgroundColor: theme.border }]} />
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => { onDelete(); onClose(); }}
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={[styles.quickMenuText, { color: '#EF4444' }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const SwipeableClassItem = ({ classItem, onEdit, onDelete, theme, children }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeThreshold = 80;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 30;
    },
    onPanResponderGrant: () => {
      Vibration.vibrate(30);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < 0) {
        translateX.setValue(Math.max(gestureState.dx, -150));
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx < -swipeThreshold) {
        Animated.spring(translateX, {
          toValue: -150,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <View style={styles.swipeableContainer}>
      <View style={styles.swipeActions}>
        <TouchableOpacity 
          style={[styles.swipeActionButton, { backgroundColor: theme.primary }]}
          onPress={() => { onEdit(classItem); resetPosition(); }}
        >
          <Ionicons name="pencil" size={18} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.swipeActionButton, { backgroundColor: '#EF4444' }]}
          onPress={() => { onDelete(classItem); resetPosition(); }}
        >
          <Ionicons name="trash" size={18} color="#FFFFFF" />
          <Text style={styles.swipeActionText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
      <Animated.View 
        style={[styles.swipeableContent, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};
const ClassBlock = ({ classItem, onPress, onLongPress, isHighlighted, theme }) => {
  const startMinutes = timeToMinutes(classItem.start);
  const endMinutes = timeToMinutes(classItem.end);
  const duration = (endMinutes - startMinutes) / 60;
  
  return (
    <TouchableOpacity
      style={[
        styles.classBlock,
        {
          backgroundColor: classItem.color,
          height: Math.max(duration * 60, 40),
          opacity: isHighlighted ? 1 : 0.9,
          borderWidth: isHighlighted ? 2 : 1,
          borderColor: isHighlighted ? theme.primary : 'rgba(255,255,255,0.3)',
        }
      ]}
      onPress={() => onPress(classItem)}
      onLongPress={() => onLongPress(classItem)}
      activeOpacity={0.8}
    >
      <Text style={styles.classSubject} numberOfLines={2}>
        {classItem.subject}
      </Text>
      <Text style={styles.classTime}>
        {classItem.start} - {classItem.end}
      </Text>
      <Text style={styles.classType}>{classItem.type}</Text>
      {classItem.isRecurring && classItem.type === 'Cours' && (
        <View style={styles.recurringIndicator}>
          <Ionicons name="repeat" size={10} color="rgba(255,255,255,0.8)" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const WeekView = ({ weekDates, scheduleData, onClassPress, onClassLongPress, filterType, theme }) => {
  const filteredData = useMemo(() => {
    const filtered = {};
    
    weekDates.forEach(date => {
      const key = getDateKey(date);
      let classes = scheduleData[key] || [];
      
      if (filterType !== 'all') {
        classes = classes.filter(c => c.type === filterType);
      }
      
      filtered[key] = classes;
    });
    
    return filtered;
  }, [weekDates, scheduleData, filterType]);

  return (
    <View style={styles.weekViewContainer}>
      {/* Week Header */}
      <View style={[styles.weekHeader, { backgroundColor: theme.primary }]}>
        <View style={styles.timeHeaderCell} />
        {weekDates.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <View key={index} style={styles.dayHeaderCell}>
              <Text style={[
                styles.dayHeaderText, 
                { color: '#FFFFFF', fontWeight: isToday ? 'bold' : '600' }
              ]}>
                {DAYS[index]}
              </Text>
              <Text style={[
                styles.dayHeaderDate, 
                { 
                  color: isToday ? '#FFD700' : '#FFFFFF',
                  fontWeight: isToday ? 'bold' : '500'
                }
              ]}>
                {date.getDate()}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Timetable Grid */}
      <ScrollView style={styles.timetableScroll} showsVerticalScrollIndicator={false}>
        {HOURS.map((hour, hourIndex) => (
          <View key={hour} style={styles.timetableRow}>
            {/* Time Cell */}
            <View style={[styles.timeCell, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.timeText, { color: theme.primary, fontWeight: '600' }]}>
                {hour}
              </Text>
            </View>
            
            {/* Day Cells */}
            {weekDates.map((date, dayIndex) => {
              const key = getDateKey(date);
              const classes = filteredData[key] || [];
              const hourClasses = classes.filter(c => c.start === hour);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <View key={dayIndex} style={[
                  styles.timetableCell,
                  { 
                    borderColor: theme.border,
                    backgroundColor: isToday ? theme.primary + '05' : '#FFFFFF'
                  }
                ]}>
                  {hourClasses.map((classItem, classIndex) => {
                    const duration = Math.max(
                      HOURS.indexOf(classItem.end) - HOURS.indexOf(classItem.start), 
                      1
                    );
                    
                    return (
                      <TouchableOpacity
                        key={classItem.id || classIndex}
                        style={[
                          styles.timetableClassBlock,
                          {
                            backgroundColor: classItem.color,
                            height: (duration * 50) - 2,
                          }
                        ]}
                        onPress={() => onClassPress(classItem)}
                        onLongPress={() => onClassLongPress(classItem)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.timetableClassSubject} numberOfLines={1}>
                          {classItem.subject}
                        </Text>
                        <Text style={styles.timetableClassType}>
                          {classItem.type}
                        </Text>
                        {classItem.isRecurring && classItem.type === 'Cours' && (
                          <Ionicons 
                            name="repeat" 
                            size={8} 
                            color="rgba(255,255,255,0.8)" 
                            style={styles.timetableRecurringIcon}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const DayView = ({ selectedDate, scheduleData, onClassPress, onClassLongPress, onClassEdit, onClassDelete, filterType, theme }) => {
  const dayClasses = useMemo(() => {
    const key = getDateKey(selectedDate);
    let classes = scheduleData[key] || [];
    
    if (filterType !== 'all') {
      classes = classes.filter(c => c.type === filterType);
    }
    
    return classes.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
  }, [selectedDate, scheduleData, filterType]);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <ScrollView style={styles.dayViewContainer}>
      <View style={[styles.dayHeader, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.dayTitle, { color: theme.text }]}>
          {DAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]} {selectedDate.getDate()}
        </Text>
        {isToday && (
          <View style={[styles.todayBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.todayBadgeText}>AUJOURD'HUI</Text>
          </View>
        )}
      </View>

      {dayClasses.length === 0 ? (
        <View style={styles.emptyDayContainer}>
          <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyDayText, { color: theme.textSecondary }]}>
            Aucun cours prévu
          </Text>
        </View>
      ) : (
        <View style={styles.dayClassesList}>
          {dayClasses.map((classItem, index) => (
            <SwipeableClassItem
              key={classItem.id || index}
              classItem={classItem}
              onEdit={onClassEdit}
              onDelete={onClassDelete}
              theme={theme}
            >
              <TouchableOpacity
                style={[styles.dayClassItem, { backgroundColor: theme.cardBackground }]}
                onPress={() => onClassPress(classItem)}
                onLongPress={() => onClassLongPress(classItem)}
              >
                <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
                <View style={styles.dayClassContent}>
                  <Text style={[styles.dayClassSubject, { color: theme.text }]}>
                    {classItem.subject}
                  </Text>
                  <Text style={[styles.dayClassType, { color: theme.textSecondary }]}>
                    {classItem.type}
                  </Text>
                  <Text style={[styles.dayClassTime, { color: theme.primary }]}>
                    {classItem.start} - {classItem.end}
                  </Text>
                </View>
                {classItem.isRecurring && classItem.type === 'Cours' && (
                  <Ionicons name="repeat" size={16} color={theme.textSecondary} style={styles.recurringIcon} />
                )}
              </TouchableOpacity>
            </SwipeableClassItem>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const MonthView = ({ selectedDate, scheduleData, onDayPress, filterType, theme }) => {
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const startDate = getMonday(monthStart);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 41); // 6 weeks

  const weeks = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <View style={styles.monthViewContainer}>
      <View style={styles.monthHeader}>
        {DAYS.map(day => (
          <Text key={day} style={[styles.monthDayHeader, { color: theme.textSecondary }]}>
            {day}
          </Text>
        ))}
      </View>
      
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.monthWeek}>
          {week.map((date, dayIndex) => {
            const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const allDayClasses = scheduleData[getDateKey(date)] || [];
            
            // Apply filter
            const dayClasses = filterType === 'all' 
              ? allDayClasses 
              : allDayClasses.filter(c => c.type === filterType);
            
            return (
              <TouchableOpacity 
                key={dayIndex} 
                style={[
                  styles.monthDay,
                  { backgroundColor: isToday ? theme.primary + '20' : 'transparent' }
                ]}
                onPress={() => isCurrentMonth && onDayPress && onDayPress(date)}
                disabled={!isCurrentMonth}
              >
                <Text style={[
                  styles.monthDayText,
                  { 
                    color: isCurrentMonth ? 
                      (isToday ? theme.primary : theme.text) : 
                      theme.textSecondary,
                    fontWeight: isToday ? 'bold' : 'normal'
                  }
                ]}>
                  {date.getDate()}
                </Text>
                {dayClasses.length > 0 && (
                  <View style={styles.monthDayDots}>
                    {dayClasses.slice(0, 3).map((classItem, index) => (
                      <View
                        key={index}
                        style={[
                          styles.monthDayDot,
                          { backgroundColor: classItem.color }
                        ]}
                      />
                    ))}
                    {dayClasses.length > 3 && (
                      <Text style={[styles.monthDayMore, { color: theme.textSecondary }]}>
                        +{dayClasses.length - 3}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const ClassModal = ({ visible, classData, onSave, onDelete, onClose, theme, userLevel }) => {
  const [form, setForm] = useState({
    subject: '',
    type: 'Cours',
    start: '08:00',
    end: '10:00',
    color: CLASS_COLORS[0],
  });

  const availableSubjects = SUBJECTS_BY_LEVEL[userLevel] || SUBJECTS_BY_LEVEL.DEF;

  useEffect(() => {
    if (classData) {
      setForm(classData);
    } else {
      setForm({
        subject: '',
        type: 'Cours',
        start: '08:00',
        end: '10:00',
        color: CLASS_COLORS[0],
      });
    }
  }, [classData, visible]);

  const handleSave = () => {
    if (!form.subject.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une matière');
      return;
    }
    
    if (timeToMinutes(form.start) >= timeToMinutes(form.end)) {
      Alert.alert('Erreur', 'L\'heure de fin doit être après l\'heure de début');
      return;
    }

    onSave({
      ...form,
      id: classData?.id || generateId(),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalHeaderButton, { color: theme.primary }]}>Annuler</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>
            {classData ? 'Modifier le cours' : 'Nouveau cours'}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.modalHeaderButton, { color: theme.primary }]}>
              {classData ? 'Modifier' : 'Ajouter'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Subject Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Matière *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {availableSubjects.map(subject => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectChip,
                    {
                      backgroundColor: form.subject === subject ? theme.primary : theme.cardBackground,
                      borderColor: theme.primary,
                    }
                  ]}
                  onPress={() => setForm({ ...form, subject })}
                >
                  <Text style={[
                    styles.subjectChipText,
                    { color: form.subject === subject ? '#FFFFFF' : theme.primary }
                  ]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Type */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
            <View style={styles.typeRow}>
              {CLASS_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: form.type === type ? theme.primary : theme.cardBackground,
                      borderColor: theme.primary,
                    }
                  ]}
                  onPress={() => setForm({ ...form, type })}
                >
                  <Text style={[
                    styles.typeChipText,
                    { color: form.type === type ? '#FFFFFF' : theme.primary }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Début</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timeScrollContainer}
              contentContainerStyle={styles.timeScrollContent}
            >
              {HOURS.map(hour => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: form.start === hour ? theme.primary : theme.cardBackground,
                      borderColor: theme.primary,
                    }
                  ]}
                  onPress={() => setForm({ ...form, start: hour })}
                >
                  <Text style={[
                    styles.timeChipText,
                    { color: form.start === hour ? '#FFFFFF' : theme.primary }
                  ]}>
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Fin</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timeScrollContainer}
              contentContainerStyle={styles.timeScrollContent}
            >
              {HOURS.map(hour => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: form.end === hour ? theme.primary : theme.cardBackground,
                      borderColor: theme.primary,
                    }
                  ]}
                  onPress={() => setForm({ ...form, end: hour })}
                >
                  <Text style={[
                    styles.timeChipText,
                    { color: form.end === hour ? '#FFFFFF' : theme.primary }
                  ]}>
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Color */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.text }]}>Couleur</Text>
            <View style={styles.colorPicker}>
              {CLASS_COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    form.color === color && styles.selectedColor
                  ]}
                  onPress={() => setForm({ ...form, color })}
                >
                  {form.color === color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {classData && (
            <TouchableOpacity
              style={[styles.deleteButton, { borderColor: '#EF4444' }]}
              onPress={() => {
                Alert.alert(
                  'Supprimer le cours',
                  'Êtes-vous sûr de vouloir supprimer ce cours ?',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(classData) }
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={styles.deleteButtonText}>Supprimer le cours</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// --- Main Component ---
export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();

  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [quickMenuVisible, setQuickMenuVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userSchedule');
      setScheduleData(stored ? JSON.parse(stored) : {});
    } catch (error) {
      console.error('Error loading schedule:', error);
      ToastAndroid.show('Erreur de chargement', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const saveScheduleData = async (data) => {
    try {
      setScheduleData(data);
      await AsyncStorage.setItem('userSchedule', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving schedule:', error);
      ToastAndroid.show('Erreur de sauvegarde', ToastAndroid.SHORT);
    }
  };

  const handleClassSave = (classData) => {
    const dateKey = getDateKey(selectedDate);
    const updated = { ...scheduleData };
    
    if (editingClass) {
      // Update existing class
      updated[dateKey] = updated[dateKey].map(c =>
        c.id === editingClass.id ? classData : c
      );
      ToastAndroid.show('Cours modifié', ToastAndroid.SHORT);
    } else {
      // Add new class
      if (!updated[dateKey]) updated[dateKey] = [];
      
      // Add to selected date
      updated[dateKey].push(classData);
      
      // If it's a "Cours" type, make it recurring (add to same day of week for next 12 weeks)
      if (classData.type === 'Cours') {
        const recurringClass = { ...classData, isRecurring: true };
        updated[dateKey] = updated[dateKey].map(c => 
          c.id === classData.id ? recurringClass : c
        );
        
        // Add to future weeks
        for (let week = 1; week <= 12; week++) {
          const futureDate = new Date(selectedDate);
          futureDate.setDate(selectedDate.getDate() + (week * 7));
          const futureKey = getDateKey(futureDate);
          
          if (!updated[futureKey]) updated[futureKey] = [];
          updated[futureKey].push({
            ...recurringClass,
            id: generateId(),
          });
        }
        ToastAndroid.show('Cours récurrent ajouté', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Cours ajouté', ToastAndroid.SHORT);
      }
    }
    
    saveScheduleData(updated);
    setModalVisible(false);
    setEditingClass(null);
    Vibration.vibrate(50);
  };

  const handleClassDelete = (classData) => {
    const dateKey = getDateKey(selectedDate);
    const updated = { ...scheduleData };
    if (updated[dateKey]) {
      updated[dateKey] = updated[dateKey].filter(c => c.id !== classData.id);
    }
    saveScheduleData(updated);
    setModalVisible(false);
    setEditingClass(null);
    ToastAndroid.show('Cours supprimé', ToastAndroid.SHORT);
    Vibration.vibrate(100);
  };

  const handleQuickDelete = (classData) => {
    Alert.alert(
      'Supprimer le cours',
      `Supprimer "${classData.subject}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => handleClassDelete(classData)
        }
      ]
    );
  };

  const openAddModal = () => {
    setEditingClass(null);
    setModalVisible(true);
  };

  const openEditModal = (classData) => {
    setEditingClass(classData);
    setModalVisible(true);
  };

  const handleClassPress = (classData) => {
    setSelectedClass(classData);
    setQuickMenuVisible(true);
  };

  const handleClassLongPress = (classData) => {
    Vibration.vibrate(50);
    setSelectedClass(classData);
    setQuickMenuVisible(true);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const navigateDay = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const hasClasses = Object.keys(scheduleData).some(key => scheduleData[key]?.length > 0);

  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <ErrorBoundary theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.primary }]}>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
              Emploi du Temps
            </Text>
            <ViewSwitcher view={view} setView={setView} theme={theme} />
          </View>

          {/* Filter */}
          <FilterChips
            filterType={filterType}
            onFilterChange={setFilterType}
            theme={theme}
          />

          {/* Navigation */}
          <WeekNavigation
            selectedDate={selectedDate}
            onPrevious={() => {
              if (view === 'month') navigateMonth(-1);
              else if (view === 'week') navigateWeek(-1);
              else navigateDay(-1);
            }}
            onNext={() => {
              if (view === 'month') navigateMonth(1);
              else if (view === 'week') navigateWeek(1);
              else navigateDay(1);
            }}
            onToday={goToToday}
            theme={theme}
          />

          {/* Content */}
          <View style={{ flex: 1 }}>
            {!hasClasses ? (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="calendar-outline" size={80} color={theme.textSecondary} />
                <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
                  Aucun cours planifié
                </Text>
                <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
                  Ajoutez votre premier cours pour commencer
                </Text>
                <TouchableOpacity
                  style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
                  onPress={openAddModal}
                >
                  <Text style={styles.emptyStateButtonText}>Ajouter un cours</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {view === 'week' && (
                  <WeekView
                    weekDates={weekDates}
                    scheduleData={scheduleData}
                    onClassPress={handleClassPress}
                    onClassLongPress={handleClassLongPress}
                    filterType={filterType}
                    theme={theme}
                  />
                )}
                {view === 'day' && (
                  <DayView
                    selectedDate={selectedDate}
                    scheduleData={scheduleData}
                    onClassPress={handleClassPress}
                    onClassLongPress={handleClassLongPress}
                    onClassEdit={openEditModal}
                    onClassDelete={handleQuickDelete}
                    filterType={filterType}
                    theme={theme}
                  />
                )}
                {view === 'month' && (
                  <MonthView
                    selectedDate={selectedDate}
                    scheduleData={scheduleData}
                    onDayPress={(date) => {
                      setSelectedDate(date);
                      setView('day');
                    }}
                    filterType={filterType}
                    theme={theme}
                  />
                )}
              </>
            )}
          </View>

          {/* FAB */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={openAddModal}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Quick Action Menu */}
          <QuickActionMenu
            visible={quickMenuVisible}
            classItem={selectedClass}
            onEdit={() => openEditModal(selectedClass)}
            onDelete={() => handleQuickDelete(selectedClass)}
            onClose={() => setQuickMenuVisible(false)}
            theme={theme}
          />

          {/* Modal */}
          <ClassModal
            visible={modalVisible}
            classData={editingClass}
            onSave={handleClassSave}
            onDelete={handleClassDelete}
            onClose={() => {
              setModalVisible(false);
              setEditingClass(null);
            }}
            theme={theme}
            userLevel={user?.level || 'DEF'}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  // View Switcher
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  switchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Filter Chips (compact pills)
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  chipPill: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 0,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  navButton: { padding: 8 },
  dateInfo: { alignItems: 'center' },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  todayText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Week View (Timetable)
  weekViewContainer: { 
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  weekHeader: {
    flexDirection: 'row',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeHeaderCell: { 
    width: 60, 
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderCell: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.3)',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dayHeaderDate: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  
  // Timetable Grid
  timetableScroll: {
    flex: 1,
  },
  timetableRow: {
    flexDirection: 'row',
    height: 50,
  },
  timeCell: {
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timetableCell: {
    flex: 1,
    height: 50,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    position: 'relative',
    padding: 1,
  },
  timetableClassBlock: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    borderRadius: 4,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  timetableClassSubject: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timetableClassType: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 7,
    textAlign: 'center',
    marginTop: 1,
  },
  timetableRecurringIcon: {
    position: 'absolute',
    top: 1,
    right: 1,
  },
  classBlock: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 6,
    padding: 4,
    justifyContent: 'center',
    minHeight: 40,
  },
  classSubject: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  classTime: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  classType: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
  },

  // Day View
  dayViewContainer: { flex: 1 },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyDayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyDayText: {
    fontSize: 16,
    marginTop: 16,
  },
  dayClassesList: { padding: 16 },
  dayClassItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classColorBar: { width: 4 },
  dayClassContent: {
    flex: 1,
    padding: 16,
  },
  dayClassSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dayClassType: {
    fontSize: 14,
    marginBottom: 4,
  },
  dayClassTime: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  // Month View
  monthViewContainer: {
    flex: 1,
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  monthDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  monthWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  monthDay: {
    flex: 1,
    height: 60,
    padding: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  monthDayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  monthDayDots: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  monthDayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  monthDayMore: {
    fontSize: 8,
    marginLeft: 2,
  },

  // Quick Menu
  quickMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickMenu: {
    borderRadius: 12,
    padding: 8,
    elevation: 8,
    minWidth: 150,
  },
  quickMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  quickMenuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  quickMenuDivider: {
    height: 1,
    marginVertical: 4,
  },

  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalHeaderButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: { marginBottom: 20 },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  subjectChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRow: { marginBottom: 15 },
  timeScrollContainer: {
    maxHeight: 50,
  },
  timeScrollContent: {
    paddingHorizontal: 4,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  colorPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // Error/Loading
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});