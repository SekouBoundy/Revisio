// constants/UserContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

// Define user context
export const UserContext = createContext();

// Student levels
export const STUDENT_LEVELS = {
  BAC: 'BAC',
  DEF: 'DEF',
  LANGUAGE: 'LANGUAGE'
};

// User provider component
export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Load user profile from storage
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await AsyncStorage.getItem('@user_profile');
      
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (newProfileData) => {
    try {
      const updatedProfile = { ...userProfile, ...newProfileData };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  };

  // Sign in
  const signIn = async (userData) => {
  try {
    // If there's a default email being set somewhere, change it here
    const userWithUpdatedEmail = {
      ...userData,
      email: userData.email || "sekouboundy@example.com" // Use provided email or default
    };
    
    await AsyncStorage.setItem('@user_profile', JSON.stringify(userWithUpdatedEmail));
    setUserProfile(userWithUpdatedEmail);
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    return false;
  }
};

  // Sign out
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@user_profile');
      setUserProfile(null);
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      return false;
    }
  };

  // Check if content is relevant for user's level
  const isContentForUserLevel = (contentLevels) => {
    if (!userProfile || !userProfile.studentType) return true; // Show all content if no profile exists yet
    if (!contentLevels || contentLevels.length === 0) return true; // Show content with no level restrictions
    return contentLevels.includes(userProfile.studentType);
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        isLoading, 
        updateUserProfile, 
        signIn, 
        signOut,
        isContentForUserLevel,
        studentLevel: userProfile?.studentType || null
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);
