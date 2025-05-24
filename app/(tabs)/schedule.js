// app/(tabs)/schedule.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../constants/ThemeContext';
import { useUser } from '../../constants/UserContext';

export default function ScheduleScreen() {
  const { theme } = useContext(ThemeContext);
  const { user } = useUser();
  const [selectedDay, setSelectedDay] = useState(1); // Monday = 1

  const isDefLevel = user?.level === 'DEF';

  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dates = [21, 22, 23, 24, 25, 26];

  const ClassItem = ({ time, subject, teacher, room, type, color }) => (
    <View style={[styles.classItem, { backgroundColor: theme.surface }]}>
      <View style={[styles.timeIndicator, { backgroundColor: color }]} />
      <View style={styles.classContent}>
        <View style={styles.classHeader}>
          <Text style={[styles.subjectText, { color: theme.text }]}>{subject}</Text>
          <Text style={[styles.timeText, { color: theme.text + '80' }]}>{time}</Text>
        </View>
        <Text style={[styles.teacherText, { color: theme.text + '60' }]}>{teacher}</Text>
        <View style={styles.classDetails}>
          <Text style={[styles.roomText, { color: theme.text + '60' }]}>{room}</Text>
          <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.typeText, { color }]}>{type}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const ExamItem = ({ date, subject, type, color }) => (
    <View style={styles.examItem}>
      <View style={[styles.examIndicator, { backgroundColor: color }]} />
      <View style={styles.examContent}>
        <Text style={[styles.examSubject, { color: theme.text }]}>{subject}</Text>
        <Text style={[styles.examType, { color: color }]}>{type}</Text>
        <Text style={[styles.examDate, { color: theme.text + '60' }]}>{date}</Text>
      </View>
    </View>
  );

  const getDefSchedule = () => ({
    1: [ // Monday
      { time: '08:00-09:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Cours', color: '#2196F3' },
      { time: '09:00-10:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
      { time: '10:15-11:15', subject: 'Histoire-Géo', teacher: 'M. Bernard', room: 'Salle 15', type: 'Cours', color: '#9C27B0' },
      { time: '11:15-12:15', subject: 'Anglais', teacher: 'Mme Smith', room: 'Salle 20', type: 'Cours', color: '#607D8B' },
      { time: '14:00-15:00', subject: 'Sciences SVT', teacher: 'M. Laurent', room: 'Lab 1', type: 'TP', color: '#4CAF50' },
      { time: '15:00-16:00', subject: 'Physique-Chimie', teacher: 'Mme Durand', room: 'Lab 2', type: 'TP', color: '#E91E63' }
    ],
    2: [ // Tuesday
      { time: '08:00-09:00', subject: 'Français', teacher: 'Mme Martin', room: 'Salle 8', type: 'Cours', color: '#FF9800' },
      { time: '09:00-10:00', subject: 'Mathématiques', teacher: 'M. Dubois', room: 'Salle 12', type: 'Exercices', color: '#2196F3' },
      { time: '10:15-11:15', subject: 'Éducation Civique', teacher: 'M. Moreau', room: 'Salle 18', type: 'Cours', color: '#795548' },
      { time: '11:15-12:15', subject: 'Langue Arabe', teacher: 'M. Ahmed', room: 'Salle 25', type: 'Cours', color: '#FF5722' }
    ]
  });

  const getBacSchedule = () => ({
    1: [ // Monday  
      { time: '08:00-10:00', subject: 'Mathématiques', teacher: 'Prof. Leroy', room: 'Amphi A', type: 'Cours', color: '#2196F3' },
      { time: '10:15-12:15', subject: 'Physique', teacher: 'Dr. Rousseau', room: 'Lab Physique', type: 'TP', color: '#E91E63' },
      { time: '14:00-16:00', subject: 'Chimie', teacher: 'Prof. Blanc', room: 'Lab Chimie', type: 'TP', color: '#9C27B0' },
      { time: '16:15-17:15', subject: 'Philosophie', teacher: 'Prof. Mercier', room: 'Salle 101', type: 'Cours', color: '#795548' }
    ],
    2: [ // Tuesday
      { time: '08:00-10:00', subject: 'Informatique', teacher: 'M. Garcia', room: 'Salle Info', type: 'TP', color: '#607D8B' },
      { time: '10:15-12:15', subject: 'Sciences SVT', teacher: 'Dr. Petit', room: 'Lab Bio', type: 'TP', color: '#4CAF50' },
      { time: '14:00-15:00', subject: 'Français', teacher: 'Prof. Roux', room: 'Salle 205', type: 'Cours', color: '#FF9800' },
      { time: '15:15-16:15', subject: 'Anglais', teacher: 'Mrs. Johnson', room: 'Salle 210', type: 'Oral', color: '#3F51B5' }
    ]
  });

  const getUpcomingExams = () => {
    if (isDefLevel) {
      return [
        { date: 'Demain', subject: 'Contrôle de Maths', type: 'Contrôle', color: '#2196F3' },
        { date: 'Vendredi', subject: 'Quiz Sciences', type: 'Quiz', color: '#4CAF50' },
        { date: 'Lundi prochain', subject: 'Dictée Français', type: 'Évaluation', color: '#FF9800' }
      ];
    } else {
      return [
        { date: '25 Mai', subject: 'Dissertation Philosophie', type: 'Examen', color: '#795548' },
        { date: '27 Mai', subject: 'Mathématiques', type: 'Examen Blanc', color: '#2196F3' },
        { date: '30 Mai', subject: 'Physique-Chimie', type: 'TP Évalué', color: '#E91E63' }
      ];
    }
  };

  const scheduleData = isDefLevel ? getDefSchedule() : getBacSchedule();
  const currentDaySchedule = scheduleData[selectedDay] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Planning</Text>
        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Week Navigation */}
      <View style={styles.weekContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                selectedDay === index + 1 && { backgroundColor: theme.primary }
              ]}
              onPress={() => setSelectedDay(index + 1)}
            >
              <Text style={[
                styles.dayText,
                { color: selectedDay === index + 1 ? '#fff' : theme.text + '80' }
              ]}>
                {day}
              </Text>
              <Text style={[
                styles.dateText,
                { color: selectedDay === index + 1 ? '#fff' : theme.text }
              ]}>
                {dates[index]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Today's Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Cours du {days[selectedDay - 1]}
          </Text>
          {currentDaySchedule.length > 0 ? (
            currentDaySchedule.map((classItem, index) => (
              <ClassItem
                key={index}
                time={classItem.time}
                subject={classItem.subject}
                teacher={classItem.teacher}
                room={classItem.room}
                type={classItem.type}
                color={classItem.color}
              />
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
              <Ionicons name="calendar-outline" size={48} color={theme.text + '40'} />
              <Text style={[styles.emptyText, { color: theme.text + '60' }]}>
                Aucun cours prévu
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming Exams */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {isDefLevel ? 'Prochains contrôles' : 'Examens à venir'}
          </Text>
          {getUpcomingExams().map((exam, index) => (
            <ExamItem
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarButton: {
    padding: 8,
  },
  weekContainer: {
    paddingVertical: 10,
    paddingLeft: 20,
  },
  dayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 12,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  classItem: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  timeIndicator: {
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
    marginBottom: 4,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  teacherText: {
    fontSize: 14,
    marginBottom: 8,
  },
  classDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomText: {
    fontSize: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  examItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  examIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  examContent: {
    flex: 1,
  },
  examSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  examType: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  examDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  bottomPadding: {
    height: 40,
  },
});