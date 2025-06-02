// app/edit-profile.js - FIXED VERSION

import React, { useState, useContext, useEffect } from 'react';
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
  Image,
  Modal,
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
    location: user?.location || '',
    birthDate: user?.birthDate || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.avatar);
  const [errors, setErrors] = useState({});
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showBacOptions, setShowBacOptions] = useState(false);

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

  // Check for unsaved changes
  useEffect(() => {
    const originalData = {
      name: user?.name || '',
      bio: user?.bio || '',
      school: user?.school || '',
      phone: user?.phone || '',
      level: user?.level || 'DEF',
      location: user?.location || '',
      birthDate: user?.birthDate || '',
    };
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLevelChange = (value) => {
    if (value === 'BAC') {
      setShowBacOptions(true);
    } else if (value === 'DEF') {
      setShowBacOptions(false);
      handleChange('level', 'DEF');
      setShowLevelModal(false);
    } else {
      handleChange('level', value);
      setShowLevelModal(false);
      setShowBacOptions(false);
    }
  };

  const getLevelDisplayName = (level) => {
    if (level === 'DEF') return 'DEF (Secondaire)';
    const spec = bacSpecializations.find(s => s.value === level);
    return spec ? `BAC ${spec.label}` : `BAC ${level}`;
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Modifications non sauvegardées',
        'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?',
        [
          { text: 'Rester', style: 'cancel' },
          { text: 'Quitter', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Changer la photo de profil',
      'Choisissez une option',
      [
        { text: 'Appareil photo', onPress: () => console.log('Camera') },
        { text: 'Galerie', onPress: () => console.log('Gallery') },
        { text: 'Supprimer la photo', style: 'destructive', onPress: () => setAvatarUri(null) },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    if (formData.bio && formData.bio.length > 150) {
      newErrors.bio = 'La bio ne peut pas dépasser 150 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      const updatedData = { ...formData };
      if (avatarUri !== user?.avatar) {
        updatedData.avatar = avatarUri;
      }
      updateUser(updatedData);
      setIsLoading(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  // Input field reusable component
  const InputField = React.useCallback(({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    multiline = false, 
    keyboardType = 'default', 
    required = false,
    error,
    maxLength,
    showCharacterCount = false
  }) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: theme.text }]}>
          {label} {required && <Text style={{ color: theme.error }}>*</Text>}
        </Text>
        {showCharacterCount && maxLength && (
          <Text style={[styles.characterCount, { 
            color: (value?.length || 0) > maxLength ? theme.error : theme.textSecondary 
          }]}>
            {value?.length || 0}/{maxLength}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          multiline ? styles.textArea : styles.input, 
          { 
            backgroundColor: theme.surface, 
            color: theme.text,
            borderColor: error ? theme.error : theme.neutralLight,
            borderWidth: error ? 2 : 1,
          }
        ]}
        value={value || ''}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCorrect={false}
        autoComplete="off"
      />
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      )}
    </View>
  ), [theme]);

  // Level Picker Modal
  const LevelPickerModal = () => {
    const currentLevelIsBac = formData.level !== 'DEF';
    
    return (
      <Modal
        visible={showLevelModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.neutralLight }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choisir le niveau académique
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowLevelModal(false);
                  setShowBacOptions(false);
                }}
                style={[styles.closeButton, { backgroundColor: theme.neutralLight }]}
              >
                <Ionicons name="close" size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.levelPickerContainer}>
                <View style={styles.mainLevelContainer}>
                  <TouchableOpacity
                    style={[
                      styles.mainLevelOption,
                      { 
                        backgroundColor: formData.level === 'DEF' ? theme.primary : theme.surface,
                        borderColor: formData.level === 'DEF' ? theme.primary : theme.neutralLight
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
                      { color: formData.level === 'DEF' ? '#fff' : theme.textSecondary }
                    ]}>
                      Secondaire
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.mainLevelOption,
                      { 
                        backgroundColor: currentLevelIsBac ? theme.primary : theme.surface,
                        borderColor: currentLevelIsBac ? theme.primary : theme.neutralLight
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
                      { color: currentLevelIsBac ? '#fff' : theme.textSecondary }
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
                              borderColor: formData.level === spec.value ? theme.primary : theme.neutralLight
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Modifier le profil',
          headerStyle: { backgroundColor: theme.primary },
          headerTintColor: theme.surface,
          headerTitleStyle: { fontWeight: 'bold' },
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color={theme.surface} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave} 
              style={[
                styles.saveHeaderButton, 
                { 
                  backgroundColor: hasUnsavedChanges ? theme.surface + '20' : 'transparent',
                  opacity: hasUnsavedChanges ? 1 : 0.5
                }
              ]}
              disabled={isLoading || !hasUnsavedChanges}
            >
              <Text style={[styles.saveButton, { color: theme.surface }]}>
                {isLoading ? 'Saving...' : 'Sauver'}
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
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Text style={[styles.avatarText, { color: theme.surface }]}>
                  {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.changePhotoButton, { backgroundColor: theme.primary + '15' }]}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={16} color={theme.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.changePhotoText, { color: theme.primary }]}>
                {avatarUri ? 'Modifier la photo' : 'Ajouter une photo'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Informations personnelles
            </Text>
            
            <InputField
              label="Nom complet"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Entrez votre nom complet"
              required
              error={errors.name}
              maxLength={50}
              showCharacterCount
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View style={[styles.disabledInput, { 
                backgroundColor: theme.neutralLight, 
                borderColor: theme.neutralLight
              }]}>
                <Text style={[styles.disabledText, { color: theme.textSecondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
                <Ionicons name="lock-closed" size={16} color={theme.textSecondary} />
              </View>
              <Text style={[styles.helpText, { color: theme.textSecondary }]}>
                L'email ne peut pas être modifié
              </Text>
            </View>

            <InputField
              label="Téléphone"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              placeholder="Entrez votre numéro de téléphone"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <InputField
              label="École/Lycée"
              value={formData.school}
              onChangeText={(text) => handleChange('school', text)}
              placeholder="Entrez le nom de votre établissement"
              maxLength={100}
            />

            <InputField
              label="Ville"
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="Entrez votre ville"
              maxLength={50}
            />

            {/* Level Picker */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>
              Niveau académique
            </Text>
            
            <TouchableOpacity
              style={[styles.levelPickerButton, { 
                backgroundColor: theme.surface,
                borderColor: theme.neutralLight 
              }]}
              onPress={() => setShowLevelModal(true)}
            >
              <View style={styles.levelPickerContent}>
                <Text style={[styles.levelPickerText, { color: theme.text }]}>
                  {getLevelDisplayName(formData.level)}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>
              À propos de vous
            </Text>

            <InputField
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => handleChange('bio', text)}
              placeholder="Parlez-nous de vous..."
              multiline
              maxLength={150}
              showCharacterCount
              error={errors.bio}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              styles.saveButtonMobile, 
              { 
                backgroundColor: hasUnsavedChanges ? theme.primary : theme.neutralLight,
                opacity: hasUnsavedChanges ? 1 : 0.6
              }
            ]}
            onPress={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
          >
            <Ionicons 
              name="save" 
              size={20} 
              color={hasUnsavedChanges ? "#fff" : theme.textSecondary} 
              style={{ marginRight: 8 }} 
            />
            <Text style={[
              styles.saveButtonText,
              { color: hasUnsavedChanges ? "#fff" : theme.textSecondary }
            ]}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      <LevelPickerModal />
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
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    paddingHorizontal: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  characterCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  disabledInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  levelPickerButton: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 24,
  },
  levelPickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelPickerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  levelPickerContainer: {
    gap: 20,
  },
  mainLevelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mainLevelOption: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  mainLevelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainLevelSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  bacOptionsContainer: {
    marginTop: 8,
  },
  bacOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  bacOptionsGrid: {
    gap: 10,
  },
  bacOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  bacOptionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});