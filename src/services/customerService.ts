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
  }) => {
    console.log('🔍 CustomerService: Fetching customers');
    console.log('🔑 Input Parameters:', JSON.stringify(params || {}, null, 2));

    // Log the start of the operation with timestamp
    const startTime = Date.now();
    console.log(`⏱️ Operation started at: ${new Date().toISOString()}`);

    await delay(500);
    
    let customers = [...mockCustomers];
    
    console.log(`📋 Total customers before filtering: ${customers.length}`);

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      const initialCount = customers.length;
      
      customers = customers.filter(customer => {
        const matchName = customer.name.toLowerCase().includes(searchLower);
        const matchCompany = customer.company.toLowerCase().includes(searchLower);
        const matchEmail = customer.email.toLowerCase().includes(searchLower);
        
        return matchName || matchCompany || matchEmail;
      });

      console.log(`🔎 Search Filter: "${params.search}"`);
      console.log(`   - Customers before search: ${initialCount}`);
      console.log(`   - Customers after search: ${customers.length}`);
      console.log(`   - Matching fields: name, company, email`);
    }

    // Apply status filter
    if (params?.status?.length) {
      const initialCount = customers.length;
      
      customers = customers.filter(customer => {
        const isStatusMatch = params.status.includes(customer.status);
        return isStatusMatch;
      });

      console.log(`📊 Status Filter: ${JSON.stringify(params.status)}`);
      console.log(`   - Customers before status filter: ${initialCount}`);
      console.log(`   - Customers after status filter: ${customers.length}`);
    }

    // Apply tags filter
    if (params?.tags?.length) {
      const initialCount = customers.length;
      
      customers = customers.filter(customer => {
        const isTagMatch = params.tags.some(tag => customer.tags.includes(tag));
        return isTagMatch;
      });

      console.log(`🏷️ Tags Filter: ${JSON.stringify(params.tags)}`);
      console.log(`   - Customers before tags filter: ${initialCount}`);
      console.log(`   - Customers after tags filter: ${customers.length}`);
    }

    // Apply sorting
    if (params?.sortBy) {
      console.log(`🔀 Sorting customers by: ${params.sortBy}, Order: ${params.sortOrder}`);
      
      customers.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Customer];
        const bValue = b[params.sortBy as keyof Customer];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        
        return aValue < bValue ? -order : order;
      });

      console.log(`   - Sort completed successfully`);
    }

    // Log operation duration
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Final customer list size: ${customers.length}`);
    console.log(`⏱️ Operation duration: ${duration}ms`);

    return customers;
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
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
    
    return customer;
  },

  // Create new customer
  createCustomer: async (customerData: Omit<Customer, 'id'>) => {
    await delay(500);
    const newCustomer: Customer = {
      ...customerData,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockCustomers.push(newCustomer);
    return newCustomer;
  },

  // Update customer
  updateCustomer: async (id: string, customerData: Partial<Customer>) => {
    await delay(500);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    mockCustomers[index] = { ...mockCustomers[index], ...customerData };
    return mockCustomers[index];
  },

  // Delete customer
  deleteCustomer: async (id: string) => {
    await delay(500);
    const index = mockCustomers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    mockCustomers.splice(index, 1);
  },

  // Get customer statistics
  getCustomerStatistics: async (id: string) => {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer.statistics;
  },

  // Add customer tag
  addCustomerTag: async (id: string, tag: string) => {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (!customer.tags.includes(tag)) {
      customer.tags.push(tag);
    }
    return customer;
  },

  // Remove customer tag
  removeCustomerTag: async (id: string, tag: string) => {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    customer.tags = customer.tags.filter(t => t !== tag);
    return customer;
  },

  // Update customer location
  updateCustomerLocation: async (
    id: string,
    location: { latitude: number; longitude: number }
  ) => {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    customer.location = location;
    return customer;
  },
};

export default customerService;
