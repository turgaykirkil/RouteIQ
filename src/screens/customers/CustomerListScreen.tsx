import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';
import { useCustomers } from '../../hooks/useCustomers';

import CustomerListSearchBar from '../../components/customers/CustomerListSearchBar';
import CustomerListContent from '../../components/customers/CustomerListContent';
import CustomerListFAB from '../../components/customers/CustomerListFAB';

const CustomerListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CustomerStackNavigationProp>();
  const { customers, loading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="map"
            iconColor={theme.colors.surface}
            size={24}
            onPress={() => navigation.navigate('CustomerMap')}
          />
          <IconButton
            icon="chart-bar"
            iconColor={theme.colors.surface}
            size={24}
            onPress={() => navigation.navigate('CustomerAnalytics')}
          />
        </View>
      ),
    });
  }, [navigation, theme.colors]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomerListSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <CustomerListContent
          customers={customers}
          loading={loading}
          searchQuery={searchQuery}
          onCustomerSelect={setSelectedCustomer}
          onCallModalToggle={setIsCallModalVisible}
        />
        <CustomerListFAB />
      </View>
    </SafeAreaView>
  );
};

export default CustomerListScreen;