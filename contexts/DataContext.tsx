// contexts/DataContext.tsx - For caching and offline support
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import { Course, Quiz, User } from '../services/api/types';

interface DataContextType {
  courses: Course[];
  quizzes: Quiz[];
  isOnline: boolean;
  syncData: () => Promise<void>;
  getCachedCourses: (level: string) => Course[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Monitor network state
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    // Load cached data on app start
    loadCachedData();

    return unsubscribe;
  }, []);

  const loadCachedData = async () => {
    try {
      const cachedCourses = await AsyncStorage.getItem('cached_courses');
      const cachedQuizzes = await AsyncStorage.getItem('cached_quizzes');

      if (cachedCourses) setCourses(JSON.parse(cachedCourses));
      if (cachedQuizzes) setQuizzes(JSON.parse(cachedQuizzes));
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const syncData = async () => {
    if (!isOnline) return;

    try {
      // Sync courses and quizzes
      // Implementation would fetch from API and update cache
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  };

  const getCachedCourses = (level: string) => {
    return courses.filter(course => course.level === level);
  };

  const value: DataContextType = {
    courses,
    quizzes,
    isOnline,
    syncData,
    getCachedCourses,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}