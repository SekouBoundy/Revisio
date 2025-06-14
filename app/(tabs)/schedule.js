// app/(tabs)/schedule.js

import React, { useContext, useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Vibration,
  ToastAndroid,
  ActivityIndicator,
  Alert,
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

// ------------------------------
// --------- PILLS --------------
// ------------------------------
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

// ---- (For brevity, no changes needed to WeekView, DayView, MonthView, ClassModal from your original)

//// ... Keep your WeekView, DayView, MonthView, ClassModal here unchanged ... ////

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
    if (!updated[dateKey]) updated[dateKey] = [];
    if (editingClass) {
      updated[dateKey] = updated[dateKey].map(c =>
        c.id === editingClass.id ? classData : c
      );
      ToastAndroid.show('Cours modifié', ToastAndroid.SHORT);
    } else {
      updated[dateKey].push(classData);
      ToastAndroid.show('Cours ajouté', ToastAndroid.SHORT);
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
          <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              Emploi du Temps
            </Text>
            <ViewSwitcher view={view} setView={setView} theme={theme} />
          </View>

          {/* Filter (now super thin pills) */}
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
                {/* Put your WeekView, DayView, MonthView here, unchanged */}
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
          {/* ... Your ClassModal here as before ... */}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  // View Switcher (Jour/Semaine/Mois)
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

  // Filter Chips (pills)
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

  // Week/Month Navigation Bar
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

  // Week View
  weekViewContainer: { flex: 1 },
  weekHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  timeHeaderCell: { width: 60, height: 50 },
  dayHeaderCell: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
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
  timeGrid: { flexDirection: 'column' },
  timeRow: {
    flexDirection: 'row',
    height: 60,
  },
  timeCell: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayCell: {
    flex: 1,
    height: 60,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    padding: 2,
    position: 'relative',
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
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    borderWidth: 1,
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

