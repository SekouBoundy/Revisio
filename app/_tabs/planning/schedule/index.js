// 📁 File: app/_tabs/planning/schedule/index.js

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// ✅ Custom fallback theme (you can replace with useTheme() later)
const theme = {
  text: '#000',
  background: '#fff',
  primary: '#3366FF',
  textSecondary: '#666',
  border: '#ddd',
  cardBackground: '#f9f9f9',
};

const isDarkMode = false;

// Color options for classes
const SUBJECT_COLORS = {
  'Mathématiques': '#3B82F6',
  'Physique-Chimie': '#EC4899',
  'Français': '#F59E0B',
  'Histoire-Géographie': '#8B5CF6',
  'Philosophie': '#10B981',
  'Langues': '#EF4444',
  'SVT': '#14B8A6',
  'Sciences Économiques': '#F97316',
  'Autre': '#6B7280'
};



export default function ScheduleScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [activeDay, setActiveDay] = useState(getCurrentDay());
  const [schedule, setSchedule] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [classForm, setClassForm] = useState({
    subject: '',
    room: '',
    teacher: '',
    color: '#3B82F6',
    notes: ''
  });
  
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = generateTimeSlots('8:00', '18:00', 60); // Hourly slots from 8 AM to 6 PM
  
  // Load saved schedule on component mount
  useEffect(() => {
    loadSchedule();
  }, []);
  
  function getCurrentDay() {
    const day = new Date().getDay();
    // Convert Sunday (0) through Saturday (6) to our format (Monday = 0, Saturday = 5)
    return day === 0 ? 5 : day - 1;
  }
  
  // Generate array of time slots
  function generateTimeSlots(start, end, intervalMinutes) {
    const slots = [];
    let current = parseTime(start);
    const endTime = parseTime(end);
    
    while (current < endTime) {
      slots.push(formatTime(current));
      current.setMinutes(current.getMinutes() + intervalMinutes);
    }
    
    return slots;
  }
  
  // Parse time string (e.g. "8:00") to Date object
  function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
  // Format Date as time string
  function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  
  // Load schedule data from storage
  async function loadSchedule() {
    try {
      const savedSchedule = await AsyncStorage.getItem('@timetable');
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
      Alert.alert('Error', 'Failed to load your schedule.');
    }
  }
  
  // Save schedule data to storage
  async function saveSchedule(newSchedule) {
    try {
      await AsyncStorage.setItem('@timetable', JSON.stringify(newSchedule));
    } catch (error) {
      console.error('Failed to save schedule:', error);
      Alert.alert('Error', 'Failed to save your schedule.');
    }
  }
  
  // Open modal to add/edit class
  function handleTimeSlotPress(day, time) {
    const slot = { day, time };
    setCurrentSlot(slot);
    
    // Check if there's already a class in this slot
    const existingClass = schedule[day]?.[time];
    if (existingClass) {
      setClassForm(existingClass);
    } else {
      setClassForm({
        subject: '',
        room: '',
        teacher: '',
        color: '#3B82F6',
        notes: ''
      });
    }
    
    setModalVisible(true);
  }
  
  // Save class data
  function handleSaveClass() {
    if (!classForm.subject) {
      Alert.alert('Error', 'Please enter a subject name.');
      return;
    }
    
    const { day, time } = currentSlot;
    const newSchedule = { ...schedule };
    
    if (!newSchedule[day]) {
      newSchedule[day] = {};
    }
    
    newSchedule[day][time] = classForm;
    
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
    setModalVisible(false);
  }
  
  // Delete class
  function handleDeleteClass() {
    const { day, time } = currentSlot;
    const newSchedule = { ...schedule };
    
    if (newSchedule[day] && newSchedule[day][time]) {
      delete newSchedule[day][time];
      
      // Clean up empty day objects
      if (Object.keys(newSchedule[day]).length === 0) {
        delete newSchedule[day];
      }
      
      setSchedule(newSchedule);
      saveSchedule(newSchedule);
    }
    
    setModalVisible(false);
  }
  
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Emploi du temps</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => {/* Implement share functionality */}}
        >
          <Ionicons name="share-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Day selector */}
      <View style={styles.daySelector}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorContent}
        >
          {weekdays.map((day, index) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                activeDay === index && { 
                  backgroundColor: theme.primary,
                  borderColor: theme.primary
                },
                { borderColor: theme.border }
              ]}
              onPress={() => setActiveDay(index)}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  { color: activeDay === index ? '#FFFFFF' : theme.text }
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Timetable */}
      <ScrollView style={styles.timetableContainer}>
        {timeSlots.map((time) => {
          const classInfo = schedule[weekdays[activeDay]]?.[time];
          
          return (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                { borderColor: theme.border },
                classInfo && { backgroundColor: classInfo.color + '20' }
              ]}
              onPress={() => handleTimeSlotPress(weekdays[activeDay], time)}
            >
              <View style={styles.timeColumn}>
                <Text style={[styles.timeText, { color: theme.textSecondary }]}>{time}</Text>
              </View>
              
              <View style={styles.classColumn}>
                {classInfo ? (
                  <View style={styles.classInfo}>
                    <View style={[styles.classColorIndicator, { backgroundColor: classInfo.color }]} />
                    <View style={styles.classDetails}>
                      <Text style={[styles.classSubject, { color: theme.text }]}>
                        {classInfo.subject}
                      </Text>
                      {classInfo.room && (
                        <Text style={[styles.classLocation, { color: theme.textSecondary }]}>
                          Salle {classInfo.room}
                        </Text>
                      )}
                      {classInfo.teacher && (
                        <Text style={[styles.classTeacher, { color: theme.textSecondary }]}>
                          {classInfo.teacher}
                        </Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={[styles.emptySlotText, { color: theme.textSecondary }]}>
                      Disponible
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {/* Add/Edit Class Modal */}
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
                {classForm.subject ? 'Modifier le cours' : 'Ajouter un cours'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Matière</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={classForm.subject}
                onChangeText={(text) => setClassForm({...classForm, subject: text})}
                placeholder="Nom de la matière"
                placeholderTextColor={theme.textSecondary + '80'}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Salle</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={classForm.room}
                  onChangeText={(text) => setClassForm({...classForm, room: text})}
                  placeholder="Numéro de salle"
                  placeholderTextColor={theme.textSecondary + '80'}
                />
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.inputLabel, { color: theme.text }]}>Professeur</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={classForm.teacher}
                  onChangeText={(text) => setClassForm({...classForm, teacher: text})}
                  placeholder="Nom du professeur"
                  placeholderTextColor={theme.textSecondary + '80'}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Couleur</Text>
              <View style={styles.colorSelector}>
                {Object.values(SUBJECT_COLORS).map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      classForm.color === color && styles.selectedColorOption
                    ]}
                    onPress={() => setClassForm({...classForm, color: color})}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Notes</Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: theme.cardBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                value={classForm.notes}
                onChangeText={(text) => setClassForm({...classForm, notes: text})}
                placeholder="Notes supplémentaires"
                placeholderTextColor={theme.textSecondary + '80'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalActions}>
              {classForm.subject && (
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleDeleteClass}
                >
                  <Text style={styles.deleteButtonText}>Supprimer</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveClass}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  shareButton: {
    padding: 4,
  },
  daySelector: {
    marginVertical: 12,
  },
  daySelectorContent: {
    paddingHorizontal: 12,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  dayButtonText: {
    fontWeight: '500',
  },
  timetableContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  timeColumn: {
    width: 60,
    marginRight: 12,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  classColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classColorIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  classDetails: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  classLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  classTeacher: {
    fontSize: 14,
  },
  emptySlot: {
    justifyContent: 'center',
    height: 50,
  },
  emptySlotText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
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
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    marginBottom: 12,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
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
  }
});