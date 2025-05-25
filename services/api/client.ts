// services/api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateType, ActionType, User, Course, Quiz, ApiResponse } from '../../types/types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async removeToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        data: null as any,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    level: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.token) {
      await this.saveToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    await this.removeToken();
  }

  // Course methods
  async getCourses(level: string): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>(`/courses?level=${level}`);
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`);
  }

  async updateCourseProgress(courseId: string, progress: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    });
  }

  // Quiz methods
  async getQuizzes(level: string): Promise<ApiResponse<Quiz[]>> {
    return this.request<Quiz[]>(`/quizzes?level=${level}`);
  }

  async submitQuizScore(quizId: string, score: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/quizzes/${quizId}/score`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  }

  // User methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

// export const apiClient = new ApiClient(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api');
export const apiClient = new ApiClient('http://YOUR_LOCAL_IP:3000/api');
