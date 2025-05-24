// app/edit-profile.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../constants/ThemeContext';
import { useUser } from '../constants/UserContext';

export default function EditProfileScreen() {
  const { theme } = useContext(ThemeContext);
  const { user, updateUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    school: user?.school || '',
    phone: user?.phone || '',
    level: user?.level || 'DEF',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showBacOptions, setShowBacOptions] = useState(
    user?.level && user.level !== 'DEF'
  );

  const bacSpecializations = [
    { value: 'TSE', label: 'Sciences Exactes (TSE)' },
    { value: 'TSEXP', label: 'Sciences Expérimentales (TSEXP)' },
    { value: 'TSECO', label: 'Sciences Économiques (TSECO)' },
    { value: 'TSS', label: 'Sciences Sociales (TSS)' },
    { value: 'TAL', label: 'Arts et Lettres (TAL)' },
    { value: 'TLL', label: 'Langues et Lettres (TLL)' },
    { value: 'STI', label: 'Sciences et Technologies Industrielles (STI)' },
    { value: 'STG', label: 'Sciences et Technologies de Gestion (STG)' },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.back();
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Changer la photo',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: () => console.log('Camera') },
        { text: 'Galerie', onPress: () => console.log('Gallery') },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      updateUser(formData);
      setIsLoading(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  const handleLevelChange = (value) => {
    if (value === 'BAC') {
      setShowBacOptions(true);
    } else if (value === 'DEF') {
      setShowBacOptions(false);
      handleChange('level', 'DEF');
    } else {
      handleChange('level', value);
    }
  };

  const LevelPicker = () => {
    const currentLevelIsBac = formData.level !== 'DEF';
    
    return (
      <View style={styles.levelPickerContainer}>
        <View style={styles.mainLevelContainer}>
          <TouchableOpacity
            style={[
              styles.mainLevelOption,
              { 
                backgroundColor: formData.level === 'DEF' ? theme.primary : theme.surface,
                borderColor: formData.level === 'DEF' ? theme.primary : theme.text + '20'
              }
            ]}
            onPress={() => handleLevelChange('DEF')}
          >
            <Text style={[
              styles.mainLevelText,
              { color: formData.level === 'DEF' ? '#fff' : theme.text }
            ]}>
              DEF
            </Text>
            <Text style={[
              styles.mainLevelSubtext,
              { color: formData.level === 'DEF' ? '#fff' : theme.text + '80' }
            ]}>
              Secondaire
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.mainLevelOption,
              { 
                backgroundColor: currentLevelIsBac ? theme.primary : theme.surface,
                borderColor: currentLevelIsBac ? theme.primary : theme.text + '20'
              }
            ]}
            onPress={() => handleLevelChange('BAC')}
          >
            <Text style={[
              styles.mainLevelText,
              { color: currentLevelIsBac ? '#fff' : theme.text }
            ]}>
              BAC
            </Text>
            <Text style={[
              styles.mainLevelSubtext,
              { color: currentLevelIsBac ? '#fff' : theme.text + '80' }
            ]}>
              Baccalauréat
            </Text>
          </TouchableOpacity>
        </View>

        {(showBacOptions || currentLevelIsBac) && (
          <View style={styles.bacOptionsContainer}>
            <Text style={[styles.bacOptionsTitle, { color: theme.text }]}>
              Choisissez votre spécialisation :
            </Text>
            <View style={styles.bacOptionsGrid}>
              {bacSpecializations.map((spec) => (
                <TouchableOpacity
                  key={spec.value}
                  style={[
                    styles.bacOption,
                    { 
                      backgroundColor: formData.level === spec.value ? theme.primary : theme.surface,
                      borderColor: formData.level === spec.value ? theme.primary : theme.text + '20'
                    }
                  ]}
                  onPress={() => handleLevelChange(spec.value)}
                >
                  <Text style={[
                    styles.bacOptionText,
                    { color: formData.level === spec.value ? '#fff' : theme.text }
                  ]}>
                    {spec.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: 'Modifier le profil',
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.headerButton}
              disabled={isLoading}
            >
              <Text style={[styles.saveButton, { color: theme.primary }]}>
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>
                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <Text style={[styles.changePhotoText, { color: theme.primary }]}>
                Changer la photo
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Nom complet *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: theme.text + '20'
                }]}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Entrez votre nom complet"
                placeholderTextColor={theme.text + '60'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.text + '10', 
                  color: theme.text + '60',
                  borderColor: theme.text + '20'
                }]}
                value={user?.email || 'user@example.com'}
                placeholder="Email non modifiable"
                placeholderTextColor={theme.text + '40'}
                editable={false}
              />
              <Text style={[styles.helpText, { color: theme.text + '60' }]}>
                L'email ne peut pas être modifié
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Téléphone</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: theme.text + '20'
                }]}
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                placeholder="Entrez votre numéro de téléphone"
                placeholderTextColor={theme.text + '60'}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>École/Lycée</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: theme.text + '20'
                }]}
                value={formData.school}
                onChangeText={(text) => handleChange('school', text)}
                placeholder="Entrez le nom de votre établissement"
                placeholderTextColor={theme.text + '60'}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Niveau académique</Text>
              <LevelPicker />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: theme.surface, 
                  color: theme.text,
                  borderColor: theme.text + '20'
                }]}
                value={formData.bio}
                onChangeText={(text) => handleChange('bio', text)}
                placeholder="Parlez-nous de vous..."
                placeholderTextColor={theme.text + '60'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButtonMobile, { backgroundColor: theme.primary }]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  levelPickerContainer: {
    gap: 16,
  },
  mainLevelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mainLevelOption: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  mainLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  mainLevelSubtext: {
    fontSize: 12,
    fontWeight: '500',
  },
  bacOptionsContainer: {
    marginTop: 8,
  },
  bacOptionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  bacOptionsGrid: {
    gap: 8,
  },
  bacOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  bacOptionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveButtonMobile: {
    marginHorizontal: 20,
    marginTop: 20,
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