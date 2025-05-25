//services/api/types.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  lessons: number;
  progress?: number;
  level: string;
  subject: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: number;
  duration: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  score?: number;
  color: string;
  level: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  level: string;
  school?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}