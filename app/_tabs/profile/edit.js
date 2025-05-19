// app/_tabs/profile/edit.js
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Button from '../../../components/common/Button';
import Header from '../../../components/common/Header';
import Input from '../../../components/common/Input';
import * as Theme from '../../../constants/Theme';

export default function ProfileEditScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    studentType: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const router = useRouter();
  const theme = Theme.createTheme(false); // Pass true for dark mode

  // Load user profile data
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const storedProfile = await SecureStore.getItemAsync('userProfile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setFormData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            bio: profile.bio || '',
            studentType: profile.studentType || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsFetching(false);
      }
    }

    loadUserProfile();
  }, []);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Handle form submission
  const handleSave = async () => {
    // Validate form
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save profile data to secure storage
      await SecureStore.setItemAsync('userProfile', JSON.stringify(formData));
      
      // Show success message and navigate back
      Alert.alert(
        'Success',
        'Your profile has been updated successfully.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Edit Profile" onBackPress={() => router.back()} />
        <View style={styles.centerContent}>
          <Text style={{ color: theme.colors.text }}>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <Header title="Edit Profile" onBackPress={() => router.back()} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Input
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />
        
        <Input
          label="Email Address"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          disabled={true} // Make email non-editable
          hint="Email cannot be changed"
        />
        
        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(text) => handleChange('bio', text)}
          placeholder="Tell us about yourself"
          multiline
          style={styles.bioInput}
        />
        
        <View style={styles.studentTypeContainer}>
          <Input
            label="Student Type"
            value={
              formData.studentType === 'BAC' ? 'BAC Student' : 
              formData.studentType === 'DEF' ? 'DEF Student' : 
              formData.studentType === 'LANGUAGE' ? 'Language Student' : 
              'Student'
            }
            disabled={true} // Make student type non-editable
            hint="Student type cannot be changed"
          />
        </View>
        
        <Button
          label="Save Changes"
          onPress={handleSave}
          isLoading={isLoading}
          style={styles.saveButton}
        />
        
        <Button
          label="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.cancelButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  bioInput: {
    height: 120,
  },
  studentTypeContainer: {
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 24,
  },
});