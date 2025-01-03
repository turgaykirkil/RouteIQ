import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import CustomerListScreen from '../screens/customers/CustomerListScreen';
import CustomerDetailScreen from '../screens/customers/CustomerDetailScreen';
import NewCustomerScreen from '../screens/customers/NewCustomerScreen';
import EditCustomerScreen from '../screens/customers/EditCustomerScreen';
import CustomerMapScreen from '../screens/customers/CustomerMapScreen';
import CustomerAnalyticsScreen from '../screens/analytics/CustomerAnalyticsScreen';
import { CustomerStackParamList } from './types';

const Stack = createNativeStackNavigator<CustomerStackParamList>();

// Sabit ekran konfigürasyonları
const CUSTOMER_SCREEN_CONFIG = Object.freeze({
  CustomerList: {
    title: 'Müşteriler',
    component: CustomerListScreen
  },
  CustomerDetail: {
    title: 'Müşteri Detayı',
    component: CustomerDetailScreen
  },
  NewCustomer: {
    title: 'Yeni Müşteri',
    component: NewCustomerScreen
  },
  EditCustomer: {
    title: 'Müşteri Düzenle',
    component: EditCustomerScreen
  },
  CustomerMap: {
    title: 'Müşteri Haritası',
    component: CustomerMapScreen
  },
  CustomerAnalytics: {
    title: 'Müşteri Analizi',
    component: CustomerAnalyticsScreen
  }
});

const CustomerNavigator = React.memo(() => {
  const theme = useTheme();

  // Navigator seçeneklerini memoize et
  const navigatorScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    // Performans için ek ayarlar
    animation: 'slide_from_right',
    gestureEnabled: true,
    detachInactiveScreens: true
  }), [theme]);

  // Ekran tanımlamalarını memoize et
  const CustomerScreens = useMemo(() => (
    Object.entries(CUSTOMER_SCREEN_CONFIG).map(([name, config]) => (
      <Stack.Screen
        key={name}
        name={name as keyof CustomerStackParamList}
        component={config.component}
        options={{
          title: config.title,
          lazy: true
        }}
      />
    ))
  ), []);

  return (
    <Stack.Navigator
      screenOptions={navigatorScreenOptions}
      // Performans için ek ayarlar
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      {CustomerScreens}
    </Stack.Navigator>
  );
});

export default CustomerNavigator;
