// // constants/UserContext.js - IMPROVED VERSION
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('userData');
//       if (userData) {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//       } else {
//         // Set default user data if none exists
//         const defaultUser = {
//           id: null,
//           name: '',
//           email: '',
//           level: 'DEF',
//           bio: '',
//           school: '',
//           phone: '',
//           location: '',
//           birthDate: '',
//           interests: [],
//           avatar: null,
//           preferences: {
//             notifications: true,
//             language: 'fr',
//             theme: 'light'
//           },
//           progress: {
//             coursesCompleted: 0,
//             quizzesCompleted: 0,
//             totalLessons: 0,
//             currentStreak: 0
//           }
//         };
//         setUser(defaultUser);
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateUser = async (userData) => {
//     try {
//       const updatedUser = { ...user, ...userData };
//       setUser(updatedUser);
      
//       // Persist to AsyncStorage
//       await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
//       return { success: true };
//     } catch (error) {
//       console.error('Error updating user data:', error);
//       return { success: false, error: error.message };
//     }
//   };

//   const updateProgress = async (progressData) => {
//     try {
//       const updatedProgress = { ...user.progress, ...progressData };
//       await updateUser({ progress: updatedProgress });
//     } catch (error) {
//       console.error('Error updating progress:', error);
//     }
//   };

//   const updatePreferences = async (preferences) => {
//     try {
//       const updatedPreferences = { ...user.preferences, ...preferences };
//       await updateUser({ preferences: updatedPreferences });
//     } catch (error) {
//       console.error('Error updating preferences:', error);
//     }
//   };

//   const clearUserData = async () => {
//     try {
//       await AsyncStorage.removeItem('userData');
//       setUser(null);
//     } catch (error) {
//       console.error('Error clearing user data:', error);
//     }
//   };

//   // Calculate user statistics
//   const getUserStats = () => {
//     if (!user) return null;

//     const { progress } = user;
//     return {
//       completionRate: progress.totalLessons > 0 
//         ? Math.round((progress.coursesCompleted / progress.totalLessons) * 100) 
//         : 0,
//       currentStreak: progress.currentStreak,
//       totalQuizzes: progress.quizzesCompleted,
//       level: user.level,
//       joinDate: user.createdAt || new Date().toISOString()
//     };
//   };

//   // Get user's academic level info
//   const getLevelInfo = () => {
//     if (!user?.level) return null;

//     const levelMap = {
//       'DEF': { name: 'DEF', fullName: 'Diplôme d\'Enseignement Fondamental', type: 'secondary' },
//       'TSE': { name: 'TSE', fullName: 'Sciences Exactes', type: 'bac' },
//       'TSEXP': { name: 'TSEXP', fullName: 'Sciences Expérimentales', type: 'bac' },
//       'TSECO': { name: 'TSECO', fullName: 'Sciences Économiques', type: 'bac' },
//       'TSS': { name: 'TSS', fullName: 'Sciences Sociales', type: 'bac' },
//       'TAL': { name: 'TAL', fullName: 'Arts et Lettres', type: 'bac' },
//       'TLL': { name: 'TLL', fullName: 'Langues et Lettres', type: 'bac' },
//       'STI': { name: 'STI', fullName: 'Sciences et Technologies Industrielles', type: 'bac' },
//       'STG': { name: 'STG', fullName: 'Sciences et Technologies de Gestion', type: 'bac' }
//     };

//     return levelMap[user.level] || levelMap['DEF'];
//   };

//   const value = {
//     user,
//     isLoading,
//     setUser,
//     updateUser,
//     updateProgress,
//     updatePreferences,
//     clearUserData,
//     getUserStats,
//     getLevelInfo,
    
//     // Helper computed values
//     isDefLevel: user?.level === 'DEF',
//     isBacLevel: user?.level !== 'DEF' && user?.level,
//     userInitials: user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Remove AsyncStorage for now - use only in-memory state
  const [user, setUser] = useState({
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    level: 'DEF',
    bio: '',
    school: '',
    phone: '',
    location: '',
    preferences: {
      notifications: true,
      language: 'fr',
      theme: 'light'
    },
    progress: {
      coursesCompleted: 0,
      quizzesCompleted: 0,
      totalLessons: 24,
      currentStreak: 0
    }
  });

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    return { success: true };
  };

  const value = {
    user,
    updateUser,
    isDefLevel: user?.level === 'DEF',
    isBacLevel: user?.level !== 'DEF',
    userInitials: user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};