import { Customer } from '../types/customer';
import db from '../../db.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data
const mockCustomers: Customer[] = db.customers;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  // Fetch all customers with optional filters
  getCustomers: async (params?: {
    search?: string;
    status?: string[];
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    role?: 'admin' | 'supervisor' | 'sales_rep';
    customerId?: string;
    includeCoordinates?: boolean;
  }) => {
    try {
      await delay(500);
      
      let customers = [...mockCustomers];
      
      // Role ve kullanıcı ID'sine göre filtreleme
      if (params?.role === 'sales_rep' && params?.userId) {
        customers = customers.filter(customer => customer.salesRepId === params.userId);
      }
      
      // Müşteri ID'sine göre filtreleme
      if (params?.customerId) {
        customers = customers.filter(customer => customer.id === params.customerId);
      }

      // Apply search filter
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        customers = customers.filter(customer => {
          const matchName = customer.name.toLowerCase().includes(searchLower);
          const matchCompany = customer.company.toLowerCase().includes(searchLower);
          const matchEmail = customer.email.toLowerCase().includes(searchLower);
          
          return matchName || matchCompany || matchEmail;
        });
      }

      // Apply status filter
      if (params?.status?.length) {
        customers = customers.filter(customer => {
          const isStatusMatch = params.status.includes(customer.status);
          return isStatusMatch;
        });
      }

      // Apply tags filter
      if (params?.tags?.length) {
        customers = customers.filter(customer => {
          const isTagMatch = params.tags.some(tag => customer.tags.includes(tag));
          return isTagMatch;
        });
      }

      // Apply sorting
      if (params?.sortBy) {
        customers.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Customer];
          const bValue = b[params.sortBy as keyof Customer];
          const order = params.sortOrder === 'desc' ? -1 : 1;
          
          return aValue < bValue ? -order : order;
        });
      }

      // Koordinatları olan müşterileri filtreleme
      if (params?.includeCoordinates) {
        customers = customers.filter((c: Customer) => 
          c.address?.coordinates?.lat && c.address?.coordinates?.lng
        );
      }

      return customers;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<Customer | null> => {
    console.log('CustomerService: getCustomerById called with ID', id);
    
    try {
      await delay(300);
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        throw new Error('Kullanıcı girişi yapılmamış!');
      }
      
      const user = JSON.parse(userStr);
      const customer = mockCustomers.find(c => c.id === id);
      
      if (!customer) {
        throw new Error('Müşteri bulunamadı!');
      }
      
      // Eğer kullanıcı sales_rep ise ve müşteri kendisine ait değilse, erişimi engelle
      if (user.role === 'sales_rep' && customer.salesRepId !== user.id) {
        throw new Error('Bu müşteriye erişim yetkiniz yok!');
      }
      
      console.log('CustomerService: Found Customer', customer);
      
      return customer;
    } catch (error) {
      console.error('CustomerService: Error in getCustomerById', error);
      return null;
    }
  },

  // Create new customer
  createCustomer: async (customerData: Omit<Customer, 'id'>) => {
    try {
      await delay(500);
      const newCustomer: Customer = {
        ...customerData,
        id: Math.random().toString(36).substr(2, 9),
      };
      mockCustomers.push(newCustomer);
      return newCustomer;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Partial<Customer>) => {
    try {
      await delay(500);
      const index = mockCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      mockCustomers[index] = { ...mockCustomers[index], ...customerData };
      return mockCustomers[index];
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id: string) => {
    try {
      await delay(500);
      const index = mockCustomers.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('Customer not found');
      }
      mockCustomers.splice(index, 1);
    } catch (error) {
      throw error;
    }
  },

  // Get customer statistics
  getCustomerStatistics: async (id: string) => {
    try {
      await delay(300);
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      return customer.statistics;
    } catch (error) {
      throw error;
    }
  },

  // Add customer tag
  addCustomerTag: async (id: string, tag: string) => {
    try {
      await delay(300);
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      if (!customer.tags.includes(tag)) {
        customer.tags.push(tag);
      }
      return customer;
    } catch (error) {
      throw error;
    }
  },

  // Remove customer tag
  removeCustomerTag: async (id: string, tag: string) => {
    try {
      await delay(300);
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      customer.tags = customer.tags.filter(t => t !== tag);
      return customer;
    } catch (error) {
      throw error;
    }
  },

  // Update customer location
  updateCustomerLocation: async (
    id: string,
    location: { latitude: number; longitude: number }
  ) => {
    try {
      await delay(300);
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      customer.location = location;
      return customer;
    } catch (error) {
      throw error;
    }
  },
};

export default customerService;
