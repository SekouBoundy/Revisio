/**
 * File: app/_tabs/profile/edit.js
 * Edit profile screen for updating user information
 */

import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/common/Button';
import Header from '../../../components/common/Header';
import Input from '../../../components/common/Input';
import Theme from '../../../constants/Theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [learningType, setLearningType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync('user_data');
        
        if (storedUserData) {
          const data = JSON.parse(storedUserData);
          setUserData(data);
          setName(data.name || '');
          setEmail(data.email || '');
          setLearningType(data.learningType || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    // Validate input
    if (!name.trim()) {
      Alert.alert('Invalid Input', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Invalid Input', 'Please enter your email');
      return;
    }

    if (!learningType) {
      Alert.alert('Invalid Input', 'Please select a learning track');
      return;
    }

    try {
      setIsSaving(true);

      // Update user data
      const updatedUserData = {
        ...userData,
        name,
        email,
        learningType,
      };

      // Save updated user data
      await SecureStore.setItemAsync('user_data', JSON.stringify(updatedUserData));
      
      // Show success message
      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getLearningTypeColor = (type) => {
    switch (type) {
      case 'bac':
        return Theme.colors.bac;
      case 'def':
        return Theme.colors.def;
      case 'languages':
        return Theme.colors.languages;
      default:
        return Theme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      <Header
        title="Edit Profile"
        showBack={true}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Text style={styles.sectionTitle}>Learning Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          Choose your primary learning track
        </Text>
        
        <View style={styles.learningTypesContainer}>
          <LearningTypeButton
            title="BAC Prep"
            value="bac"
            selected={learningType === 'bac'}
            color={Theme.colors.bac}
            onPress={() => setLearningType('bac')}
          />
          
          <LearningTypeButton
            title="DEF Prep"
            value="def"
            selected={learningType === 'def'}
            color={Theme.colors.def}
            onPress={() => setLearningType('def')}
          />
          
          <LearningTypeButton
            title="Languages"
            value="languages"
            selected={learningType === 'languages'}
            color={Theme.colors.languages}
            onPress={() => setLearningType('languages')}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          >
            Save Changes
          </Button>
          
          <Button
            variant="outline"
            onPress={() => router.back()}
            fullWidth
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Learning type button component
const LearningTypeButton = ({ title, value, selected, color, onPress }) => (
  <Button
    variant={selected ? 'primary' : 'outline'}
    style={[
      styles.learningTypeButton,
      selected && { backgroundColor: color },
      !selected && { borderColor: color }
    ]}
    textStyle={[
      !selected && { color: color }
    ]}
    onPress={onPress}
  >
    {title}
  </Button>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.layout.spacing.lg,
    paddingBottom: Theme.layout.spacing.xxl,
  },
  sectionTitle: {
    fontSize: Theme.layout.fontSize.lg,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
    marginTop: Theme.layout.spacing.lg,
    marginBottom: Theme.layout.spacing.md,
  },
  sectionSubtitle: {
    fontSize: Theme.layout.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.layout.spacing.md,
  },
  learningTypesContainer: {
    marginBottom: Theme.layout.spacing.xl,
  },
  learningTypeButton: {
    marginBottom: Theme.layout.spacing.md,
  },
  buttonContainer: {
    marginTop: Theme.layout.spacing.lg,
  },
  cancelButton: {
    marginTop: Theme.layout.spacing.md,
  },
});