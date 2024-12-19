import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { customerService } from '../services/customerService';
import { calculateDistance } from '../utils/geoUtils';
import { Customer } from '../types/customer';
import { RootState } from '../store/store';
import { useLocation } from './useLocation';

export const useCustomers = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { location } = useLocation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userRole = user?.role || '';
      const userId = user?.id || '';
      const response = await customerService.getCustomers(userRole, userId);
      
      if (location) {
        const customersWithDistance = response.map(customer => ({
          ...customer,
          distance: customer.address?.coordinates ? Number(calculateDistance(
            location.lat,
            location.lon,
            customer.address.coordinates.lat,
            customer.address.coordinates.lng
          ).toFixed(1)) : undefined
        }));
        
        // Sort customers by distance
        customersWithDistance.sort((a, b) => {
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });
        
        setCustomers(customersWithDistance);
      } else {
        setCustomers(response);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Müşteriler yüklenirken bir hata oluştu';
      setError(errorMessage);
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [location, user]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const searchCustomers = useCallback((searchQuery: string) => {
    if (!searchQuery) return customers;
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return customers.filter(customer => {
      const searchableText = `${customer.name} ${customer.company} ${customer.email}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }, [customers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    searchCustomers,
  };
};
