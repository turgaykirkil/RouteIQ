import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerListScreen from '../screens/customers/CustomerListScreen';
import CustomerDetailScreen from '../screens/customers/CustomerDetailScreen';
import NewCustomerScreen from '../screens/customers/NewCustomerScreen';
import CustomerMapScreen from '../screens/customers/CustomerMapScreen';
import { useTheme } from 'react-native-paper';
import { CustomerStackParamList } from './types';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

const CustomerNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{
          title: 'Customers',
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          title: 'Customer Details',
        }}
      />
      <Stack.Screen
        name="NewCustomer"
        component={NewCustomerScreen}
        options={{
          title: 'New Customer',
        }}
      />
      <Stack.Screen
        name="CustomerMap"
        component={CustomerMapScreen}
        options={{
          title: 'Customer Map',
        }}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigator;
