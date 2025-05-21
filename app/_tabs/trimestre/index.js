// app/_tabs/trimestre/index.js
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../constants/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function TrimestreTrackerScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [trimesters, setTrimesters] = useState([
    { id: 1, name: '1er Trimestre', start: '2024-09-01', end: '2024-11-30', grades: {}, events: [] },
    { id: 2, name: '2e Trimestre', start: '2024-12-01', end: '2025-02-28', grades: {}, events: [] },
    { id: 3, name: '3e Trimestre', start: '2025-03-01', end: '2025-06-15', grades: {}, events: [] }
  ]);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [currentTrimestre, setCurrentTrimestre] = useState(null);
  const [eventForm, setEventForm] = useState({
    id: '',
    title: '',
    date: new Date(),
    type: 'exam', // exam, assignment, meeting
    subject: '',
    notes: ''
  });
  const [gradeForm, setGradeForm] = useState({
    subject: '',
    grade: '',
    coefficient: '1',
    notes: ''
  });
  
  // Subject options with colors (same as in StudyPlanner)
  const SUBJECTS = [
    { id: 'math', name: 'Mathématiques', color: '#3B82F6' },
    { id: 'phys', name: 'Physique-Chimie', color: '#EC4899' },
    { id: 'fran', name: 'Français', color: '#F59E0B' },
    { id: 'hist', name: 'Histoire-Géo', color: '#8B5CF6' },
    { id: 'phil', name: 'Philosophie', color: '#10B981' },
    { id: 'lang', name: 'Langues', color: '#EF4444' },
    { id: 'svt', name: 'SVT', color: '#14B8A6' },
    { id: 'eco', name: 'Sciences Économiques', color: '#F97316' },
    { id: 'other', name: 'Autre', color: '#6B7280' }
  ];
  
  // Load data on component mount
  useEffect(() => {
    loadTrimestreData();
  }, []);
  
  // Load trimestre data from storage
  async function loadTrimestreData() {
    try {
      const savedData = await AsyncStorage.getItem('@trimesters');
      if (savedData) {
        setTrimesters(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Failed to load trimestre data:', error);
    }
  }
  
  // Save trimestre data to storage
  async function saveTrimestreData(data) {
    try {
      await AsyncStorage.setItem('@trimesters', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save trimestre data:', error);
    }
  }
  
  // Determine the current trimester
  function getCurrentTrimester() {
    const now = new Date();
    const current = trimesters.find(
      t => now >= new Date(t.start) && now <= new Date(t.end)
    );
    return current || trimesters[0]; // Default to first trimester if none match
  }
  
  // Calculate days remaining in trimester
  function getDaysRemaining(trimester) {
    const now = new Date();
    const end = new Date(trimester.end);
    
    // If the trimester is already over, return 0
    if (now > end) return 0;
    
    const diffTime = Math.abs(end - now);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Calculate progress percentage for trimester
  function calculateTrimesterProgress(trimester) {
    const now = new Date();
    const start = new Date(trimester.start);
    const end = new Date(trimester.end);
    
    // If the trimester hasn't started yet, return 0%
    if (now < start) return 0;
    
    // If the trimester is already over, return 100%
    if (now > end) return 100;
    
    // Calculate progress percentage
    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalDuration) * 100);
  }
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  
  // Get upcoming events
  function getUpcomingEvents() {
    const now = new Date();
    const allEvents = trimesters.flatMap(
      trimester => trimester.events.map(event => ({ ...event, trimester: trimester.id }))
    );
    
    return allEvents
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Only take the next 5 events
  }
  
  // Open add event modal
  function handleAddEvent(trimesterId) {
    const trimester = trimesters.find(t => t.id === trimesterId);
    if (!trimester) return;
    
    setCurrentTrimestre(trimester);
    setEventForm({
      id: '',
      title: '',
      date: new Date(),
      type: 'exam',
      subject: SUBJECTS[0].id,
      notes: ''
    });
    setEventModalVisible(true);
  }
  
  // Save event
  function handleSaveEvent() {
    if (!eventForm.title) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour l\'événement.');
      return;
    }
    
    const updatedTrimesters = [...trimesters];
    const trimesterIndex = updatedTrimesters.findIndex(t => t.id === currentTrimestre.id);
    
    if (trimesterIndex === -1) {
      setEventModalVisible(false);
      return;
    }
    
    const newEvent = {
      ...eventForm,
      id: eventForm.id || Date.now().toString(),
      date: new Date(eventForm.date).toISOString()
    };
    
    if (eventForm.id) {
      // Update existing event
      const eventIndex = updatedTrimesters[trimesterIndex].events.findIndex(e => e.id === eventForm.id);
      if (eventIndex !== -1) {
        updatedTrimesters[trimesterIndex].events[eventIndex] = newEvent;
      }
    } else {
      // Add new event
      updatedTrimesters[trimesterIndex].events.push(newEvent);
    }
    
    setTrimesters(updatedTrimesters);
    saveTrimestreData(updatedTrimesters);
    setEventModalVisible(false);
  }
  
  // Open add grade modal
  function handleAddGrade(trimesterId) {
    const trimester = trimesters.find(t => t.id === trimesterId);
    if (!trimester) return;
    
    setCurrentTrimestre(trimester);
    setGradeForm({
      subject: SUBJECTS[0].id,
      grade: '',
      coefficient: '1',
      notes: ''
    });
    setGradeModalVisible(true);
  }
  
  // Save grade
  function handleSaveGrade() {
    if (!gradeForm.grade) {
      Alert.alert('Erreur', 'Veuillez entrer une note.');
      return;
    }
    
    const grade = parseFloat(gradeForm.grade.replace(',', '.'));
    const coefficient = parseFloat(gradeForm.coefficient.replace(',', '.'));
    
    if (isNaN(grade) || grade < 0 || grade > 20) {
      Alert.alert('Erreur', 'La note doit être un nombre entre 0 et 20.');
      return;
    }
    
    if (isNaN(coefficient) || coefficient <= 0) {
      Alert.alert('Erreur', 'Le coefficient doit être un nombre positif.');
      return;
    }
    
    const updatedTrimesters = [...trimesters];
    const trimesterIndex = updatedTrimesters.findIndex(t => t.id === currentTrimestre.id);
    
    if (trimesterIndex === -1) {
      setGradeModalVisible(false);
      return;
    }
    
    // Get existing grades for this subject
    const subjectGrades = updatedTrimesters[trimesterIndex].grades[gradeForm.subject] || [];
    
    // Add new grade
    subjectGrades.push({
      id: Date.now().toString(),
      value: grade,
      coefficient: coefficient,
      notes: gradeForm.notes,
      date: new Date().toISOString()
    });
    
    // Update the grades object
    updatedTrimesters[trimesterIndex].grades = {
      ...updatedTrimesters[trimesterIndex].grades,
      [gradeForm.subject]: subjectGrades
    };
    
    setTrimesters(updatedTrimesters);
    saveTrimestreData(updatedTrimesters);
    setGradeModalVisible(false);
  }
  
  // Calculate average grade for a subject in a trimester
  function calculateSubjectAverage(trimester, subjectId) {
    const grades = trimester.grades[subjectId] || [];
    if (grades.length === 0) return null;
    
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;
    
    grades.forEach(grade => {
      totalWeightedGrade += grade.value * grade.coefficient;
      totalCoefficient += grade.coefficient;
    });
    
    return totalCoefficient > 0 ? totalWeightedGrade / totalCoefficient : null;
  }
  
  // Calculate overall average for a trimester
  function calculateOverallAverage(trimester) {
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;
    
    Object.keys(trimester.grades).forEach(subjectId => {
      const grades = trimester.grades[subjectId] || [];
      
      grades.forEach(grade => {
        totalWeightedGrade += grade.value * grade.coefficient;
        totalCoefficient += grade.coefficient;
      });
    });
    
    return totalCoefficient > 0 ? totalWeightedGrade / totalCoefficient : null;
  }
  
  // Get color based on grade
  function getGradeColor(grade) {
    if (grade === null) return '#6B7280';
    if (grade >= 16) return '#10B981'; // Green - Very good
    if (grade >= 14) return '#3B82F6'; // Blue - Good
    if (grade >= 12) return '#8B5CF6'; // Purple - Satisfactory
    if (grade >= 10) return '#F59E0B'; // Orange - Average
    return '#EF4444'; // Red - Below average
  }
  
  // Get subject info
  function getSubjectInfo(subjectId) {
    return SUBJECTS.find(s => s.id === subjectId) || { 
      name: 'Inconnu', 
      color: '#6B7280' 
    };
  }
  
  // Get icon based on event type
  function getEventIcon(type) {
    switch (type) {
      case 'exam':
        return 'document-text-outline';
      case 'assignment':
        return 'create-outline';
      case 'meeting':
        return 'people-outline';
      default:
        return 'calendar-outline';
    }
  }
  
  const currentTrimester = getCurrentTrimester();
  const upcomingEvents = getUpcomingEvents();
  
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Suivi des trimestres</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Trimester Progress */}
        <View style={[styles.currentTrimesterCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.currentTrimesterTitle, { color: theme.text }]}>
            {currentTrimester.name}
          </Text>
          
          <View style={styles.trimesterDates}>
            <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
              Du {formatDate(currentTrimester.start)} au {formatDate(currentTrimester.end)}
            </Text>
          </View>
          
          <View style={styles.daysRemainingContainer}>
            <Text style={[styles.daysRemaining, { color: theme.primary }]}>
              {getDaysRemaining(currentTrimester)} jours restants
            </Text>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.progressLabelContainer}>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
                Progression du trimestre
              </Text>
              <Text style={[styles.progressPercentage, { color: theme.primary }]}>
                {calculateTrimesterProgress(currentTrimester)}%
              </Text>
            </View>
            
            <View style={[styles.progressBarContainer, { backgroundColor: isDarkMode ? '#333' : '#E5E7EB' }]}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${calculateTrimesterProgress(currentTrimester)}%`,
                    backgroundColor: theme.primary
                  }
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => handleAddEvent(currentTrimester.id)}
            >
              <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Ajouter un événement</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => handleAddGrade(currentTrimester.id)}
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Ajouter une note</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Upcoming Events */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Événements à venir
          </Text>
          
          {upcomingEvents.length > 0 ? (
            <View style={styles.eventsContainer}>
              {upcomingEvents.map(event => {
                const subject = getSubjectInfo(event.subject);
                
                return (
                  <View 
                    key={event.id}
                    style={[styles.eventCard, { backgroundColor: theme.cardBackground }]}
                  >
                    <View style={[styles.eventIconContainer, { backgroundColor: subject.color + '20' }]}>
                      <Ionicons name={getEventIcon(event.type)} size={24} color={subject.color} />
                    </View>
                    
                    <View style={styles.eventContent}>
                      <Text style={[styles.eventTitle, { color: theme.text }]}>
                        {event.title}
                      </Text>
                      
                      <View style={styles.eventDetails}>
                        <Text style={[styles.eventSubject, { color: subject.color }]}>
                          {subject.name}
                        </Text>
                        <Text style={[styles.eventDate, { color: theme.textSecondary }]}>
                          {formatDate(event.date)}
                        </Text>
                      </View>
                      
                      {event.notes && (
                        <Text style={[styles.eventNotes, { color: theme.textSecondary }]}>
                          {event.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyContainer, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Aucun événement à venir
              </Text>
            </View>
          )}
        </View>
        
        {/* Trimester Performance */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Performance par trimestre
          </Text>
          
          {trimesters.map(trimester => {
            const overallAverage = calculateOverallAverage(trimester);
            const hasGrades = overallAverage !== null;
            const now = new Date();
            const start = new Date(trimester.start);
            const end = new Date(trimester.end);
            const isCurrent = now >= start && now <= end;
            const isPast = now > end;
            const isFuture = now < start;
            
            return (
              <View 
                key={trimester.id}
                style={[
                  styles.trimesterCard, 
                  { 
                    backgroundColor: theme.cardBackground,
                    borderColor: isCurrent ? theme.primary : 'transparent',
                    borderWidth: isCurrent ? 2 : 0,
                  }
                ]}
              >
                <View style={styles.trimesterHeader}>
                  <Text style={[styles.trimesterName, { color: theme.text }]}>
                    {trimester.name}
                  </Text>
                  
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: theme.primary }]}>
                      <Text style={styles.currentBadgeText}>En cours</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.trimesterDates}>
                  <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>
                    {formatDate(trimester.start)} - {formatDate(trimester.end)}
                  </Text>
                </View>
                
                {hasGrades ? (
                  <View style={styles.gradesContainer}>
                    <View style={styles.overallGrade}>
                      <Text style={[styles.averageLabel, { color: theme.textSecondary }]}>
                        Moyenne générale
                      </Text>
                      <Text 
                        style={[
                          styles.averageValue, 
                          { color: getGradeColor(overallAverage) }
                        ]}
                      >
                        {overallAverage.toFixed(2).replace('.', ',')}
                      </Text>
                    </View>
                    
                    <View style={styles.subjectGrades}>
                      {Object.keys(trimester.grades).map(subjectId => {
                        const subject = getSubjectInfo(subjectId);
                        const average = calculateSubjectAverage(trimester, subjectId);
                        
                        if (average === null) return null;
                        
                        return (
                          <View key={subjectId} style={styles.subjectGradeItem}>
                                <View style={styles.subjectInfo}>
                              <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                              <Text style={[styles.subjectName, { color: theme.text }]}>
                                {subject.name}
                              </Text>
                            </View>
                            
                            <Text 
                              style={[
                                styles.subjectAverage, 
                                { color: getGradeColor(average) }
                              ]}
                            >
                              {average.toFixed(2).replace('.', ',')}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ) : isPast ? (
                  <View style={styles.noGradesContainer}>
                    <Text style={[styles.noGradesText, { color: theme.textSecondary }]}>
                      Aucune note enregistrée pour ce trimestre
                    </Text>
                  </View>
                ) : (
                  <View style={styles.upcomingContainer}>
                    <Text style={[styles.upcomingText, { color: theme.textSecondary }]}>
                      {isFuture ? 'Ce trimestre n\'a pas encore commencé' : 'Enregistrez vos notes pour ce trimestre'}
                    </Text>
                    
                    {isCurrent && (
                      <TouchableOpacity 
                        style={[styles.addGradeButton, { backgroundColor: theme.primary }]}
                        onPress={() => handleAddGrade(trimester.id)}
                      >
                        <Text style={styles.addGradeButtonText}>Ajouter une note</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                
                {/* Event count indicator */}
                {trimester.events.length > 0 && (
                  <View style={styles.eventsIndicator}>
                    <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
                    <Text style={[styles.eventsCount, { color: theme.textSecondary }]}>
                      {trimester.events.length} événement{trimester.events.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* BAC Exam Countdown */}
        <View style={[styles.bacCountdownCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.bacCountdownContent}>
            <Text style={[styles.bacCountdownTitle, { color: theme.text }]}>
              Examen du BAC
            </Text>
            
            <View style={styles.examDateContainer}>
              <Text style={[styles.examDateLabel, { color: theme.textSecondary }]}>
                Date de l'examen:
              </Text>
              <Text style={[styles.examDate, { color: theme.text }]}>
                15 juin 2025
              </Text>
            </View>
            
            <View style={styles.daysUntilContainer}>
              <Text style={[styles.daysUntilLabel, { color: theme.textSecondary }]}>
                Jours restants:
              </Text>
              <Text style={[styles.daysUntil, { color: theme.primary }]}>
                {(() => {
                  const now = new Date();
                  const examDate = new Date(2025, 5, 15); // June 15, 2025
                  const diffTime = Math.abs(examDate - now);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays;
                })()}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.examPrepButton, { backgroundColor: theme.primary + '20' }]}
              onPress={() => router.push('/_tabs/bac-prep')}
            >
              <Text style={[styles.examPrepButtonText, { color: theme.primary }]}>
                Consulter le guide de préparation
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.bacCountdownImageContainer}>
            <View style={[styles.bacImageBackground, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="school-outline" size={48} color={theme.primary} />
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Add Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => setEventModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Ajouter un événement
              </Text>
              <TouchableOpacity onPress={() => setEventModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Titre</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={eventForm.title}
                  onChangeText={(text) => setEventForm({...eventForm, title: text})}
                  placeholder="Titre de l'événement"
                  placeholderTextColor={theme.textSecondary + '80'}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Date</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={formatDate(eventForm.date)}
                  onChangeText={() => {}} // Read-only field, will be handled by date picker
                  placeholder="Date de l'événement"
                  placeholderTextColor={theme.textSecondary + '80'}
                  editable={false}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Type</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      eventForm.type === 'exam' && [
                        styles.selectedTypeOption,
                        { borderColor: theme.primary }
                      ],
                      { borderColor: theme.border }
                    ]}
                    onPress={() => setEventForm({...eventForm, type: 'exam'})}
                  >
                    <Ionicons 
                      name="document-text-outline" 
                      size={20} 
                      color={eventForm.type === 'exam' ? theme.primary : theme.textSecondary} 
                    />
                    <Text 
                      style={[
                        styles.typeOptionText,
                        { 
                          color: eventForm.type === 'exam' ? theme.primary : theme.text 
                        }
                      ]}
                    >
                      Examen
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      eventForm.type === 'assignment' && [
                        styles.selectedTypeOption,
                        { borderColor: theme.primary }
                      ],
                      { borderColor: theme.border }
                    ]}
                    onPress={() => setEventForm({...eventForm, type: 'assignment'})}
                  >
                    <Ionicons 
                      name="create-outline" 
                      size={20} 
                      color={eventForm.type === 'assignment' ? theme.primary : theme.textSecondary} 
                    />
                    <Text 
                      style={[
                        styles.typeOptionText,
                        { 
                          color: eventForm.type === 'assignment' ? theme.primary : theme.text 
                        }
                      ]}
                    >
                      Devoir
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      eventForm.type === 'meeting' && [
                        styles.selectedTypeOption,
                        { borderColor: theme.primary }
                      ],
                      { borderColor: theme.border }
                    ]}
                    onPress={() => setEventForm({...eventForm, type: 'meeting'})}
                  >
                    <Ionicons 
                      name="people-outline" 
                      size={20} 
                      color={eventForm.type === 'meeting' ? theme.primary : theme.textSecondary} 
                    />
                    <Text 
                      style={[
                        styles.typeOptionText,
                        { 
                          color: eventForm.type === 'meeting' ? theme.primary : theme.text 
                        }
                      ]}
                    >
                      Réunion
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subjectSelector}
                >
                  {SUBJECTS.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectOption,
                        eventForm.subject === subject.id && { 
                          backgroundColor: subject.color + '30',
                          borderColor: subject.color
                        },
                        { borderColor: theme.border }
                      ]}
                      onPress={() => setEventForm({...eventForm, subject: subject.id})}
                    >
                      <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                      <Text 
                        style={[
                          styles.subjectOptionText,
                          { color: theme.text }
                        ]}
                      >
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Notes</Text>
                <TextInput
                  style={[
                    styles.formTextarea,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={eventForm.notes}
                  onChangeText={(text) => setEventForm({...eventForm, notes: text})}
                  placeholder="Notes supplémentaires"
                  placeholderTextColor={theme.textSecondary + '80'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => setEventModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveEvent}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add Grade Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={gradeModalVisible}
        onRequestClose={() => setGradeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Ajouter une note
              </Text>
              <TouchableOpacity onPress={() => setGradeModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Matière</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.subjectSelector}
                >
                  {SUBJECTS.map(subject => (
                    <TouchableOpacity
                      key={subject.id}
                      style={[
                        styles.subjectOption,
                        gradeForm.subject === subject.id && { 
                          backgroundColor: subject.color + '30',
                          borderColor: subject.color
                        },
                        { borderColor: theme.border }
                      ]}
                      onPress={() => setGradeForm({...gradeForm, subject: subject.id})}
                    >
                      <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                      <Text 
                        style={[
                          styles.subjectOptionText,
                          { color: theme.text }
                        ]}
                      >
                        {subject.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>Note (/20)</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      { 
                        backgroundColor: theme.cardBackground,
                        color: theme.text,
                        borderColor: theme.border
                      }
                    ]}
                    value={gradeForm.grade}
                    onChangeText={(text) => setGradeForm({...gradeForm, grade: text})}
                    placeholder="Ex: 15,5"
                    placeholderTextColor={theme.textSecondary + '80'}
                    keyboardType="decimal-pad"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>Coefficient</Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      { 
                        backgroundColor: theme.cardBackground,
                        color: theme.text,
                        borderColor: theme.border
                      }
                    ]}
                    value={gradeForm.coefficient}
                    onChangeText={(text) => setGradeForm({...gradeForm, coefficient: text})}
                    placeholder="Ex: 2"
                    placeholderTextColor={theme.textSecondary + '80'}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.text }]}>Notes</Text>
                <TextInput
                  style={[
                    styles.formTextarea,
                    { 
                      backgroundColor: theme.cardBackground,
                      color: theme.text,
                      borderColor: theme.border
                    }
                  ]}
                  value={gradeForm.notes}
                  onChangeText={(text) => setGradeForm({...gradeForm, notes: text})}
                  placeholder="Ex: Interrogation écrite, chapitre 3"
                  placeholderTextColor={theme.textSecondary + '80'}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => setGradeModalVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveGrade}
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
  placeholder: {
    width: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  
  // Current trimester card
  currentTrimesterCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  currentTrimesterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trimesterDates: {
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 14,
  },
  daysRemainingContainer: {
    marginBottom: 16,
  },
  daysRemaining: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  
  // Events section
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventsContainer: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventSubject: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDate: {
    fontSize: 14,
  },
  eventNotes: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Trimester performance
  trimesterCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  trimesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trimesterName: {
    fontSize: 18,
    fontWeight: '600',
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  gradesContainer: {
    marginTop: 12,
  },
  overallGrade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  averageLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  averageValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subjectGrades: {
    marginTop: 8,
  },
  subjectGradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subjectName: {
    fontSize: 14,
  },
  subjectAverage: {
    fontSize: 16,
    fontWeight: '600',
  },
  noGradesContainer: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  noGradesText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  upcomingContainer: {
    marginTop: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  upcomingText: {
    fontSize: 14,
    marginBottom: 12,
  },
  addGradeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addGradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eventsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  eventsCount: {
    fontSize: 14,
    marginLeft: 6,
  },
  
  // BAC Countdown
  bacCountdownCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  bacCountdownContent: {
    flex: 1,
  },
  bacCountdownTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  examDateContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  examDateLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  examDate: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysUntilContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  daysUntilLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  daysUntil: {
    fontSize: 14,
    fontWeight: '600',
  },
  examPrepButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  examPrepButtonText: {
    fontWeight: '500',
  },
  bacCountdownImageContainer: {
    marginLeft: 16,
  },
  bacImageBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Modal styling
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
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
  modalForm: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  selectedTypeOption: {
    borderWidth: 2,
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  subjectSelector: {
    paddingVertical: 8,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  subjectOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
  },
  cancelButtonText: {
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