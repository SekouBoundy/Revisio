// path: utils/quizProgress.ts

import AsyncStorage from "@react-native-async-storage/async-storage";

export const getQuizProgress = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(`quiz_progress_${key}`);
    return value === "true";
  } catch (error) {
    console.error("Error getting quiz progress:", error);
    return false;
  }
};

export const setQuizProgress = async (key: string, completed: boolean) => {
  try {
    await AsyncStorage.setItem(`quiz_progress_${key}`, completed ? "true" : "false");
  } catch (error) {
    console.error("Error setting quiz progress:", error);
  }
};
