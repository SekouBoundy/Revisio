// app/_tabs/profile/edit.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CustomDropdown from '../../../components/common/CustomDropdown';

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

import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const initialForm = {
    name: 'Amadou Diallo',
    email: 'amadou.diallo@example.com',
    phone: '+223 76 54 32 10',
    school: 'Lycée Central de Bamako',
    grade: 'Terminale'
  };
  const [form, setForm] = useState(initialForm);
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanged(JSON.stringify(updated) !== JSON.stringify(initialForm));
      return updated;
    });
  };
  
  const handleSave = () => {
    Alert.alert(
      "Profil mis à jour",
      "Vos informations ont été enregistrées avec succès.",
      [
        { text: "OK", onPress: () => router.back() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier le profil</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {form.name.split(' ').map(name => name[0]).join('').toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Entrez votre nom"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={form.email}
                editable={false}
                placeholder="Entrez votre email"
              />
              <Text style={styles.helperText}>L'adresse e-mail ne peut pas être modifiée</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(text) => handleChange('phone', text)}
                placeholder="Entrez votre numéro de téléphone"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>École</Text>
              <TextInput
                style={styles.input}
                value={form.school}
                onChangeText={(text) => handleChange('school', text)}
                placeholder="Entrez le nom de votre école"
              />
            </View>
            <View style={styles.formGroup}>
  <Text style={styles.label}>Niveau</Text>
  <CustomDropdown
    options={levelOptions}
    selectedValue={form.grade}
    onValueChange={(value) => handleChange('grade', value)}
    placeholder="Sélectionnez un niveau..."
  />
</View>
            
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, !hasChanged && { opacity: 0.5 }]}
            onPress={handleSave}
            disabled={!hasChanged}
          >
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
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
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
    pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    overflow: 'hidden', // Important for Android
  },
  iosPicker: {
    height: 48,
    width: '100%',
    color: '#1F2937',
  },
  androidPicker: {
    height: 48,
    width: '100%',
    color: '#1F2937',
    backgroundColor: 'transparent',
  },


});