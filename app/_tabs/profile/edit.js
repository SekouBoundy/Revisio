// app/_tabs/profile/edit.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomDropdown from '../../../components/common/CustomDropdown';
import { useTheme } from '../../../constants/ThemeContext';
import { useUser } from '../../../constants/UserContext';

// Format options for the dropdown
const levels = [
  'DEF',
  'BAC / Sciences Exactes (TSE)',
  'BAC / Sciences Expérimentales (TSEXP)',
  'BAC / Sciences Économiques (TSECO)',
  'BAC / Sciences Sociales (TSS)',
  'BAC / Arts et Lettres (TAL)',
  'BAC / Langues et Lettres (TLL)',
  'BAC / Sciences et Technologies Industrielles (STI)',
  'BAC / Sciences et Technologies de Gestion (STG)'
];
const levelOptions = levels.map(level => ({
  label: level,
  value: level
}));

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { updateUserProfile, debugUserProfile } = useUser();
  const [initialForm, setInitialForm] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    grade: ''
  });
  const [form, setForm] = useState(initialForm);
  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const savedData = await AsyncStorage.getItem('@user_data');
        
        if (savedData) {
          const userData = JSON.parse(savedData);
          setInitialForm(userData);
          setForm(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanged(JSON.stringify(updated) !== JSON.stringify(initialForm));
      return updated;
    });
  };
  
  const handleSave = async () => {
    if (!hasChanged) return;
    
    try {
      setIsSaving(true);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('@user_data', JSON.stringify(form));
      
      // Update profile with grade information
      if (form.grade) {
        console.log("Saving grade:", form.grade);
        
        // Update UserContext with both grade and gradeDescription
        await updateUserProfile({ 
          grade: form.grade,
          gradeDescription: form.grade
        });
        
        // Debug the profile after update if the debug function is available
        if (debugUserProfile) {
          await debugUserProfile();
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#FFFFFF' }]}>
        <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text || '#1F2937'} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text || '#1F2937' }]}>Modifier le profil</Text>
            <View style={styles.placeholder} />
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary || '#4361FF'} />
            <Text style={[styles.loadingText, { color: theme.text || '#1F2937' }]}>Chargement du profil...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background || '#FFFFFF' }]}>
      <View style={[styles.container, { backgroundColor: theme.background || '#FFFFFF' }]}>
        <View style={[styles.header, { borderBottomColor: theme.border || '#F3F4F6' }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text || '#1F2937'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text || '#1F2937' }]}>Modifier le profil</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: (theme.primary || '#4361FF') + '20' }]}>
              <Text style={[styles.avatarText, { color: theme.primary || '#4361FF' }]}>
                {form.name.split(' ').map(name => name[0]).join('').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={[styles.changePhotoText, { color: theme.primary || '#4361FF' }]}>Changer la photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary || '#4B5563' }]}>Nom complet</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground || '#F9FAFB',
                    borderColor: theme.border || '#E5E7EB',
                    color: theme.text || '#1F2937'
                  }
                ]}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Entrez votre nom"
                placeholderTextColor={theme.textSecondary + '80' || '#9CA3AF'}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary || '#4B5563' }]}>Email</Text>
              <TextInput
                style={[
                  styles.input, 
                  styles.disabledInput,
                  { 
                    backgroundColor: theme.inputBackground + '80' || '#F3F4F6',
                    borderColor: theme.border || '#E5E7EB',
                    color: theme.textSecondary || '#6B7280'
                  }
                ]}
                value={form.email}
                editable={false}
                placeholder="Entrez votre email"
                placeholderTextColor={theme.textSecondary + '80' || '#9CA3AF'}
              />
              <Text style={[styles.helperText, { color: theme.textSecondary + '80' || '#9CA3AF' }]}>
                L'adresse e-mail ne peut pas être modifiée
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary || '#4B5563' }]}>Téléphone</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground || '#F9FAFB',
                    borderColor: theme.border || '#E5E7EB',
                    color: theme.text || '#1F2937'
                  }
                ]}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', text)}
                placeholder="Entrez votre numéro de téléphone"
                placeholderTextColor={theme.textSecondary + '80' || '#9CA3AF'}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary || '#4B5563' }]}>École</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground || '#F9FAFB',
                    borderColor: theme.border || '#E5E7EB',
                    color: theme.text || '#1F2937'
                  }
                ]}
                value={form.school}
                onChangeText={(text) => handleChange('school', text)}
                placeholder="Entrez le nom de votre école"
                placeholderTextColor={theme.textSecondary + '80' || '#9CA3AF'}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.textSecondary || '#4B5563' }]}>Niveau</Text>
              <CustomDropdown
                options={levelOptions}
                selectedValue={form.grade}
                onValueChange={(value) => handleChange('grade', value)}
                placeholder="Sélectionnez un niveau..."
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.saveButton, 
              { backgroundColor: theme.primary || '#4361FF' },
              !hasChanged && styles.saveButtonDisabled
            ]}
            onPress={handleSave}
            disabled={!hasChanged || isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4361FF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4361FF',
  },
  changePhotoButton: {
    paddingVertical: 8,
  },
  changePhotoText: {
    fontSize: 14,
    color: '#4361FF',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#4361FF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButtonDisabled: {
    backgroundColor: '#A0AEC0',
    opacity: 0.5,
  }
});