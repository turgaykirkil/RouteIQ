import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Daha spesifik ve güvenli tip tanımları
interface User {
  id: string;
  role: string;
  email?: string;
}

interface APIParams {
  search?: string;
  status?: string[];
  tags?: string[];
  priority?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Güvenli ve esnek BASE_URL yapılandırması
const BASE_URL = Platform.select({
  ios: __DEV__ ? 'http://localhost:3000' : 'https://api.routeiq.com',
  android: __DEV__ ? 'http://10.0.2.2:3000' : 'https://api.routeiq.com',
  default: 'https://api.routeiq.com'
});

// Gelişmiş ve detaylı hata yönetimi
class APIError extends Error {
  constructor(
    public message: string, 
    public status?: number, 
    public data?: any,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'APIError';
    
    // Hata izleme için detaylı bilgi
    if (originalError) {
      console.error('Detaylı API Hatası:', {
        message: this.message,
        status: this.status,
        data: this.data,
        originalError: this.originalError
      });
    }
  }
}

// Güvenli token yönetimi
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Token alınamadı:', error);
    return null;
  }
};

// API oluşturma fonksiyonu
const createAPIClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // Zaman aşımını biraz artırdık
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Platform': Platform.OS,
      'X-App-Version': '1.0.0' // Versiyon takibi için
    }
  });

  // Request interceptor
  api.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      try {
        const token = await getAuthToken();
        const userStr = await AsyncStorage.getItem('user');
        
        if (token) {
          config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
          };
        }
        
        if (userStr) {
          const user: User = JSON.parse(userStr);
          config.headers = {
            ...config.headers,
            'x-user-id': user.id,
            'x-user-role': user.role
          };
        }
      } catch (error) {
        console.error('İstek öncesi hata:', error);
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(new APIError(
        'İstek Hatası', 
        error.response?.status, 
        error.response?.data, 
        error
      ));
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const apiError = new APIError(
        error.message || 'Bilinmeyen Hata', 
        error.response?.status, 
        error.response?.data,
        error
      );
      
      // Özel hata yönetimi
      switch (apiError.status) {
        case 401:
          // Token süresi dolmuş veya geçersiz
          AsyncStorage.removeItem('authToken');
          AsyncStorage.removeItem('user');
          break;
        case 403:
          // Yetkisiz erişim
          console.warn('Yetkisiz erişim');
          break;
        case 404:
          // Kaynak bulunamadı
          console.warn('Kaynak bulunamadı');
          break;
        case 500:
          // Sunucu hatası
          console.error('Sunucu hatası');
          break;
      }
      
      return Promise.reject(apiError);
    }
  );

  return api;
};

const api = createAPIClient();

// Performans için generic CRUD operasyonları
const createCRUDOperations = <T>(endpoint: string) => ({
  getAll: async (params?: APIParams): Promise<T[]> => {
    try {
      const response = await api.get(endpoint, { 
        params,
        // Cache kontrolü
        headers: { 'Cache-Control': 'no-cache' }
      });
      return response.data;
    } catch (error) {
      console.error(`${endpoint} listesi alınamadı:`, error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<T> => {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`${endpoint} detayı alınamadı:`, error);
      throw error;
    }
  },
  
  create: async (data: Partial<T>): Promise<T> => {
    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`${endpoint} oluşturulamadı:`, error);
      throw error;
    }
  },
  
  update: async (id: string, data: Partial<T>): Promise<T> => {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`${endpoint} güncellenemedi:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(`${endpoint} silinemedi:`, error);
      throw error;
    }
  }
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      // Token ve kullanıcı bilgilerini güvenli şekilde kaydet
      await AsyncStorage.multiSet([
        ['authToken', response.data.token],
        ['user', JSON.stringify(response.data.user)]
      ]);
      
      return response.data;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      // Tüm depolanan kullanıcı bilgilerini temizle
      await AsyncStorage.multiRemove(['authToken', 'user']);
      return true;
    } catch (error) {
      console.error('Çıkış hatası:', error);
      return false;
    }
  }
};

// Detaylı API tanımları
export const customerAPI = createCRUDOperations<any>('/api/customers');
export const taskAPI = createCRUDOperations<any>('/api/tasks');
export const salesAPI = createCRUDOperations<any>('/api/sales');

export default api;
