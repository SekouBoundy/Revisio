// app/edit-profile.js - MVP VERSION
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
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      updateUser(formData);
      setIsLoading(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    multiline = false, 
    keyboardType = 'default', 
    required = false,
    error,
    maxLength
  }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>
        {label} {required && <Text style={{ color: theme.error }}>*</Text>}
      </Text>
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
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );

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
  <Stack.Screen options={{ headerShown: false }} />

  {/* Curved Header */}
  <View style={[styles.curvedHeader, { backgroundColor: theme.primary }]}>
    <View style={styles.curvedHeaderContent}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={[styles.curvedHeaderTitle, { color: '#FFFFFF' }]}>
          Modifier le profil
        </Text>
      </View>
      
      <TouchableOpacity 
        onPress={handleSave} 
        style={[styles.saveHeaderButton, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]}
        disabled={isLoading}
      >
        <Text style={[styles.saveHeaderText, { color: '#FFFFFF' }]}>
          {isLoading ? 'Saving...' : 'Sauver'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>

  <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.surface }]}>
              {formData.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.changePhotoButton, { backgroundColor: theme.primary + '15' }]}
          >
            <Ionicons name="camera" size={16} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.changePhotoText, { color: theme.primary }]}>
              Modifier la photo
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
            placeholder="+223 XX XX XX XX"
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
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButtonMobile, { backgroundColor: theme.primary }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Ionicons name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
    textAlignVertical: 'top',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
  height: 40,
},
// Curved Header Styles
curvedHeader: {
  paddingTop: 60,
  paddingBottom: 30,
  paddingHorizontal: 20,
  borderBottomLeftRadius: 30,
  borderBottomRightRadius: 30,
},
curvedHeaderContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
backButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  justifyContent: 'center',
  alignItems: 'center',
},
headerCenter: {
  flex: 1,
  alignItems: 'center',
},
curvedHeaderTitle: {
  fontSize: 20,
  fontWeight: 'bold',
},
saveHeaderText: {
  fontSize: 16,
  fontWeight: '600',
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