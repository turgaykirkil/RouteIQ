import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Statik veya dinamik IP ayarı
const BASE_URL = Platform.select({
  ios: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000'
});

// API oluşturma
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        config.headers = {
          ...config.headers,
          'x-user-id': user.id,
          'x-user-role': user.role
        };
      }
    } catch (error) {
      console.error('Kullanıcı verisi alınamadı:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Hatası:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Yanıt Hatası:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Çıkış hatası:', error);
      return false;
    }
  }
};

// Customer API
export const customerAPI = {
  getAll: async (params?: {
    search?: string;
    status?: string[];
    tags?: string[];
    sortBy?: string;
  }) => {
    try {
      const response = await api.get('/api/customers', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    return api.get(`/api/customers/${id}`);
  },
  create: async (data: any) => {
    return api.post('/api/customers', data);
  },
  update: async (id: string, data: any) => {
    return api.put(`/api/customers/${id}`, data);
  },
  delete: async (id: string) => {
    return api.delete(`/api/customers/${id}`);
  },
};

// Task API
export const taskAPI = {
  getAll: async (params?: {
    search?: string;
    status?: string[];
    priority?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    try {
      const response = await api.get('/api/tasks', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      throw error;
    }
  },
  
  getById: async (id: string) => {
    return api.get(`/api/tasks/${id}`);
  },
  create: async (data: any) => {
    return api.post('/api/tasks', data);
  },
  update: async (id: string, data: any) => {
    return api.put(`/api/tasks/${id}`, data);
  },
  delete: async (id: string) => {
    return api.delete(`/api/tasks/${id}`);
  },
};

// Sales API
export const salesAPI = {
  getAll: async () => {
    return api.get('/api/sales');
  },
  getById: async (id: string) => {
    return api.get(`/api/sales/${id}`);
  },
  create: async (data: any) => {
    return api.post('/api/sales', data);
  },
  update: async (id: string, data: any) => {
    return api.put(`/api/sales/${id}`, data);
  },
  delete: async (id: string) => {
    return api.delete(`/api/sales/${id}`);
  },
};

export default api;
