import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import {
  Text,
  useTheme,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Swipeable } from 'react-native-gesture-handler';

interface CustomerListContentProps {
  customers: any[];
  loading: boolean;
  searchQuery: string;
  onCustomerSelect?: (customer: any) => void;
  onCallModalToggle?: (visible: boolean) => void;
}

const CustomerListContent: React.FC<CustomerListContentProps> = ({
  customers,
  loading,
  searchQuery,
  onCustomerSelect,
  onCallModalToggle,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<CustomerStackNavigationProp>();

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        customerListContainer: {
          paddingVertical: 8,
        },
        customerItem: {
          backgroundColor: theme.colors.surface,
          marginHorizontal: 16,
          marginVertical: 6,
          padding: 16,
          borderRadius: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          flexDirection: 'row',
          alignItems: 'center',
        },
        customerInfo: {
          flex: 1,
          marginLeft: 12,
        },
        customerHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        },
        customerName: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.onSurface,
          flex: 1,
          marginRight: 8,
        },
        customerType: {
          fontSize: 12,
          color: theme.colors.primary,
          fontWeight: '500',
        },
        customerDetails: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
        },
        detailText: {
          fontSize: 13,
          color: theme.colors.onSurfaceVariant,
          marginLeft: 4,
        },
        detailContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 16,
        },
        distanceContainer: {
          marginRight: 0,
          marginLeft: 'auto',
        },
        detailIcon: {
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
        },
        emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        },
        emptyText: {
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: 8,
        },
        emptyIcon: {
          marginBottom: 12,
          opacity: 0.7,
        },
        avatar: {
          backgroundColor: theme.colors.primaryContainer,
        },
        rightActions: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 6,
          marginLeft: -8,
        },
        actionButton: {
          justifyContent: 'center',
          alignItems: 'center',
          width: 64,
          height: '100%',
        },
        actionButtonCall: {
          backgroundColor: theme.colors.primary,
        },
        actionButtonMap: {
          backgroundColor: theme.colors.secondary,
        },
      }),
    [theme]
  );

  const handleCall = (customer: any) => {
    if (onCustomerSelect) {
      onCustomerSelect(customer);
    }
    if (onCallModalToggle) {
      onCallModalToggle(true);
    }
    // Optional: Direct call functionality
    if (customer.phone) {
      Linking.openURL(`tel:${customer.phone}`).catch(() => {
        Alert.alert('Hata', 'Arama yapılamadı.');
      });
    }
  };

  const renderRightActions = (customer: any) => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.actionButtonCall]}
        onPress={() => handleCall(customer)}
      >
        <MaterialCommunityIcons name="phone" color="white" size={24} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.actionButtonMap]}
        onPress={() => navigation.navigate('CustomerMap', { customerId: customer.id })}
      >
        <MaterialCommunityIcons name="map-marker" color="white" size={24} />
      </TouchableOpacity>
    </View>
  );

  const renderCustomerItem = (customer: any) => (
    <Swipeable renderRightActions={() => renderRightActions(customer)} key={customer.id}>
      <TouchableOpacity
        style={styles.customerItem}
        onPress={() => navigation.navigate('CustomerDetail', { customerId: customer.id })}
      >
        <Avatar.Text
          size={48}
          label={customer.name.charAt(0).toUpperCase()}
          style={styles.avatar}
        />
        <View style={styles.customerInfo}>
          <View style={styles.customerHeader}>
            <Text style={styles.customerName} numberOfLines={1}>
              {customer.name}
            </Text>
            <Text style={styles.customerType}>{customer.type}</Text>
          </View>
          <View style={styles.customerDetails}>
            <View style={styles.detailContainer}>
              <MaterialCommunityIcons
                name="phone"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>{customer.phone}</Text>
            </View>
            <View style={[styles.detailContainer, styles.distanceContainer]}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>5 km</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (filteredCustomers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="account-search"
          size={64}
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>
          Hiçbir müşteri bulunamadı. {searchQuery && `"${searchQuery}" ile eşleşen sonuç yok.`}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.customerListContainer}
      showsVerticalScrollIndicator={false}
    >
      {filteredCustomers.map(renderCustomerItem)}
    </ScrollView>
  );
};

export default CustomerListContent;
