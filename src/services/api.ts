import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = Platform.select({
  android: 'http://192.168.1.8:3000', // Bilgisayarınızın yerel IP adresi
  ios: 'http://192.168.1.8:3000',     // Bilgisayarınızın yerel IP adresi
  default: 'http://localhost:3000'
});

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
      console.log('📡 API Request Config:', {
        method: config.method,
        url: config.url,
        headers: config.headers
      });
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('👤 User from AsyncStorage:', user);
        config.headers = {
          ...config.headers,
          'x-user-id': user.id,
          'x-user-role': user.role
        };
      }
    } catch (error) {
      console.error('❌ Error getting user data:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/login', { email, password });
      
      if (response.data.success) {
        return {
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('userData');
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
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
