import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import CustomerListScreen from '../screens/customers/CustomerListScreen';
import CustomerDetailScreen from '../screens/customers/CustomerDetailScreen';
import NewCustomerScreen from '../screens/customers/NewCustomerScreen';
import EditCustomerScreen from '../screens/customers/EditCustomerScreen';
import CustomerMapScreen from '../screens/customers/CustomerMapScreen';
import CustomerAnalyticsScreen from '../screens/analytics/CustomerAnalyticsScreen';
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
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={{
          title: 'Müşteriler',
        }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{
          title: 'Müşteri Detayı',
        }}
      />
      <Stack.Screen
        name="NewCustomer"
        component={NewCustomerScreen}
        options={{
          title: 'Yeni Müşteri',
        }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{
          title: 'Müşteri Düzenle',
        }}
      />
      <Stack.Screen
        name="CustomerMap"
        component={CustomerMapScreen}
        options={{
          title: 'Müşteri Haritası',
        }}
      />
      <Stack.Screen
        name="CustomerAnalytics"
        component={CustomerAnalyticsScreen}
        options={{
          title: 'Müşteri Analizi',
        }}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigator;
