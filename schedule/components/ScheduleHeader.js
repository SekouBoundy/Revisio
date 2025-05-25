// schedule/components/ScheduleHeader.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../../constants/ThemeContext';

export default function ScheduleHeader({ isEditMode, onToggleEdit, onOpenCalendar, user }) {
  const { theme } = useContext(ThemeContext);
  const isDefLevel = user?.level === 'DEF';

  return (
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
            onPress={onToggleEdit}
          >
            <Ionicons 
              name={isEditMode ? "checkmark" : "pencil"} 
              size={18} 
              color={isEditMode ? theme.primary : '#FFFFFF'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.calendarButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
            onPress={onOpenCalendar}
          >
            <Ionicons name="calendar" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// schedule/components/DaySelector.js
import React, { useContext } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../../../constants/ThemeContext';

export default function DaySelector({ weekDates, selectedDayIndex, onSelectDay }) {
  const { theme } = useContext(ThemeContext);

  return (
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
            onPress={() => onSelectDay(index)}
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
}

// schedule/hooks/useScheduleData.js
import { useState, useMemo } from 'react';

export default function useScheduleData(isDefLevel, userLevel) {
  const getDefSchedule = () => ({
    // Your existing DEF schedule data
  });

  const getBacSchedule = () => ({
    // Your existing BAC schedule data
  });

  const [schedule, setSchedule] = useState(
    isDefLevel ? getDefSchedule() : getBacSchedule()
  );

  const updateSchedule = (dayIndex, classData, action = 'add') => {
    const newSchedule = { ...schedule };
    
    switch (action) {
      case 'add':
        if (!newSchedule[dayIndex]) newSchedule[dayIndex] = [];
        newSchedule[dayIndex].push(classData);
        newSchedule[dayIndex].sort((a, b) => a.time.localeCompare(b.time));
        break;
      case 'edit':
        newSchedule[dayIndex][classData.index] = classData;
        break;
      case 'delete':
        newSchedule[dayIndex].splice(classData.index, 1);
        break;
    }
    
    setSchedule(newSchedule);
  };

  return {
    schedule,
    updateSchedule
  };
}

// schedule/utils/dateUtils.js
export const getCurrentWeekDates = () => {
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

// Main ScheduleScreen becomes much cleaner:
// app/(tabs)/schedule.js
import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';
import ScheduleHeader from './schedule/components/ScheduleHeader';
import DaySelector from './schedule/components/DaySelector';
import ClassList from './schedule/components/ClassList';
import ExamList from './schedule/components/ExamList';
import useScheduleData from './schedule/hooks/useScheduleData';
import { getCurrentWeekDates } from './schedule/utils/dateUtils';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const isDefLevel = user?.level === 'DEF';
  
  const [weekDates] = useState(getCurrentWeekDates());
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { schedule, updateSchedule } = useScheduleData(isDefLevel, user?.level);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScheduleHeader 
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
        onOpenCalendar={() => console.log('Open calendar')}
        user={user}
      />
      
      <DaySelector
        weekDates={weekDates}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ClassList
          schedule={schedule[selectedDayIndex + 1] || []}
          isEditMode={isEditMode}
          onUpdateSchedule={updateSchedule}
          selectedDayIndex={selectedDayIndex}
        />
        
        <ExamList isDefLevel={isDefLevel} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});