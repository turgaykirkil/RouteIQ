export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: CustomerAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    sortBy: 'name' | 'company' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  };
}

export type CustomerFilters = CustomerState['filters'];

export type CustomerSortField = CustomerFilters['sortBy'];
export type SortOrder = CustomerFilters['sortOrder'];
