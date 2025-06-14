// app/(tabs)/schedule.js

import React, { useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Vibration,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  Animated,
  PanGestureHandler,
  GestureHandlerRootView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed expo-notifications dependency

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

// --- Constants ---
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
  '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', 
  '#26A69A', '#FFCA28', '#EF5350', '#5C6BC0',
  '#8BC34A', '#FF9800', '#9C27B0', '#00BCD4'
];

const CLASS_TYPES = ['Cours', 'TD', 'TP', 'Examen', 'Contrôle', 'Conférence', 'Séminaire'];

const REPEAT_OPTIONS = [
  { value: 'none', label: 'Aucune' },
  { value: 'weekly', label: 'Chaque semaine' },
  { value: 'daily', label: 'Chaque jour' }
];

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

function validateTimeFormat(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function isValidTimeRange(start, end) {
  if (!validateTimeFormat(start) || !validateTimeFormat(end)) return false;
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function checkTimeConflict(newClass, existingClasses, excludeId = null) {
  const newStart = timeToMinutes(newClass.start);
  const newEnd = timeToMinutes(newClass.end);
  
  return existingClasses.some(existing => {
    if (excludeId && existing.id === excludeId) return false;
    
    const existingStart = timeToMinutes(existing.start);
    const existingEnd = timeToMinutes(existing.end);
    
    return (newStart < existingEnd && newEnd > existingStart);
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function addRecurringEvents(baseClass, dates, existingData) {
  const updated = { ...existingData };
  
  dates.forEach(date => {
    const key = getDateKey(date);
    if (!updated[key]) updated[key] = [];
    
    const newClass = {
      ...baseClass,
      id: generateId(),
      date: key
    };
    
    if (!checkTimeConflict(newClass, updated[key])) {
      updated[key].push(newClass);
    }
  });
  
  return updated;
}

// --- Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Schedule Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={[styles.errorContainer, { backgroundColor: this.props.theme.background }]}>
          <Ionicons name="warning" size={48} color={this.props.theme.error || '#EF5350'} />
          <Text style={[styles.errorText, { color: this.props.theme.text }]}>
            Une erreur est survenue
          </Text>
          <TouchableOpacity 
            style={[styles.errorButton, { backgroundColor: this.props.theme.primary }]}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.errorButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// --- Components ---
const LoadingScreen = ({ theme }) => (
  <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
    <ActivityIndicator size="large" color={theme.primary} />
    <Text style={[styles.loadingText, { color: theme.text }]}>Chargement...</Text>
  </View>
);

const SearchAndFilter = ({ searchQuery, onSearchChange, filterType, onFilterChange, theme }) => (
  <View style={styles.searchFilterContainer}>
    <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
      <Ionicons name="search" size={20} color={theme.textSecondary} />
      <TextInput
        style={[styles.searchInput, { color: theme.text }]}
        placeholder="Rechercher un cours..."
        placeholderTextColor={theme.textSecondary}
        value={searchQuery}
        onChangeText={onSearchChange}
      />
      {searchQuery ? (
        <TouchableOpacity onPress={() => onSearchChange('')}>
          <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
    
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterChip, { 
          backgroundColor: filterType === 'all' ? theme.primary : theme.surface 
        }]}
        onPress={() => onFilterChange('all')}
      >
        <Text style={{ color: filterType === 'all' ? '#fff' : theme.text }}>Tous</Text>
      </TouchableOpacity>
      {CLASS_TYPES.map(type => (
        <TouchableOpacity
          key={type}
          style={[styles.filterChip, { 
            backgroundColor: filterType === type ? theme.primary : theme.surface 
          }]}
          onPress={() => onFilterChange(type)}
        >
          <Text style={{ color: filterType === type ? '#fff' : theme.text }}>{type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const ConflictWarning = ({ conflicts, theme }) => {
  if (!conflicts.length) return null;
  
  return (
    <View style={[styles.conflictWarning, { backgroundColor: theme.error + '20' }]}>
      <Ionicons name="warning" size={16} color={theme.error || '#EF5350'} />
      <Text style={[styles.conflictText, { color: theme.error || '#EF5350' }]}>
        Conflit détecté avec {conflicts.length} cours
      </Text>
    </View>
  );
};

const UndoToast = ({ visible, onUndo, onDismiss, theme }) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.undoToast, 
        { backgroundColor: theme.surface, transform: [{ translateY }] }
      ]}
    >
      <Text style={[styles.undoText, { color: theme.text }]}>Cours supprimé</Text>
      <TouchableOpacity onPress={onUndo} style={styles.undoButton}>
        <Text style={[styles.undoButtonText, { color: theme.primary }]}>ANNULER</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ViewSwitcher = ({ view, setView, theme }) => (
  <View style={styles.switcherRow}>
    {['month', 'week', 'day'].map(viewType => (
      <TouchableOpacity
        key={viewType}
        style={[styles.switchButton, { 
          backgroundColor: view === viewType ? theme.primary : theme.surface 
        }]}
        onPress={() => setView(viewType)}
        accessibilityLabel={`Vue ${viewType === 'month' ? 'mensuelle' : viewType === 'week' ? 'hebdomadaire' : 'journalière'}`}
      >
        <Ionicons 
          name={viewType === 'month' ? "calendar-outline" : viewType === 'week' ? "calendar" : "today"} 
          size={16} 
          color={view === viewType ? '#fff' : theme.text} 
        />
        <Text style={{ 
          color: view === viewType ? '#fff' : theme.text, 
          fontWeight: 'bold', 
          marginLeft: 5 
        }}>
          {viewType === 'month' ? 'Mois' : viewType === 'week' ? 'Semaine' : 'Jour'}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const WeekNavigation = ({ weekDates, onPrevious, onNext, onToday, theme }) => (
  <View style={styles.weekNavigation}>
    <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
      <Ionicons name="chevron-back" size={24} color={theme.primary} />
    </TouchableOpacity>
    
    <View style={styles.weekInfo}>
      <Text style={[styles.weekRange, { color: theme.text }]}>
        {weekDates[0].getDate()} - {weekDates[6].getDate()} {MONTHS[weekDates[0].getMonth()]}
      </Text>
      <TouchableOpacity onPress={onToday} style={[styles.todayButton, { borderColor: theme.primary }]}>
        <Text style={[styles.todayText, { color: theme.primary }]}>Aujourd'hui</Text>
      </TouchableOpacity>
    </View>
    
    <TouchableOpacity onPress={onNext} style={styles.navButton}>
      <Ionicons name="chevron-forward" size={24} color={theme.primary} />
    </TouchableOpacity>
  </View>
);

const ClassBlock = ({ classItem, onEdit, onLongPress, isHighlighted, searchQuery, theme }) => {
  const duration = Math.max(HOURS.indexOf(classItem.end) - HOURS.indexOf(classItem.start), 1);
  
  const highlightText = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <Text style={styles.highlightedText}>
          {text.substring(index, index + query.length)}
        </Text>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.classBlock,
        {
          backgroundColor: classItem.color,
          height: 38 * duration + (duration - 1),
          opacity: searchQuery && !isHighlighted ? 0.3 : 1,
        }
      ]}
      onPress={() => onEdit && onEdit(classItem)}
      onLongPress={() => onLongPress && onLongPress(classItem)}
      delayLongPress={350}
      accessibilityLabel={`${classItem.subject} de ${classItem.start} à ${classItem.end} en ${classItem.room || 'salle non spécifiée'}`}
    >
      <Text style={styles.classBlockSubject}>
        {highlightText(classItem.subject, searchQuery)}
      </Text>
      <Text style={styles.classBlockTime}>
        {classItem.start} - {classItem.end}
      </Text>
      <Text style={styles.classBlockType}>
        {highlightText(classItem.type, searchQuery)}
      </Text>
      {classItem.room && (
        <Text style={styles.classBlockRoom}>{classItem.room}</Text>
      )}
      {classItem.isRecurring && (
        <Ionicons name="repeat" size={10} color="#333" style={styles.recurringIcon} />
      )}
    </TouchableOpacity>
  );
};

const WeekGrid = ({ weekDates, scheduleData, theme, onEdit, onLongPress, searchQuery, filterType }) => {
  const screenWidth = Dimensions.get('window').width;
  const colWidth = (screenWidth - 60) / 7;

  const getDayBlocks = useCallback((date) => {
    const key = getDateKey(date);
    let blocks = (scheduleData[key] || []).map((cl, idx) => ({
      ...cl,
      startIdx: HOURS.indexOf(cl.start),
      endIdx: HOURS.indexOf(cl.end),
      _key: `${cl.id || idx}-${cl.subject}-${cl.start}-${cl.end}`
    }));

    // Apply filters
    if (filterType !== 'all') {
      blocks = blocks.filter(block => block.type === filterType);
    }

    if (searchQuery) {
      blocks = blocks.filter(block => 
        block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (block.room && block.room.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return blocks;
  }, [scheduleData, searchQuery, filterType]);

  return (
    <ScrollView horizontal style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Time labels */}
        <View style={styles.timeCol}>
          {HOURS.map((hour, i) => (
            <View key={hour} style={styles.timeCell}>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>{hour}</Text>
            </View>
          ))}
        </View>
        
        {/* Days columns */}
        {weekDates.map((date, dayIdx) => {
          const blocks = getDayBlocks(date);
          const isToday = date.toDateString() === (new Date()).toDateString();
          
          return (
            <View key={dayIdx} style={[styles.dayCol, { width: colWidth }]}>
              <View style={[styles.dayHeader, isToday && { backgroundColor: theme.primary + '20' }]}>
                <Text style={{ 
                  fontWeight: 'bold', 
                  color: isToday ? theme.primary : theme.text 
                }}>
                  {DAYS[dayIdx]}
                </Text>
                <Text style={{ 
                  fontSize: 13, 
                  color: isToday ? theme.primary : theme.text 
                }}>
                  {date.getDate()}
                </Text>
              </View>
              
              <View style={{ flex: 1 }}>
                {HOURS.map((hour, hIdx) => {
                  const block = blocks.find(b => b.startIdx === hIdx);
                  
                  if (block) {
                    const isHighlighted = searchQuery && (
                      block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (block.room && block.room.toLowerCase().includes(searchQuery.toLowerCase()))
                    );
                    
                    return (
                      <ClassBlock
                        key={block._key}
                        classItem={block}
                        onEdit={onEdit}
                        onLongPress={onLongPress}
                        isHighlighted={isHighlighted}
                        searchQuery={searchQuery}
                        theme={theme}
                      />
                    );
                  }
                  
                  if (!blocks.some(b => hIdx > b.startIdx && hIdx < b.endIdx)) {
                    return <View key={hour} style={styles.emptyCell} />;
                  }
                  return null;
                })}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const DayView = ({ selectedDate, scheduleData, theme, onEdit, onLongPress, searchQuery, filterType }) => {
  const dayBlocks = useMemo(() => {
    const key = getDateKey(selectedDate);
    let blocks = (scheduleData[key] || []).map((cl, idx) => ({
      ...cl,
      startIdx: HOURS.indexOf(cl.start),
      endIdx: HOURS.indexOf(cl.end),
      _key: `${cl.id || idx}-${cl.subject}-${cl.start}-${cl.end}`
    }));

    if (filterType !== 'all') {
      blocks = blocks.filter(block => block.type === filterType);
    }

    if (searchQuery) {
      blocks = blocks.filter(block => 
        block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (block.room && block.room.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return blocks.sort((a, b) => a.startIdx - b.startIdx);
  }, [selectedDate, scheduleData, searchQuery, filterType]);

  const isToday = selectedDate.toDateString() === (new Date()).toDateString();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[styles.dayViewHeader, { backgroundColor: theme.surface }]}>
        <Text style={[styles.dayViewTitle, { color: isToday ? theme.primary : theme.text }]}>
          {DAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]} {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]}
        </Text>
        {isToday && (
          <View style={[styles.todayIndicator, { backgroundColor: theme.primary }]}>
            <Text style={styles.todayIndicatorText}>Aujourd'hui</Text>
          </View>
        )}
      </View>
      
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {dayBlocks.length === 0 ? (
          <View style={styles.emptyDayState}>
            <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyDayText, { color: theme.textSecondary }]}>
              Aucun cours prévu
            </Text>
          </View>
        ) : (
          dayBlocks.map(block => {
            const isHighlighted = searchQuery && (
              block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
              block.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (block.room && block.room.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            
            return (
              <TouchableOpacity
                key={block._key}
                style={[
                  styles.dayViewClassBlock,
                  { 
                    backgroundColor: block.color,
                    opacity: searchQuery && !isHighlighted ? 0.3 : 1,
                  }
                ]}
                onPress={() => onEdit && onEdit(block)}
                onLongPress={() => onLongPress && onLongPress(block)}
                delayLongPress={350}
              >
                <View style={styles.dayViewClassContent}>
                  <Text style={styles.dayViewClassSubject}>{block.subject}</Text>
                  <Text style={styles.dayViewClassDetails}>
                    {block.start} - {block.end} • {block.type}
                  </Text>
                  {block.room && (
                    <Text style={styles.dayViewClassRoom}>📍 {block.room}</Text>
                  )}
                </View>
                {block.isRecurring && (
                  <Ionicons name="repeat" size={16} color="#333" />
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const EmptyState = ({ theme, onAdd }) => (
  <View style={styles.emptyState}>
    <Ionicons name="calendar-outline" size={64} color={theme.textSecondary} />
    <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
      Aucun cours planifié
    </Text>
    <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondary }]}>
      Ajoutez votre premier cours pour commencer
    </Text>
    <TouchableOpacity 
      style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
      onPress={onAdd}
    >
      <Text style={styles.emptyStateButtonText}>Ajouter un cours</Text>
    </TouchableOpacity>
    
    <TouchableOpacity 
      style={[styles.sampleDataButton, { borderColor: theme.primary }]}
      onPress={() => {/* Add sample data */}}
    >
      <Text style={[styles.sampleDataText, { color: theme.primary }]}>
        Charger des données d'exemple
      </Text>
    </TouchableOpacity>
  </View>
);

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();

  // State
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('week');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDateKey, setEditingDateKey] = useState(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [lastDeleted, setLastDeleted] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  // Form state with enhanced fields
  const [form, setForm] = useState({
    subject: '',
    type: 'Cours',
    start: '08:00',
    end: '10:00',
    color: '#42A5F5',
    room: '',
    repeat: 'none',
    notifications: true,
    description: '',
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
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
    loadData();
  }, []);

  // Check for conflicts when form changes
  useEffect(() => {
    if (modalVisible && editingDateKey) {
      const existingClasses = scheduleData[editingDateKey] || [];
      const newClass = { ...form, date: editingDateKey };
      
      if (checkTimeConflict(newClass, existingClasses, editingItem?.id)) {
        const conflictingClasses = existingClasses.filter(existing => {
          if (editingItem?.id && existing.id === editingItem.id) return false;
          const existingStart = timeToMinutes(existing.start);
          const existingEnd = timeToMinutes(existing.end);
          const newStart = timeToMinutes(form.start);
          const newEnd = timeToMinutes(form.end);
          return (newStart < existingEnd && newEnd > existingStart);
        });
        setConflicts(conflictingClasses);
      } else {
        setConflicts([]);
      }
    }
  }, [form.start, form.end, editingDateKey, scheduleData, modalVisible, editingItem]);

  const saveScheduleData = async (data) => {
    try {
      setScheduleData(data);
      await AsyncStorage.setItem('userSchedule', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving schedule:', error);
      ToastAndroid.show('Erreur de sauvegarde', ToastAndroid.SHORT);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setEditingDateKey(getDateKey(selectedDate));
    setForm({
      subject: '',
      type: 'Cours',
      start: '08:00',
      end: '10:00',
      color: '#42A5F5',
      room: '',
      repeat: 'none',
      description: '',
    });
    setConflicts([]);
    setModalVisible(true);
  };

  const openEditModal = (item, date = selectedDate) => {
    setEditingItem(item);
    setEditingDateKey(getDateKey(date));
    setForm({
      subject: item.subject,
      type: item.type,
      start: item.start,
      end: item.end,
      color: item.color,
      room: item.room || '',
      repeat: item.repeat || 'none',
      notifications: item.notifications !== false,
      description: item.description || '',
    });
    setConflicts([]);
    setModalVisible(true);
  };

  const validateForm = () => {
    if (!form.subject.trim()) {
      Alert.alert('Erreur', 'Le nom de la matière est requis');
      return false;
    }
    if (!isValidTimeRange(form.start, form.end)) {
      Alert.alert('Erreur', 'L\'heure de fin doit être après l\'heure de début');
      return false;
    }
    return true;
  };

  const generateRecurringDates = (repeat, startDate, weeks = 12) => {
    const dates = [];
    const start = new Date(startDate);
    
    if (repeat === 'weekly') {
      for (let i = 0; i < weeks; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + (i * 7));
        dates.push(date);
      }
    } else if (repeat === 'daily') {
      for (let i = 0; i < 30; i++) { // 30 days
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
          dates.push(date);
        }
      }
    }
    
    return dates;
  };

  const saveClass = () => {
    if (!validateForm()) return;
    
    let updated = { ...scheduleData };
    const classData = {
      ...form,
      id: editingItem?.id || generateId(),
      isRecurring: form.repeat !== 'none',
    };
    
    if (editingItem) {
      // Update existing class
      updated[editingDateKey] = (updated[editingDateKey] || []).map(c =>
        c.id === editingItem.id ? classData : c
      );
      ToastAndroid.show('Cours modifié', ToastAndroid.SHORT);
    } else {
      // Add new class
      if (form.repeat !== 'none') {
        const dates = generateRecurringDates(form.repeat, new Date(editingDateKey));
        updated = addRecurringEvents(classData, dates, updated);
        ToastAndroid.show(`Cours récurrent ajouté (${dates.length} occurrences)`, ToastAndroid.LONG);
      } else {
        if (!updated[editingDateKey]) updated[editingDateKey] = [];
        updated[editingDateKey].push(classData);
        ToastAndroid.show('Cours ajouté', ToastAndroid.SHORT);
      }
    }
    
    saveScheduleData(updated);
    setModalVisible(false);
    Vibration.vibrate(50);
  };

  const deleteClass = () => {
    Alert.alert(
      'Supprimer le cours',
      editingItem?.isRecurring 
        ? 'Supprimer toutes les occurrences ou seulement celle-ci ?'
        : 'Êtes-vous sûr de vouloir supprimer ce cours ?',
      editingItem?.isRecurring ? [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Cette occurrence',
          onPress: () => performDelete(false)
        },
        {
          text: 'Toutes les occurrences',
          style: 'destructive',
          onPress: () => performDelete(true)
        }
      ] : [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => performDelete(false)
        }
      ]
    );
  };

  const performDelete = (deleteAll = false) => {
    let updated = { ...scheduleData };
    
    if (deleteAll && editingItem?.isRecurring) {
      // Remove all occurrences of recurring event
      Object.keys(updated).forEach(dateKey => {
        updated[dateKey] = updated[dateKey].filter(c => 
          !(c.subject === editingItem.subject && c.start === editingItem.start && c.isRecurring)
        );
      });
    } else {
      // Remove single occurrence
      updated[editingDateKey] = (updated[editingDateKey] || []).filter(c => 
        c.id !== editingItem.id
      );
    }
    
    setLastDeleted({ item: editingItem, dateKey: editingDateKey, data: scheduleData });
    saveScheduleData(updated);
    setModalVisible(false);
    setUndoVisible(true);
    ToastAndroid.show('Cours supprimé', ToastAndroid.SHORT);
    Vibration.vibrate(40);
  };

  const undoDelete = () => {
    if (lastDeleted) {
      saveScheduleData(lastDeleted.data);
      setUndoVisible(false);
      setLastDeleted(null);
      ToastAndroid.show('Suppression annulée', ToastAndroid.SHORT);
    }
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

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const hasAnyClasses = Object.keys(scheduleData).some(key => scheduleData[key]?.length > 0);

  if (loading) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <ErrorBoundary theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <ViewSwitcher view={view} setView={setView} theme={theme} />
          
          <SearchAndFilter 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
            theme={theme}
          />

          {view === 'week' ? (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
              <WeekNavigation
                weekDates={weekDates}
                onPrevious={() => navigateWeek(-1)}
                onNext={() => navigateWeek(1)}
                onToday={goToToday}
                theme={theme}
              />
              
              {hasAnyClasses ? (
                <WeekGrid
                  weekDates={weekDates}
                  scheduleData={scheduleData}
                  theme={theme}
                  onEdit={openEditModal}
                  onLongPress={openEditModal}
                  searchQuery={searchQuery}
                  filterType={filterType}
                />
              ) : (
                <EmptyState theme={theme} onAdd={openAddModal} />
              )}
            </View>
          ) : view === 'day' ? (
            <View style={{ flex: 1 }}>
              <WeekNavigation
                weekDates={[selectedDate, selectedDate, selectedDate, selectedDate, selectedDate, selectedDate, selectedDate]}
                onPrevious={() => navigateDay(-1)}
                onNext={() => navigateDay(1)}
                onToday={goToToday}
                theme={theme}
              />
              
              <DayView
                selectedDate={selectedDate}
                scheduleData={scheduleData}
                theme={theme}
                onEdit={openEditModal}
                onLongPress={openEditModal}
                searchQuery={searchQuery}
                filterType={filterType}
              />
            </View>
          ) : (
            // Month view (simplified for space)
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: theme.text }}>Vue mensuelle - En développement</Text>
            </View>
          )}

          {/* FAB */}
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: theme.primary }]}
            onPress={openAddModal}
            accessibilityLabel="Ajouter un cours"
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Enhanced Modal */}
          <Modal 
            visible={modalVisible} 
            animationType="slide" 
            transparent 
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1, justifyContent: 'flex-end' }}
              >
                <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                      {editingItem ? "Modifier" : "Ajouter"} un cours
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={24} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <ConflictWarning conflicts={conflicts} theme={theme} />

                  <ScrollView style={styles.modalForm}>
                    {/* Subject */}
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Matière *</Text>
                      <TextInput
                        style={[styles.formInput, { 
                          backgroundColor: theme.background, 
                          color: theme.text,
                          borderColor: theme.textSecondary + '40'
                        }]}
                        placeholder="Nom de la matière"
                        placeholderTextColor={theme.textSecondary}
                        value={form.subject}
                        onChangeText={t => setForm(f => ({ ...f, subject: t }))}
                      />
                    </View>

                    {/* Type */}
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
                      <View style={styles.typeButtonsContainer}>
                        {CLASS_TYPES.map(type => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.typeButton,
                              { 
                                backgroundColor: form.type === type ? theme.primary : theme.surface,
                                borderColor: theme.textSecondary + '40'
                              }
                            ]}
                            onPress={() => setForm(f => ({ ...f, type }))}
                          >
                            <Text style={{ 
                              color: form.type === type ? '#fff' : theme.text,
                              fontSize: 12,
                              fontWeight: '600'
                            }}>
                              {type}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Time */}
                    <View style={styles.timeRow}>
                      <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                        <Text style={[styles.formLabel, { color: theme.text }]}>Début</Text>
                        <TextInput
                          style={[styles.formInput, { 
                            backgroundColor: theme.background, 
                            color: theme.text,
                            borderColor: theme.textSecondary + '40'
                          }]}
                          placeholder="08:00"
                          value={form.start}
                          onChangeText={t => setForm(f => ({ ...f, start: t }))}
                        />
                      </View>
                      
                      <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                        <Text style={[styles.formLabel, { color: theme.text }]}>Fin</Text>
                        <TextInput
                          style={[styles.formInput, { 
                            backgroundColor: theme.background, 
                            color: theme.text,
                            borderColor: theme.textSecondary + '40'
                          }]}
                          placeholder="10:00"
                          value={form.end}
                          onChangeText={t => setForm(f => ({ ...f, end: t }))}
                        />
                      </View>
                    </View>

                    {/* Room */}
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Salle</Text>
                      <TextInput
                        style={[styles.formInput, { 
                          backgroundColor: theme.background, 
                          color: theme.text,
                          borderColor: theme.textSecondary + '40'
                        }]}
                        placeholder="Ex: A101, Amphithéâtre..."
                        placeholderTextColor={theme.textSecondary}
                        value={form.room}
                        onChangeText={t => setForm(f => ({ ...f, room: t }))}
                      />
                    </View>

                    {/* Color */}
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Couleur</Text>
                      <View style={styles.colorOptions}>
                        {CLASS_COLORS.map(color => (
                          <TouchableOpacity
                            key={color}
                            style={[
                              styles.colorOption,
                              { backgroundColor: color },
                              form.color === color && styles.selectedColor
                            ]}
                            onPress={() => setForm(f => ({ ...f, color }))}
                          />
                        ))}
                      </View>
                    </View>

                    {/* Repeat */}
                    {!editingItem && (
                      <View style={styles.formGroup}>
                        <Text style={[styles.formLabel, { color: theme.text }]}>Répétition</Text>
                        <View style={styles.repeatButtonsContainer}>
                          {REPEAT_OPTIONS.map(option => (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.repeatButton,
                                { 
                                  backgroundColor: form.repeat === option.value ? theme.primary : theme.surface,
                                  borderColor: theme.textSecondary + '40'
                                }
                              ]}
                              onPress={() => setForm(f => ({ ...f, repeat: option.value }))}
                            >
                              <Text style={{ 
                                color: form.repeat === option.value ? '#fff' : theme.text,
                                fontSize: 14,
                                fontWeight: '600'
                              }}>
                                {option.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Notifications */}
                    <View style={[styles.formGroup, styles.switchRow]}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Notifications</Text>
                      <Switch
                        value={form.notifications}
                        onValueChange={val => setForm(f => ({ ...f, notifications: val }))}
                        trackColor={{ false: theme.textSecondary + '40', true: theme.primary + '60' }}
                        thumbColor={form.notifications ? theme.primary : '#f4f3f4'}
                      />
                    </View>

                    {/* Description */}
                    <View style={styles.formGroup}>
                      <Text style={[styles.formLabel, { color: theme.text }]}>Notes (optionnel)</Text>
                      <TextInput
                        style={[styles.formInput, { 
                          backgroundColor: theme.background, 
                          color: theme.text,
                          borderColor: theme.textSecondary + '40',
                          height: 60,
                          textAlignVertical: 'top'
                        }]}
                        placeholder="Notes additionnelles..."
                        placeholderTextColor={theme.textSecondary}
                        value={form.description}
                        onChangeText={t => setForm(f => ({ ...f, description: t }))}
                        multiline
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    {editingItem && (
                      <TouchableOpacity 
                        onPress={deleteClass}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash" size={20} color="#EF5350" />
                        <Text style={styles.deleteButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    )}
                    
                    <View style={styles.modalActions}>
                      <TouchableOpacity 
                        onPress={() => setModalVisible(false)}
                        style={styles.cancelButton}
                      >
                        <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                          Annuler
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={saveClass}
                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                        disabled={conflicts.length > 0}
                      >
                        <Text style={[styles.saveButtonText, { 
                          opacity: conflicts.length > 0 ? 0.5 : 1 
                        }]}>
                          {editingItem ? "Sauvegarder" : "Ajouter"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </Modal>

          <UndoToast
            visible={undoVisible}
            onUndo={undoDelete}
            onDismiss={() => setUndoVisible(false)}
            theme={theme}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Error boundary
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  // Search and filter
  searchFilterContainer: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    elevation: 1,
  },

  // Conflict warning
  conflictWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  conflictText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  // Undo toast
  undoToast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    elevation: 6,
  },
  undoText: {
    fontSize: 16,
  },
  undoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  undoButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Switcher
  switcherRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 7,
    elevation: 2,
  },

  // Week Navigation
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navButton: {
    padding: 8,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekRange: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  todayButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  todayText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Week grid
  timeCol: { 
    width: 46, 
    marginRight: 3, 
    alignItems: 'flex-end', 
    marginTop: 36 
  },
  timeCell: { 
    height: 39, 
    justifyContent: 'center', 
    alignItems: 'flex-end', 
    paddingRight: 6 
  },
  dayCol: { 
    flex: 1, 
    borderLeftWidth: 0.5, 
    borderColor: '#E0E0E0', 
    backgroundColor: '#FAFAFA' 
  },
  dayHeader: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#f5f8ff',
  },
  emptyCell: {
    height: 39,
    borderBottomWidth: 0.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff'
  },
  classBlock: {
    marginTop: 1,
    marginBottom: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#ddd',
    padding: 4,
    elevation: 2,
    position: 'relative',
  },
  classBlockSubject: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  classBlockTime: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  classBlockType: {
    fontSize: 9,
    textAlign: 'center',
    opacity: 0.8,
  },
  classBlockRoom: {
    fontSize: 8,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 1,
  },
  recurringIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  highlightedText: {
    backgroundColor: '#FFEB3B',
    fontWeight: 'bold',
  },

  // Day view
  dayViewHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dayViewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todayIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyDayState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyDayText: {
    fontSize: 16,
    marginTop: 12,
  },
  dayViewClassBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  dayViewClassContent: {
    flex: 1,
  },
  dayViewClassSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dayViewClassDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dayViewClassRoom: {
    fontSize: 12,
    color: '#888',
  },

  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sampleDataButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
  },
  sampleDataText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  timeRow: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Type and repeat buttons
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  repeatButtonsContainer: {
    gap: 8,
  },
  repeatButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },

  // Color picker
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },

  // Modal footer
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButtonText: {
    color: '#EF5350',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});