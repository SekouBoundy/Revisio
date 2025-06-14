// app/(tabs)/schedule.js

import React, { useContext, useState, useMemo, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

// --- Constants ---
const HOURS = Array.from({ length: 13 }, (_, i) => {
  const hour = 7 + i;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const DAYS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const MONTHS = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'
];

const CLASS_COLORS = [
  '#42A5F5', '#66BB6A', '#FF7043', '#AB47BC', 
  '#26A69A', '#FFCA28', '#EF5350', '#5C6BC0'
];

const CLASS_TYPES = ['Cours', 'TD', 'TP', 'Examen', 'Contrôle', 'Conférence'];

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

// --- Components ---
const LoadingScreen = ({ theme }) => (
  <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
    <ActivityIndicator size="large" color={theme.primary} />
    <Text style={[styles.loadingText, { color: theme.text }]}>Chargement...</Text>
  </View>
);

const SearchBar = ({ value, onChangeText, theme }) => (
  <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
    <Ionicons name="search" size={20} color={theme.textSecondary} />
    <TextInput
      style={[styles.searchInput, { color: theme.text }]}
      placeholder="Rechercher un cours..."
      placeholderTextColor={theme.textSecondary}
      value={value}
      onChangeText={onChangeText}
    />
    {value ? (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    ) : null}
  </View>
);

const ViewSwitcher = ({ view, setView, theme }) => (
  <View style={styles.switcherRow}>
    <TouchableOpacity
      style={[styles.switchButton, { backgroundColor: view === 'month' ? theme.primary : theme.surface }]}
      onPress={() => setView('month')}
      accessibilityLabel="Vue mensuelle"
    >
      <Ionicons name="calendar-outline" size={16} color={view === 'month' ? '#fff' : theme.text} />
      <Text style={{ color: view === 'month' ? '#fff' : theme.text, fontWeight: 'bold', marginLeft: 5 }}>
        Mois
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.switchButton, { backgroundColor: view === 'week' ? theme.primary : theme.surface }]}
      onPress={() => setView('week')}
      accessibilityLabel="Vue hebdomadaire"
    >
      <Ionicons name="calendar" size={16} color={view === 'week' ? '#fff' : theme.text} />
      <Text style={{ color: view === 'week' ? '#fff' : theme.text, fontWeight: 'bold', marginLeft: 5 }}>
        Semaine
      </Text>
    </TouchableOpacity>
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

const MonthCalendar = ({ theme, selectedDate, setSelectedDate, scheduleData }) => {
  const now = selectedDate;
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstDayOfWeek = firstDay.getDay() || 7;
  const totalCells = firstDayOfWeek - 1 + lastDay.getDate();
  const weeks = Math.ceil(totalCells / 7);

  let dayNum = 1 - (firstDayOfWeek - 1);

  const hasEvents = (date) => {
    const key = getDateKey(date);
    return scheduleData[key] && scheduleData[key].length > 0;
  };

  return (
    <View style={[styles.monthCalendar, { backgroundColor: theme.primary }]}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => {
          const prev = new Date(year, month - 1, 1);
          setSelectedDate(prev);
        }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>{MONTHS[month]} {year}</Text>
        
        <TouchableOpacity onPress={() => {
          const next = new Date(year, month + 1, 1);
          setSelectedDate(next);
        }}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.daysOfWeekRow}>
        {DAYS.map((d, i) => <Text key={i} style={styles.dayOfWeek}>{d}</Text>)}
      </View>
      
      {Array.from({ length: weeks }).map((_, wi) => (
        <View key={wi} style={styles.weekRow}>
          {Array.from({ length: 7 }).map((_, di) => {
            const thisDate = new Date(year, month, dayNum);
            const isCurrentMonth = thisDate.getMonth() === month;
            const isToday = thisDate.toDateString() === (new Date()).toDateString();
            const isSelected = thisDate.toDateString() === selectedDate.toDateString();
            const hasEventsToday = isCurrentMonth && hasEvents(thisDate);
            const d = dayNum;
            dayNum++;
            
            return (
              <TouchableOpacity
                key={di}
                style={[
                  styles.dayCell,
                  isToday && { borderColor: '#fff', borderWidth: 2 },
                  isSelected && { backgroundColor: '#fff' }
                ]}
                onPress={() => isCurrentMonth && setSelectedDate(new Date(thisDate))}
                disabled={!isCurrentMonth}
                accessibilityLabel={`${d} ${MONTHS[month]}`}
              >
                <Text style={{
                  color: isCurrentMonth ? (isSelected ? theme.primary : '#fff') : '#FFFFFF44',
                  fontWeight: isSelected ? 'bold' : '600'
                }}>
                  {d > 0 && d <= lastDay.getDate() ? d : ''}
                </Text>
                {hasEventsToday && (
                  <View style={styles.eventDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const TimeDropdown = ({ value, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={[styles.dropdown, { borderColor: theme.textSecondary }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ color: theme.text }}>{value}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, { backgroundColor: theme.surface }]}>
          <ScrollView style={{ maxHeight: 150 }}>
            {HOURS.map(hour => (
              <TouchableOpacity
                key={hour}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(hour);
                  setIsOpen(false);
                }}
              >
                <Text style={{ color: theme.text }}>{hour}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const ColorPicker = ({ selectedColor, onSelect, theme }) => (
  <View style={styles.colorPicker}>
    <Text style={[styles.colorPickerLabel, { color: theme.text }]}>Couleur :</Text>
    <View style={styles.colorOptions}>
      {CLASS_COLORS.map(color => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor
          ]}
          onPress={() => onSelect(color)}
        />
      ))}
    </View>
  </View>
);

const TypePicker = ({ selectedType, onSelect, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity 
        style={[styles.dropdown, { borderColor: theme.textSecondary }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ color: theme.text }}>{selectedType}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={theme.textSecondary} />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, { backgroundColor: theme.surface }]}>
          {CLASS_TYPES.map(type => (
            <TouchableOpacity
              key={type}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(type);
                setIsOpen(false);
              }}
            >
              <Text style={{ color: theme.text }}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const WeekGrid = ({ weekDates, scheduleData, theme, onEdit, searchQuery }) => {
  const screenWidth = Dimensions.get('window').width;
  const colWidth = (screenWidth - 60) / 7;

  const getDayBlocks = useCallback((date) => {
    const key = getDateKey(date);
    const blocks = (scheduleData[key] || []).map((cl, idx) => ({
      ...cl,
      startIdx: HOURS.indexOf(cl.start),
      endIdx: HOURS.indexOf(cl.end),
      _key: `${cl.subject}-${cl.start}-${cl.end}-${idx}`
    }));

    if (searchQuery) {
      return blocks.filter(block => 
        block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        block.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return blocks;
  }, [scheduleData, searchQuery]);

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
                    const duration = Math.max(block.endIdx - block.startIdx, 1);
                    const isHighlighted = searchQuery && (
                      block.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      block.type.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    
                    return (
                      <TouchableOpacity
                        key={block._key}
                        style={[
                          styles.classBlock,
                          {
                            backgroundColor: block.color,
                            height: 38 * duration + (duration - 1),
                            opacity: searchQuery && !isHighlighted ? 0.3 : 1,
                          }
                        ]}
                        onLongPress={() => onEdit && onEdit(block, date)}
                        delayLongPress={350}
                        accessibilityLabel={`${block.subject} de ${block.start} à ${block.end}`}
                      >
                        <Text style={styles.classBlockSubject}>
                          {block.subject}
                        </Text>
                        <Text style={styles.classBlockTime}>
                          {block.start} - {block.end}
                        </Text>
                        <Text style={styles.classBlockType}>
                          {block.type}
                        </Text>
                      </TouchableOpacity>
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
  </View>
);

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();

  // State
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingDateKey, setEditingDateKey] = useState(null);

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  // Form state
  const [form, setForm] = useState({
    subject: '',
    type: 'Cours',
    start: '07:00',
    end: '08:00',
    color: '#42A5F5',
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
      start: '07:00',
      end: '08:00',
      color: '#42A5F5',
    });
    setModalVisible(true);
  };

  const openEditModal = (item, date) => {
    setEditingItem(item);
    setEditingDateKey(getDateKey(date));
    setForm({
      subject: item.subject,
      type: item.type,
      start: item.start,
      end: item.end,
      color: item.color,
    });
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

  const saveClass = () => {
    if (!validateForm()) return;
    
    let updated = { ...scheduleData };
    
    if (editingItem) {
      updated[editingDateKey] = (updated[editingDateKey] || []).map(c =>
        c === editingItem ? { ...form } : c
      );
      ToastAndroid.show('Cours modifié', ToastAndroid.SHORT);
    } else {
      if (!updated[editingDateKey]) updated[editingDateKey] = [];
      updated[editingDateKey].push({ ...form });
      ToastAndroid.show('Cours ajouté', ToastAndroid.SHORT);
    }
    
    saveScheduleData(updated);
    setModalVisible(false);
    Vibration.vibrate(50);
  };

  const deleteClass = () => {
    Alert.alert(
      'Supprimer le cours',
      'Êtes-vous sûr de vouloir supprimer ce cours ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            let updated = { ...scheduleData };
            updated[editingDateKey] = (updated[editingDateKey] || []).filter(c => c !== editingItem);
            saveScheduleData(updated);
            setModalVisible(false);
            ToastAndroid.show('Cours supprimé', ToastAndroid.SHORT);
            Vibration.vibrate(40);
          }
        }
      ]
    );
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ViewSwitcher view={view} setView={setView} theme={theme} />
      
      {view === 'week' && (
        <SearchBar 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
          theme={theme} 
        />
      )}

      {view === 'month' ? (
        <MonthCalendar
          theme={theme}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          scheduleData={scheduleData}
        />
      ) : (
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
              searchQuery={searchQuery}
            />
          ) : (
            <EmptyState theme={theme} onAdd={openAddModal} />
          )}
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

      {/* Modal */}
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

              <ScrollView style={styles.modalForm}>
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

                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
                  <TypePicker
                    selectedType={form.type}
                    onSelect={type => setForm(f => ({ ...f, type }))}
                    theme={theme}
                  />
                </View>

                <View style={styles.timeRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                    <Text style={[styles.formLabel, { color: theme.text }]}>Début</Text>
                    <TimeDropdown
                      value={form.start}
                      onSelect={start => setForm(f => ({ ...f, start }))}
                      theme={theme}
                    />
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                    <Text style={[styles.formLabel, { color: theme.text }]}>Fin</Text>
                    <TimeDropdown
                      value={form.end}
                      onSelect={end => setForm(f => ({ ...f, end }))}
                      theme={theme}
                    />
                  </View>
                </View>

                <ColorPicker
                  selectedColor={form.color}
                  onSelect={color => setForm(f => ({ ...f, color }))}
                  theme={theme}
                />
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
                  >
                    <Text style={styles.saveButtonText}>
                      {editingItem ? "Sauvegarder" : "Ajouter"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
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

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },

  // Switcher
  switcherRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingHorizontal: 20,
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

  // Month calendar
  monthCalendar: { 
    borderRadius: 24, 
    margin: 14, 
    paddingBottom: 6, 
    paddingTop: 4,
    elevation: 4,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  monthTitle: { 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 19, 
    color: '#fff',
  },
  daysOfWeekRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 6 
  },
  dayOfWeek: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 12, 
    width: 30, 
    textAlign: 'center' 
  },
  weekRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  dayCell: {
    width: 30, 
    height: 32, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 8, 
    margin: 2,
    position: 'relative',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
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
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
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

  // Dropdowns
  dropdownContainer: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // Color picker
  colorPicker: {
    marginBottom: 20,
  },
  colorPickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
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