import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: Omit<Customer, 'id'>) => api.post('/customers', data),
  update: (id: string, data: Partial<Customer>) =>
    api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// Task API
export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: Omit<Task, 'id'>) => api.post('/tasks', data),
  update: (id: string, data: Partial<Task>) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data: Omit<Sale, 'id'>) => api.post('/sales', data),
  update: (id: string, data: Partial<Sale>) => api.put(`/sales/${id}`, data),
  delete: (id: string) => api.delete(`/sales/${id}`),
};
