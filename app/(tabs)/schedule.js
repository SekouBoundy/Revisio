// app/(tabs)/schedule.js - COMPLETE ENHANCED VERSION
import React, { useContext, useState, useCallback } from 'react';
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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const router = useRouter();
  const isDefLevel = user?.level === 'DEF';
  
  // Date and week management
  const getCurrentWeekDates = () => {
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
  };

  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekDates, setWeekDates] = useState(getCurrentWeekDates());
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 0 : today - 1;
  });
  
  // UI States
  const [isEditMode, setIsEditMode] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedView, setSelectedView] = useState('day'); // 'day' or 'week'
  const [quickAddPosition, setQuickAddPosition] = useState({ day: 0, time: '08:00' });
  
  // Ultra-simplified form state - just essentials
  const [quickForm, setQuickForm] = useState({
    subject: '',
    startTime: '08:00',
    endTime: '09:00',
    type: 'Cours'
  });

  // Dynamic schedule data based on current week
  const getScheduleForWeek = useCallback((weekOffset) => {
    // Base schedule template
    const baseSchedule = {
      1: [ // Lundi
        { 
          id: `${weekOffset}-1-1`,
          time: '08:00-09:00', 
          subject: 'Mathématiques', 
          teacher: '', 
          room: '', 
          type: 'Cours', 
          color: '#2196F3',
          description: 'Géométrie - Les triangles',
        },
        { 
          id: `${weekOffset}-1-2`,
          time: '09:00-10:00', 
          subject: 'Français', 
          teacher: '', 
          room: '', 
          type: 'Cours', 
          color: '#FF9800',
          description: 'Analyse de texte',
        },
        { 
          id: `${weekOffset}-1-3`,
          time: '14:00-15:00', 
          subject: 'Sciences de la Vie et de la Terre', 
          teacher: '', 
          room: '', 
          type: 'TP', 
          color: '#4CAF50',
          description: 'Observation cellulaire',
        }
      ],
      2: [ // Mardi
        { 
          id: `${weekOffset}-2-1`,
          time: '08:00-09:00', 
          subject: 'Informatique', 
          teacher: '', 
          room: '', 
          type: 'TP', 
          color: '#607D8B',
          description: 'Programmation',
        },
        { 
          id: `${weekOffset}-2-2`,
          time: '14:00-15:00', 
          subject: 'Français', 
          teacher: '', 
          room: '', 
          type: 'Cours', 
          color: '#FF9800',
          description: 'Expression écrite',
        }
      ],
      3: [ // Mercredi
        { 
          id: `${weekOffset}-3-1`,
          time: '08:00-09:00', 
          subject: 'Mathématiques', 
          teacher: '', 
          room: '', 
          type: weekOffset === 0 ? 'Contrôle' : 'Cours', // Only current week has exam
          color: '#2196F3',
          description: weekOffset === 0 ? 'Contrôle - Géométrie' : 'Exercices - Géométrie',
          isExam: weekOffset === 0
        }
      ],
      4: [ // Jeudi
        { 
          id: `${weekOffset}-4-1`,
          time: '08:00-09:00', 
          subject: 'Physique-Chimie', 
          teacher: '', 
          room: '', 
          type: 'Cours', 
          color: '#E91E63',
          description: 'Les états de la matière',
        }
      ],
      5: [ // Vendredi - Different content per week
        ...(weekOffset === 0 ? [
          { 
            id: `${weekOffset}-5-1`,
            time: '08:00-09:00', 
            subject: 'Anglais', 
            teacher: '', 
            room: '', 
            type: 'Test', 
            color: '#607D8B',
            description: 'Test - Present Perfect',
            isExam: true
          }
        ] : weekOffset === 1 ? [
          { 
            id: `${weekOffset}-5-1`,
            time: '08:00-09:00', 
            subject: 'Histoire-Géographie', 
            teacher: '', 
            room: '', 
            type: 'Cours', 
            color: '#9C27B0',
            description: 'La Renaissance',
          },
          { 
            id: `${weekOffset}-5-2`,
            time: '14:00-15:00', 
            subject: 'Mathématiques', 
            teacher: '', 
            room: '', 
            type: 'Révisions', 
            color: '#2196F3',
            description: 'Révisions générales',
          }
        ] : [
          { 
            id: `${weekOffset}-5-1`,
            time: '10:00-11:00', 
            subject: 'Français', 
            teacher: '', 
            room: '', 
            type: 'Cours', 
            color: '#FF9800',
            description: 'Littérature française',
          }
        ])
      ],
      6: [] // Samedi
    };

    return baseSchedule;
  }, []);

  const [scheduleData, setScheduleData] = useState(() => getScheduleForWeek(0));

  // Time slots for grid view
  const timeSlots = [
    '08:00', '09:00', '10:00', '10:15', '11:15', '12:15', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  // Common subjects for quick selection
  const commonSubjects = isDefLevel ? [
    'Mathématiques', 'Français', 'Anglais', 'Histoire-Géographie', 
    'Physique-Chimie', 'Sciences de la Vie et de la Terre', 'Informatique'
  ] : [
    'Mathématiques', 'Physique', 'Chimie', 'Informatique', 
    'Français', 'Philosophie', 'Anglais'
  ];

  // Get current week date range
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

  // Navigation functions
  const navigateWeek = (direction) => {
    const newWeek = currentWeek + direction;
    setCurrentWeek(newWeek);
    
    // Update schedule data for the new week
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

  // Subject color mapping
  const getSubjectColor = (subject) => {
    const colorMap = {
      'Mathématiques': '#2196F3',
      'Français': '#FF9800',
      'Anglais': '#607D8B',
      'Histoire-Géographie': '#9C27B0',
      'Physique-Chimie': '#E91E63',
      'Physique': '#E91E63',
      'Chimie': '#9C27B0',
      'Sciences de la Vie et de la Terre': '#4CAF50',
      'Informatique': '#607D8B',
      'Philosophie': '#795548',
      'Éducation Civique et Morale': '#795548',
      'Langue Arabe': '#FF5722',
      'Activités Sportives': '#FF5722'
    };
    return colorMap[subject] || '#757575';
  };

  // Quick add functions
  const openQuickAdd = (dayIndex = selectedDayIndex, timeSlot = '08:00') => {
    setQuickAddPosition({ day: dayIndex, time: timeSlot });
    setQuickForm({
      subject: '',
      startTime: timeSlot,
      endTime: getNextTimeSlot(timeSlot),
      type: 'Cours'
    });
    setShowQuickAdd(true);
  };

  const getNextTimeSlot = (currentTime) => {
    const currentIndex = timeSlots.indexOf(currentTime);
    return timeSlots[currentIndex + 1] || '17:00';
  };

  // Ultra-simplified save function
  const saveQuickClass = () => {
    if (!quickForm.subject.trim()) {
      Alert.alert('Erreur', 'Veuillez choisir une matière');
      return;
    }

    const newClass = {
      id: `${currentWeek}-${quickAddPosition.day + 1}-${Date.now()}`,
      time: `${quickForm.startTime}-${quickForm.endTime}`,
      subject: quickForm.subject,
      teacher: '', // No teacher needed
      room: '', // No room needed
      type: quickForm.type,
      color: getSubjectColor(quickForm.subject),
      description: `${quickForm.type} - ${quickForm.subject}`,
      isExam: quickForm.type === 'Contrôle' || quickForm.type === 'Test' || quickForm.type === 'Examen'
    };

    const dayKey = quickAddPosition.day + 1;
    const updatedSchedule = { ...scheduleData };

    if (!updatedSchedule[dayKey]) {
      updatedSchedule[dayKey] = [];
    }
    
    updatedSchedule[dayKey].push(newClass);
    // Sort by time
    updatedSchedule[dayKey].sort((a, b) => {
      const timeA = a.time.split('-')[0];
      const timeB = b.time.split('-')[0];
      return timeA.localeCompare(timeB);
    });

    setScheduleData(updatedSchedule);
    setShowQuickAdd(false);
    
    Alert.alert('Succès', 'Cours ajouté avec succès');
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
            // Find which day this class belongs to
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
    return dayClasses.some(classItem => classItem.isExam);
  };

  // Get class for specific time and day (for grid view)
  const getClassForTimeAndDay = (timeSlot, dayIndex) => {
    const dayKey = dayIndex + 1;
    const dayClasses = scheduleData[dayKey] || [];
    return dayClasses.find(classItem => {
      const [startTime] = classItem.time.split('-');
      return startTime === timeSlot;
    });
  };

  // ENHANCED HEADER COMPONENT
  const ScheduleHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerSubtitle, { color: '#FFFFFF99' }]}>
            {isDefLevel ? 'Mon Planning DEF' : `Planning ${user?.level}`}
          </Text>
          
          {/* Enhanced Week Navigation in Title Area */}
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
          
          {/* Current Week Status */}
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
                  {Object.values(scheduleData).flat().filter(c => c.isExam).length} examens
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Action Buttons - Reduced to 2 */}
        <View style={styles.headerActions}>
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

  // Week Grid View
  const WeekGridView = () => (
    <View style={styles.gridContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with days */}
        <View style={styles.gridHeader}>
          <View style={styles.timeColumn}>
            <Text style={[styles.gridHeaderText, { color: theme.textSecondary }]}>Heure</Text>
          </View>
          {weekDates.map((dayInfo, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={[styles.gridHeaderText, { color: theme.text }]}>{dayInfo.day}</Text>
              <Text style={[styles.gridHeaderDate, { color: theme.textSecondary }]}>{dayInfo.date}</Text>
            </View>
          ))}
        </View>

        {/* Time slots with classes */}
        {timeSlots.map((timeSlot, timeIndex) => (
          <View key={timeSlot} style={styles.gridRow}>
            <View style={styles.timeColumn}>
              <Text style={[styles.timeSlotText, { color: theme.textSecondary }]}>{timeSlot}</Text>
            </View>
            {weekDates.map((dayInfo, dayIndex) => {
              const classItem = getClassForTimeAndDay(timeSlot, dayIndex);
              return (
                <TouchableOpacity
                  key={`${timeSlot}-${dayIndex}`}
                  style={[
                    styles.gridCell,
                    { backgroundColor: classItem ? classItem.color + '20' : theme.surface }
                  ]}
                  onPress={() => {
                    if (classItem) {
                      if (isEditMode) {
                        deleteClass(classItem);
                      } else {
                        Alert.alert(
                          classItem.subject,
                          `${classItem.description}\n${classItem.time}`,
                          [
                            { text: 'OK' },
                            ...(isEditMode ? [{ 
                              text: 'Supprimer', 
                              style: 'destructive',
                              onPress: () => deleteClass(classItem) 
                            }] : [])
                          ]
                        );
                      }
                    } else if (isEditMode) {
                      openQuickAdd(dayIndex, timeSlot);
                    }
                  }}
                >
                  {classItem ? (
                    <View style={styles.gridClassContent}>
                      <Text style={[styles.gridSubject, { color: classItem.color }]} numberOfLines={1}>
                        {classItem.subject}
                      </Text>
                      <Text style={[styles.gridType, { color: theme.textSecondary }]} numberOfLines={1}>
                        {classItem.type}
                      </Text>
                      {classItem.isExam && (
                        <View style={[styles.examBadge, { backgroundColor: theme.error }]}>
                          <Ionicons name="alert-circle" size={10} color="#fff" />
                        </View>
                      )}
                      {isEditMode && (
                        <TouchableOpacity
                          style={[styles.deleteButton, { backgroundColor: theme.error }]}
                          onPress={() => deleteClass(classItem)}
                        >
                          <Ionicons name="close" size={12} color="#fff" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : isEditMode ? (
                    <View style={styles.addClassCell}>
                      <Ionicons name="add" size={16} color={theme.textSecondary} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Simplified Class Card Component - no teacher/room
  const ClassCard = ({ classItem, index }) => {
    const isUpcoming = () => {
      const now = new Date();
      const [hour, minute] = classItem.time.split('-')[0].split(':').map(Number);
      const classTime = new Date();
      classTime.setHours(hour, minute, 0, 0);
      return classTime > now && weekDates[selectedDayIndex].isToday;
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
          Alert.alert(
            classItem.subject,
            `${classItem.description}`,
            [{ text: 'OK' }]
          );
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
                backgroundColor: classItem.isExam ? theme.error + '20' : classItem.color + '20'
              }]}>
                <Text style={[styles.classTypeText, { 
                  color: classItem.isExam ? theme.error : classItem.color,
                  fontWeight: classItem.isExam ? 'bold' : '600'
                }]}>
                  {classItem.type}
                </Text>
                {classItem.isExam && (
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
        </View>

        {isEditMode && (
          <TouchableOpacity 
            style={[styles.deleteClassButton, { backgroundColor: theme.error + '20' }]}
            onPress={() => deleteClass(classItem)}
          >
            <Ionicons name="trash" size={16} color={theme.error} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  // ULTRA-CLEAN Quick Add Modal - Course, Time, Type only
  const QuickAddModal = () => {
    const hours = Array.from({ length: 10 }, (_, i) => {
      const hour = 8 + i;
      return `${hour.toString().padStart(2, '0')}:00`;
    });

    const updateEndTime = (startTime) => {
      const [hour] = startTime.split(':');
      const nextHour = parseInt(hour) + 1;
      return `${nextHour.toString().padStart(2, '0')}:00`;
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

          <View style={styles.modalContent}>
            {/* Horizontal Course Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.horizontalScroll}>
                  {commonSubjects.map(subject => (
                    <TouchableOpacity
                      key={subject}
                      style={[
                        styles.courseChip,
                        { 
                          backgroundColor: quickForm.subject === subject ? theme.primary : theme.surface,
                          borderColor: quickForm.subject === subject ? theme.primary : theme.neutralLight
                        }
                      ]}
                      onPress={() => setQuickForm(prev => ({...prev, subject}))}
                    >
                      <Text style={[
                        styles.courseChipText,
                        { color: quickForm.subject === subject ? '#fff' : theme.text }
                      ]}>
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Time Picker - Fixed Horizontal Layout */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Heure</Text>
              <View style={[styles.timePickerRow, { backgroundColor: theme.surface }]}>
                {/* Start Time */}
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>DÉBUT</Text>
                  <View style={[styles.timeSelector, { backgroundColor: theme.background, borderColor: theme.neutralLight }]}>
                    <Text style={[styles.timeSelectorText, { color: theme.text }]}>{quickForm.startTime}</Text>
                  </View>
                  
                  {/* Static Time Options */}
                  <View style={styles.timeOptions}>
                    {hours.map(hour => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.timeOptionItem,
                          { 
                            backgroundColor: quickForm.startTime === hour ? theme.primary + '20' : 'transparent',
                          }
                        ]}
                        onPress={() => {
                          const endTime = updateEndTime(hour);
                          setQuickForm(prev => ({
                            ...prev, 
                            startTime: hour,
                            endTime: endTime
                          }));
                        }}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          { 
                            color: quickForm.startTime === hour ? theme.primary : theme.text,
                            fontWeight: quickForm.startTime === hour ? 'bold' : 'normal'
                          }
                        ]}>
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Arrow */}
                <View style={styles.timeArrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color={theme.textSecondary} />
                </View>

                {/* End Time */}
                <View style={styles.timePickerColumn}>
                  <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>FIN</Text>
                  <View style={[styles.timeDisplay, { backgroundColor: theme.background, borderColor: theme.neutralLight }]}>
                    <Text style={[styles.timeDisplayText, { color: theme.text }]}>
                      {quickForm.endTime}
                    </Text>
                  </View>
                  <View style={styles.timeEndPlaceholder} />
                </View>
              </View>
            </View>

            {/* Type Selection - Better Visual Hierarchy */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
              <View style={styles.typeGrid}>
                {[
                  { type: 'Cours', icon: 'book-outline', color: theme.primary },
                  { type: 'TP', icon: 'flask-outline', color: theme.accent },
                  { type: 'Contrôle', icon: 'alert-circle-outline', color: theme.warning },
                  { type: 'Test', icon: 'checkmark-circle-outline', color: theme.info },
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
                    onPress={() => setQuickForm(prev => ({...prev, type}))}
                  >
                    <Ionicons 
                      name={icon} 
                      size={16} 
                      color={quickForm.type === type ? '#fff' : color} 
                      style={{ marginRight: 6 }} 
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

            {/* Preview */}
            {quickForm.subject && (
              <View style={[styles.previewCard, { backgroundColor: theme.primary + '10' }]}>
                <Text style={[styles.previewTitle, { color: theme.primary }]}>Aperçu :</Text>
                <Text style={[styles.previewText, { color: theme.text }]}>
                  {quickForm.subject} • {quickForm.type}
                </Text>
                <Text style={[styles.previewTime, { color: theme.textSecondary }]}>
                  {quickForm.startTime} - {quickForm.endTime}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.modalFooter}>
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
                  backgroundColor: quickForm.subject ? theme.primary : theme.neutralLight,
                  opacity: quickForm.subject ? 1 : 0.5
                }
              ]}
              onPress={saveQuickClass}
              disabled={!quickForm.subject}
            >
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

  const todaysClasses = getCurrentDayClasses();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScheduleHeader />
      
      {selectedView === 'day' ? (
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
      ) : (
        <WeekGridView />
      )}

      {/* Quick Add Modal */}
      <QuickAddModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ENHANCED HEADER STYLES
  header: {
    paddingTop: 60,
    paddingBottom: 35, // Slightly larger for complex navigation
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed to flex-start for better alignment
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
  
  // Enhanced Week Navigation
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
  
  // Week Status
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
  
  // Action Buttons (consistent with other screens)
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    marginTop: 4, // Slight offset to align with title
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Enhanced Day Selector (overlapping style)
  daySelector: {
    marginTop: -20, // Increased overlap
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 16, // Increased padding
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
    borderRadius: 14, // Slightly larger radius
    minWidth: 64, // Consistent width
    position: 'relative',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600', // Bolder
    marginBottom: 6,
  },
  dateText: {
    fontSize: 18, // Larger date
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
  
  // Grid View Styles
  gridContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  gridHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 10,
  },
  timeColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  gridHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridHeaderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  timeSlotText: {
    fontSize: 12,
    fontWeight: '500',
  },
  gridCell: {
    flex: 1,
    minHeight: 60,
    marginHorizontal: 1,
    borderRadius: 6,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  gridClassContent: {
    flex: 1,
    justifyContent: 'center',
  },
  gridSubject: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gridType: {
    fontSize: 9,
    fontWeight: '500',
  },
  examBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addClassCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },

  // Day View Styles
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
    marginTop: 4,
  },
  classDetailText: {
    fontSize: 12,
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
  
  // SIMPLIFIED Modal Styles
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
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 32,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  // Horizontal course selection
  horizontalScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  courseChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Time picker - horizontal layout
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderRadius: 16,
    padding: 20,
  },
  timePickerColumn: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  timeSelector: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  timeSelectorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeOptions: {
    maxHeight: 150,
    borderRadius: 8,
  },
  timeOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 1,
  },
  timeOptionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  timeArrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    width: 40,
  },
  timeDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeDisplayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeEndPlaceholder: {
    height: 150,
  },
  timeDisplayText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Type selection
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Preview section
  previewCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewTime: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});