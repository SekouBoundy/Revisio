// components/schedule/ScheduleHeader.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../../constants/ThemeContext';

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

const styles = StyleSheet.create({
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
});