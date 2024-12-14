import React, { useState, useCallback } from 'react';
import { View, SafeAreaView, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { Customer } from '../../types/customer';
import { useCustomers } from '../../hooks/useCustomers';
import { useSearch } from '../../hooks/useSearch';
import CustomerList from '../../components/CustomerList';
import SearchBar from '../../components/SearchBar';

type CustomerListScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerList'>;
};

const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  
  const { customers, loading, fetchCustomers } = useCustomers();
  const { searchQuery, setSearchQuery, filteredItems: filteredCustomers } = useSearch<Customer>(
    customers,
    ['name', 'company', 'email']
  );

  const handleCustomerPress = useCallback((customer: Customer) => {
    navigation.navigate('CustomerDetail', {
      customerId: customer.id,
      customerData: customer
    });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  }, [fetchCustomers]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <View style={[styles.header, {
          backgroundColor: theme.colors.surface,
          shadowColor: Platform.OS === 'ios' ? '#000' : undefined,
          elevation: Platform.OS === 'android' ? 4 : undefined,
          shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : undefined,
          shadowOpacity: Platform.OS === 'ios' ? 0.25 : undefined,
          shadowRadius: Platform.OS === 'ios' ? 3.84 : undefined,
        }]}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Müşteri ara..."
          />
        </View>

        <CustomerList
          customers={filteredCustomers}
          onCustomerPress={handleCustomerPress}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomerListScreen;
