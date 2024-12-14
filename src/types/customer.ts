export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  distance?: number;
  status: string;
  address: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
};

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
