// types/types.ts

export type User = {
  id: string;
  name: string;
  email: string;
  level: string;
};

export type Course = {
  id: string;
  title: string;
  level: string;
};

export type Quiz = {
  id: string;
  courseId: string;
  title: string;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
};

export type StateType = {
  user: User | null;
  courses: Course[];
  quizzes: Quiz[];
};

export type ActionType =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_QUIZZES'; payload: Quiz[] };
