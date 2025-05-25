// app/(tabs)/schedule.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const isDefLevel = user?.level === 'DEF';

  const getDefSchedule = () => ({
    1: [
      { time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Cours', color: theme.primary },
      { time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: theme.secondary },
      { time: '10:15-11:15', subject: 'Histoire-Géo', teacher: 'M. Bernard', room: 'Salle 15', type: 'Cours', color: theme.accent },
      { time: '11:15-12:15', subject: 'Anglais', teacher: 'Mme Smith', room: 'Salle 20', type: 'Cours', color: theme.info },
      { time: '14:00-15:00', subject: 'Sciences SVT', teacher: 'M. Laurent', room: 'Lab 1', type: 'TP', color: theme.success },
      { time: '15:00-16:00', subject: 'Physique-Chimie', teacher: 'Mme Durand', room: 'Lab 2', type: 'TP', color: theme.warning }
    ],
    2: [
      { time: '08:00-09:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: theme.secondary },
      { time: '09:00-10:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Exercices', color: theme.primary },
      { time: '10:15-11:15', subject: 'Éducation Civique', teacher: 'M. Moreau', room: 'Salle 18', type: 'Cours', color: theme.info },
      { time: '11:15-12:15', subject: 'Langue Arabe', teacher: 'M. Ahmed', room: 'Salle 25', type: 'Cours', color: theme.accent }
    ]
  });

  const getBacSchedule = () => ({
    1: [
      { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Amphi A', type: 'Cours', color: theme.primary },
      { time: '10:15-12:15', subject: 'Physique', teacher: 'Dr. Rousseau', room: 'Lab Physique', type: 'TP', color: theme.warning },
      { time: '14:00-16:00', subject: 'Chimie', teacher: 'Prof. Blanc', room: 'Lab Chimie', type: 'TP', color: theme.accent },
      { time: '16:15-17:15', subject: 'Philosophie', teacher: 'Prof. Mercier', room: 'Salle 101', type: 'Cours', color: theme.secondary }
    ],
    2: [
      { time: '08:00-10:00', subject: 'Informatique', teacher: 'M. Garcia', room: 'Salle Info', type: 'TP', color: theme.info },
      { time: '10:15-12:15', subject: 'Sciences SVT', teacher: 'Dr. Petit', room: 'Lab Bio', type: 'TP', color: theme.success },
      { time: '14:00-15:00', subject: 'Français', teacher: 'Prof. Roux', room: 'Salle 205', type: 'Cours', color: theme.secondary },
      { time: '15:15-16:15', subject: 'Anglais', teacher: 'Mrs. Johnson', room: 'Salle 210', type: 'Oral', color: theme.primary }
    ]
  });

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const weekDates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push({
        day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][i],
        date: date.getDate(),
        fullDate: new Date(date),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    return weekDates;
  };

  const [weekDates] = useState(getCurrentWeekDates());
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date();
    const currentDay = today.getDay();
    return currentDay === 0 ? 5 : currentDay - 1;
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [schedule, setSchedule] = useState(isDefLevel ? getDefSchedule() : getBacSchedule());

  const [classForm, setClassForm] = useState({
    time: '',
    subject: '',
    teacher: '',
    room: '',
    type: 'Cours',
    color: theme.primary
  });

  const resetForm = () => {
    setClassForm({
      time: '',
      subject: '',
      teacher: '',
      room: '',
      type: 'Cours',
      color: theme.primary
    });
  };

  const handleEditClass = (classItem, index) => {
    setEditingClass({ ...classItem, index });
    setClassForm(classItem);
    setShowEditModal(true);
  };

  const handleAddClass = () => {
    resetForm();
    setEditingClass(null);
    setShowEditModal(true);
  };

  const handleSaveClass = () => {
    if (!classForm.time || !classForm.subject) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const newSchedule = { ...schedule };
    if (editingClass) {
      newSchedule[selectedDayIndex + 1][editingClass.index] = classForm;
    } else {
      if (!newSchedule[selectedDayIndex + 1]) {
        newSchedule[selectedDayIndex + 1] = [];
      }
      newSchedule[selectedDayIndex + 1].push(classForm);
      newSchedule[selectedDayIndex + 1].sort((a, b) => a.time.localeCompare(b.time));
    }
    
    setSchedule(newSchedule);
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteClass = (index) => {
    Alert.alert(
      'Supprimer le cours',
      'Êtes-vous sûr de vouloir supprimer ce cours ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            const newSchedule = { ...schedule };
            newSchedule[selectedDayIndex + 1].splice(index, 1);
            setSchedule(newSchedule);
          }
        }
      ]
    );
  };

  const ModernCard = ({ children, style = {} }) => (
    <View style={[styles.modernCard, { backgroundColor: theme.surface }, style]}>
      {children}
    </View>
  );

  const Header = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Mon Planning DEF' : `Planning ${user?.level}`}
          </Text>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Emploi du Temps
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.editButton, { 
              backgroundColor: isEditMode ? '#FFFFFF' : 'rgba(255, 255, 255, 0.15)'
            }]}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Ionicons 
              name={isEditMode ? "checkmark" : "pencil"} 
              size={18} 
              color={isEditMode ? theme.primary : '#FFFFFF'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.calendarButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={() => setShowCalendar(true)}
          >
            <Ionicons name="calendar" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const ClassCard = ({ time, subject, teacher, room, type, color, index }) => (
    <ModernCard style={styles.classCard}>
      <View style={styles.classHeader}>
        <View style={[styles.classIndicator, { backgroundColor: color }]} />
        <View style={styles.classContent}>
          <View style={styles.classTop}>
            <Text style={[styles.subjectText, { color: theme.text }]}>{subject}</Text>
            <Text style={[styles.timeText, { color: theme.textSecondary }]}>{time}</Text>
          </View>
          <Text style={[styles.teacherText, { color: theme.textSecondary }]}>{teacher}</Text>
          <View style={styles.classBottom}>
            <Text style={[styles.roomText, { color: theme.textSecondary }]}>{room}</Text>
            <View style={[styles.typeBadge, { backgroundColor: color + '15' }]}>
              <Text style={[styles.typeText, { color }]}>{type}</Text>
            </View>
          </View>
        </View>
        
        {isEditMode && (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
              onPress={() => handleEditClass({ time, subject, teacher, room, type, color }, index)}
            >
              <Ionicons name="pencil" size={16} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.error + '15' }]}
              onPress={() => handleDeleteClass(index)}
            >
              <Ionicons name="trash" size={16} color={theme.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ModernCard>
  );

  const ExamCard = ({ date, subject, type, color }) => (
    <ModernCard style={styles.examCard}>
      <View style={styles.examHeader}>
        <View style={[styles.examIndicator, { backgroundColor: color }]} />
        <View style={styles.examContent}>
          <Text style={[styles.examSubject, { color: theme.text }]}>{subject}</Text>
          <Text style={[styles.examType, { color: color }]}>{type}</Text>
        </View>
        <Text style={[styles.examDate, { color: theme.textSecondary }]}>{date}</Text>
      </View>
    </ModernCard>
  );

  const getUpcomingExams = () => {
    if (isDefLevel) {
      return [
        { date: 'Demain', subject: 'Contrôle de Maths', type: 'Contrôle', color: theme.primary },
        { date: 'Vendredi', subject: 'Quiz Sciences', type: 'Quiz', color: theme.success },
        { date: 'Lundi prochain', subject: 'Dictée Français', type: 'Évaluation', color: theme.secondary }
      ];
    } else {
      return [
        { date: '25 Mai', subject: 'Dissertation Philosophie', type: 'Examen', color: theme.secondary },
        { date: '27 Mai', subject: 'Mathématiques', type: 'Examen Blanc', color: theme.primary },
        { date: '30 Mai', subject: 'Physique-Chimie', type: 'TP Évalué', color: theme.warning }
      ];
    }
  };

  const CalendarModal = () => {
    const [calendarDate, setCalendarDate] = useState(new Date());
    
    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    const navigateMonth = (direction) => {
      const newDate = new Date(calendarDate);
      newDate.setMonth(calendarDate.getMonth() + direction);
      setCalendarDate(newDate);
    };
    
    const selectDate = (date) => {
      if (date) {
        setSelectedDate(date);
        const dayOfWeek = date.getDay();
        const newDayIndex = dayOfWeek === 0 ? 5 : dayOfWeek - 1;
        setSelectedDayIndex(newDayIndex);
        setShowCalendar(false);
      }
    };

    return (
      <Modal visible={showCalendar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.calendarHeader, { borderBottomColor: theme.neutralLight }]}>
              <TouchableOpacity 
                onPress={() => navigateMonth(-1)}
                style={[styles.calendarNavButton, { backgroundColor: theme.neutralLight }]}
              >
                <Ionicons name="chevron-back" size={20} color={theme.text} />
              </TouchableOpacity>
              
              <Text style={[styles.calendarTitle, { color: theme.text }]}>
                {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
              </Text>
              
              <TouchableOpacity 
                onPress={() => navigateMonth(1)}
                style={[styles.calendarNavButton, { backgroundColor: theme.neutralLight }]}
              >
                <Ionicons name="chevron-forward" size={20} color={theme.text} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowCalendar(false)}
                style={[styles.closeButton, { backgroundColor: theme.neutralLight }]}
              >
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarBody}>
              <View style={styles.dayNamesRow}>
                {dayNames.map((dayName) => (
                  <Text key={dayName} style={[styles.dayName, { color: theme.textSecondary }]}>
                    {dayName}
                  </Text>
                ))}
              </View>
              
              <View style={styles.datesGrid}>
                {getDaysInMonth(calendarDate).map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCell,
                      date && date.toDateString() === selectedDate.toDateString() && {
                        backgroundColor: theme.primary
                      },
                      date && date.toDateString() === new Date().toDateString() && {
                        borderColor: theme.primary,
                        borderWidth: 2
                      }
                    ]}
                    onPress={() => selectDate(date)}
                    disabled={!date}
                  >
                    {date && (
                      <Text style={[
                        styles.dateText,
                        {
                          color: date.toDateString() === selectedDate.toDateString() 
                            ? '#FFFFFF' 
                            : theme.text
                        }
                      ]}>
                        {date.getDate()}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const EditModal = () => (
    <Modal visible={showEditModal} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {editingClass ? 'Modifier le cours' : 'Ajouter un cours'}
            </Text>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: theme.neutralLight }]}
              onPress={() => setShowEditModal(false)}
            >
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Horaire *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.neutralLight }]}
                placeholder="08:00-09:00"
                placeholderTextColor={theme.textSecondary}
                value={classForm.time}
                onChangeText={(text) => setClassForm({...classForm, time: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Matière *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.neutralLight }]}
                placeholder="Mathématiques"
                placeholderTextColor={theme.textSecondary}
                value={classForm.subject}
                onChangeText={(text) => setClassForm({...classForm, subject: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Professeur</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.neutralLight }]}
                placeholder="M. Dupont"
                placeholderTextColor={theme.textSecondary}
                value={classForm.teacher}
                onChangeText={(text) => setClassForm({...classForm, teacher: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Salle</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.neutralLight }]}
                placeholder="Salle 12"
                placeholderTextColor={theme.textSecondary}
                value={classForm.room}
                onChangeText={(text) => setClassForm({...classForm, room: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Type</Text>
              <View style={styles.typeButtons}>
                {['Cours', 'TP', 'TD', 'Examen', 'Contrôle'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { 
                        backgroundColor: classForm.type === type ? theme.primary : theme.surface,
                        borderColor: classForm.type === type ? theme.primary : theme.neutralLight
                      }
                    ]}
                    onPress={() => setClassForm({...classForm, type})}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      { color: classForm.type === type ? '#fff' : theme.text }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: theme.surface, borderColor: theme.neutralLight }]}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.text }]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSaveClass}
            >
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const scheduleData = schedule;
  const currentDaySchedule = scheduleData[selectedDayIndex + 1] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header />
      <DaySelector />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Cours du {weekDates[selectedDayIndex]?.day} {weekDates[selectedDayIndex]?.date}
            </Text>
            {isEditMode && (
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: theme.primary }]}
                onPress={handleAddClass}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          
          {currentDaySchedule.length > 0 ? (
            currentDaySchedule.map((classItem, index) => (
              <ClassCard
                key={index}
                index={index}
                time={classItem.time}
                subject={classItem.subject}
                teacher={classItem.teacher}
                room={classItem.room}
                type={classItem.type}
                color={classItem.color}
              />
            ))
          ) : (
            <ModernCard style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.neutralLight }]}>
                <Ionicons name="calendar-outline" size={32} color={theme.textSecondary} />
              </View>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aucun cours prévu
              </Text>
              {isEditMode && (
                <TouchableOpacity 
                  style={[styles.addClassButton, { backgroundColor: theme.primary }]}
                  onPress={handleAddClass}
                >
                  <Text style={styles.addClassButtonText}>Ajouter un cours</Text>
                </TouchableOpacity>
              )}
            </ModernCard>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isDefLevel ? 'Prochains contrôles' : 'Examens à venir'}
          </Text>
          {getUpcomingExams().map((exam, index) => (
            <ExamCard
              key={index}
              date={exam.date}
              subject={exam.subject}
              type={exam.type}
              color={exam.color}
            />
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <CalendarModal />
      <EditModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daySelector: {
    marginTop: -15,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
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
    fontSize: 22,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  classCard: {
    padding: 16,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  classIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginRight: 16,
  },
  classContent: {
    flex: 1,
  },
  classTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  teacherText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  classBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomText: {
    fontSize: 13,
    fontWeight: '500',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  examCard: {
    padding: 16,
  },
  examHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
  },
  examContent: {
    flex: 1,
  },
  examSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  examType: {
    fontSize: 14,
    fontWeight: '500',
  },
  examDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  addClassButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addClassButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContent: {
    margin: 20,
    borderRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  calendarNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  calendarBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dateCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 20,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});