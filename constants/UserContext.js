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

  // Helper function to extract student type from grade selection
  const extractStudentTypeFromGrade = (grade) => {
    if (!grade) return 'BAC'; // Default fallback
    
    // Check the string prefix to determine student type
    if (grade.startsWith('DEF')) return 'DEF';
    if (grade.startsWith('BAC')) return 'BAC';
    if (grade.toLowerCase().includes('language')) return 'LANGUAGE';
    
    // Additional safety - if the string contains these words anywhere in the string
    if (grade.includes('DEF')) return 'DEF';
    
    // Final fallback - default to BAC
    return 'BAC';
  };

  // Load user profile from storage
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      console.log("Loading user profile from storage...");
      
      const profileData = await AsyncStorage.getItem('@user_profile');
      
      if (profileData) {
        const parsedProfile = JSON.parse(profileData);
        console.log("Loaded profile:", parsedProfile);
        
        // Ensure studentType is set correctly based on grade
        if (parsedProfile.grade && !parsedProfile.studentType) {
          parsedProfile.studentType = extractStudentTypeFromGrade(parsedProfile.grade);
          // Save the updated profile back to storage
          await AsyncStorage.setItem('@user_profile', JSON.stringify(parsedProfile));
        }
        
        setUserProfile(parsedProfile);
      } else {
        console.log("No profile found in storage");
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
      console.log("Updating profile with:", newProfileData);
      
      // Extract student type if grade is being updated
      let studentType = userProfile?.studentType;
      
      if (newProfileData.grade) {
        studentType = extractStudentTypeFromGrade(newProfileData.grade);
        console.log("Extracted student type:", studentType, "from grade:", newProfileData.grade);
      }
      
      const updatedProfile = { 
        ...userProfile, 
        ...newProfileData,
        studentType // Ensure this is explicitly updated
      };
      
      console.log("Full updated profile:", updatedProfile);
      
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('@user_profile', JSON.stringify(updatedProfile));
      
      // Verification - read back the saved profile
      const savedProfile = await AsyncStorage.getItem('@user_profile');
      console.log("Verification - saved profile:", JSON.parse(savedProfile));
      
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
      
      // Ensure student type is set based on grade if available
      if (userWithUpdatedEmail.grade && !userWithUpdatedEmail.studentType) {
        userWithUpdatedEmail.studentType = extractStudentTypeFromGrade(userWithUpdatedEmail.grade);
      }
      
      console.log("Signing in with user data:", userWithUpdatedEmail);
      
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
  
  // Debug function to help troubleshoot user profile issues
  const debugUserProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('@user_profile');
      console.log("==== USER PROFILE DEBUG ====");
      console.log("In-memory profile:", userProfile);
      console.log("Stored profile:", storedProfile ? JSON.parse(storedProfile) : "None");
      console.log("Student level:", userProfile?.studentType || "Not set");
      console.log("============================");
      return true;
    } catch (error) {
      console.error("Error in debug function:", error);
      return false;
    }
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
        debugUserProfile, // Exposed for troubleshooting
        studentLevel: userProfile?.studentType || 'BAC' // Provide a default if null
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => useContext(UserContext);