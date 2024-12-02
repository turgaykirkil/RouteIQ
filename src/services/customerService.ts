import { Customer } from '../types/customer';

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Tech Corp',
    email: 'john@techcorp.com',
    phone: '(555) 123-4567',
    status: 'active',
    lastVisit: '2024-01-15',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    tags: ['VIP', 'Tech'],
    notes: 'Key account in the tech sector',
    statistics: {
      totalOrders: 25,
      totalRevenue: 50000,
      averageOrderValue: 2000,
      lastOrderDate: '2024-01-10',
    },
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Innovation Labs',
    email: 'jane@innovationlabs.com',
    phone: '(555) 987-6543',
    status: 'active',
    lastVisit: '2024-01-20',
    address: {
      street: '456 Market St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    tags: ['Innovation', 'Labs'],
    notes: 'Interested in new product line',
    statistics: {
      totalOrders: 10,
      totalRevenue: 10000,
      averageOrderValue: 1000,
      lastOrderDate: '2024-01-05',
    },
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  // Fetch all customers with optional filters
  getCustomers: async (filters?: {
    search?: string;
    status?: string[];
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    await delay(500);
    let filteredCustomers = [...mockCustomers];

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(
          customer =>
            customer.name.toLowerCase().includes(searchLower) ||
            customer.company.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower)
        );
      }

      if (filters.status && filters.status.length > 0) {
        filteredCustomers = filteredCustomers.filter(customer =>
          filters.status?.includes(customer.status)
        );
      }

      if (filters.tags && filters.tags.length > 0) {
        filteredCustomers = filteredCustomers.filter(customer =>
          customer.tags.some(tag => filters.tags?.includes(tag))
        );
      }

      if (filters.sortBy) {
        const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
        filteredCustomers.sort((a, b) => {
          if (filters.sortBy === 'name') {
            return a.name.localeCompare(b.name) * sortOrder;
          }
          if (filters.sortBy === 'lastVisit') {
            return (
              (new Date(a.lastVisit).getTime() -
                new Date(b.lastVisit).getTime()) *
              sortOrder
            );
          }
          if (filters.sortBy === 'company') {
            return a.company.localeCompare(b.company) * sortOrder;
          }
          return 0;
        });
      }
    }

    return filteredCustomers;
  },

  // Get customer by ID
  getCustomerById: async (id: string) => {
    await delay(300);
    const customer = mockCustomers.find(c => c.id === id);
    if (!customer) {
      throw new Error('Customer not found');
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
