// app/(tabs)/schedule.js - QUICK FIX VERSION
import React, { useContext, useState } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const isDefLevel = user?.level === 'DEF';
  
  // INLINE DATE FUNCTION - No import needed!
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  // SIMPLE SCHEDULE DATA - Inline
  const getScheduleData = () => {
    if (isDefLevel) {
      return {
        1: [
          { time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Cours', color: '#2196F3' },
          { time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
          { time: '10:15-11:15', subject: 'Histoire-Géographie', teacher: 'M. Bernard', room: 'Salle 15', type: 'Cours', color: '#9C27B0' }
        ],
        2: [
          { time: '08:00-09:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
          { time: '09:00-10:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Exercices', color: '#2196F3' }
        ]
      };
    } else {
      return {
        1: [
          { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Amphi A', type: 'Cours', color: '#2196F3' },
          { time: '10:15-12:15', subject: 'Physique', teacher: 'Dr. Rousseau', room: 'Lab Physique', type: 'TP', color: '#E91E63' }
        ],
        2: [
          { time: '08:00-10:00', subject: 'Chimie', teacher: 'Prof. Blanc', room: 'Lab Chimie', type: 'TP', color: '#9C27B0' }
        ]
      };
    }
  };

  const scheduleData = getScheduleData();

  // INLINE HEADER COMPONENT
  const ScheduleHeader = () => (
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
            onPress={() => console.log('Open calendar')}
          >
            <Ionicons name="calendar" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // INLINE DAY SELECTOR COMPONENT
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

  // CLASS CARD COMPONENT
  const ClassCard = ({ classItem }) => (
    <View style={[styles.classCard, { backgroundColor: theme.surface }]}>
      <View style={[styles.classColorBar, { backgroundColor: classItem.color }]} />
      
      <View style={styles.classContent}>
        <View style={styles.classHeader}>
          <Text style={[styles.classSubject, { color: theme.text }]}>
            {classItem.subject}
          </Text>
          <Text style={[styles.classType, { 
            color: classItem.color,
            backgroundColor: classItem.color + '20'
          }]}>
            {classItem.type}
          </Text>
        </View>
        
        <Text style={[styles.classTime, { color: theme.textSecondary }]}>
          {classItem.time}
        </Text>
        
        <View style={styles.classDetails}>
          <View style={styles.classDetailItem}>
            <Ionicons name="person-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.classDetailText, { color: theme.textSecondary }]}>
              {classItem.teacher}
            </Text>
          </View>
          <View style={styles.classDetailItem}>
            <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
            <Text style={[styles.classDetailText, { color: theme.textSecondary }]}>
              {classItem.room}
            </Text>
          </View>
        </View>
      </View>

      {isEditMode && (
        <TouchableOpacity 
          style={[styles.editButtonClass, { backgroundColor: theme.error + '20' }]}
          onPress={() => console.log('Edit class')}
        >
          <Ionicons name="pencil" size={16} color={theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );

  const todaysClasses = scheduleData[selectedDayIndex + 1] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScheduleHeader />
      <DaySelector />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Today's Classes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Classes du jour
          </Text>
          
          {todaysClasses.length > 0 ? (
            todaysClasses.map((classItem, index) => (
              <ClassCard key={index} classItem={classItem} />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Aucun cours prévu ce jour
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Cette semaine
          </Text>
          
          <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.success }]}>3</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TP</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.warning }]}>2</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Examens</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
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
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    minWidth: 60,
    position: 'relative',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  classType: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textAlign: 'center',
    minWidth: 50,
  },
  classTime: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  classDetails: {
    gap: 4,
  },
  classDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classDetailText: {
    fontSize: 12,
  },
  editButtonClass: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 12,
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  bottomPadding: {
    height: 40,
  },
});