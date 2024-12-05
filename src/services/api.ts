import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
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
      if (userStr) {
        const user = JSON.parse(userStr);
        // Kullanıcı bilgilerini headers'a ekleyelim
        config.headers = {
          ...config.headers,
          'X-User-Id': user.id,
          'X-User-Role': user.role
        };
        // Ayrıca query params olarak da ekleyelim
        config.params = {
          ...config.params,
          userId: user.id,
          role: user.role
        };
        console.log('Current User:', user);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    console.log('API Request:', config.method, config.url, config.params);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('Login Request:', { email, password });
      const response = await api.post('/api/login', { email, password });
      
      if (response.data.success) {
        return {
          user: response.data.user
        };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('userData');
      return true;
    } catch (error) {
      console.error('Logout Error:', error);
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
    salesRepId?: string;
  }) => {
    try {
      // Kullanıcı bilgisini AsyncStorage'dan al
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      console.log('EVRAKA - CustomerAPI getAll User:', user);
      console.log('EVRAKA - CustomerAPI getAll Params:', params);
      
      let queryParams = { ...params };
      
      // Sadece admin ve supervisor tüm datayı görebilir
      if (user?.role && !['admin', 'supervisor'].includes(user.role)) {
        queryParams.salesRepId = user?.id;
      }

      console.log('EVRAKA - CustomerAPI Final Query Params:', queryParams);
      
      const response = await api.get('/api/customers', { 
        params: queryParams
      });
      
      console.log('EVRAKA - CustomerAPI getAll Response:', {
        count: response.data.length,
        firstCustomer: response.data[0]
      });
      
      // Admin ve supervisor için filtreleme yapma
      if (['admin', 'supervisor'].includes(user?.role)) {
        return response.data;
      }
      
      // Diğer roller için salesRepId'ye göre filtrele
      const filteredCustomers = response.data.filter(
        customer => customer.salesRepId === user?.id
      );

      console.log('EVRAKA - Filtered Customers:', {
        count: filteredCustomers.length,
        firstCustomer: filteredCustomers[0]
      });
      
      return filteredCustomers;
    } catch (error) {
      console.error('EVRAKA - CustomerAPI getAll Error:', error);
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
      // Kullanıcı bilgisini AsyncStorage'dan al
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      console.log('EVRAKA - TaskAPI getAll User:', user);
      console.log('EVRAKA - TaskAPI getAll Params:', params);
      
      let queryParams = { ...params };
      
      // Sadece admin ve supervisor tüm datayı görebilir
      if (user?.role && !['admin', 'supervisor'].includes(user.role)) {
        queryParams.salesRepId = user?.id;
      }

      console.log('EVRAKA - TaskAPI Final Query Params:', queryParams);
      
      const response = await api.get('/api/tasks', { 
        params: queryParams
      });
      
      console.log('EVRAKA - TaskAPI getAll Response:', {
        count: response.data.length,
        firstTask: response.data[0]
      });
      
      // Admin ve supervisor için filtreleme yapma
      if (['admin', 'supervisor'].includes(user?.role)) {
        return response.data;
      }
      
      // Diğer roller için salesRepId'ye göre filtrele
      const filteredTasks = response.data.filter(
        task => task.salesRepId === user?.id
      );

      console.log('EVRAKA - Filtered Tasks:', {
        count: filteredTasks.length,
        firstTask: filteredTasks[0]
      });
      
      return filteredTasks;
    } catch (error) {
      console.error('EVRAKA - TaskAPI getAll Error:', error);
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
