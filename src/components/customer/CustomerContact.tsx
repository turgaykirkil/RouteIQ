import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../../types/customer';

interface CustomerContactProps {
  customer: Customer | null;
}

const CustomerContact = memo<CustomerContactProps>(({ customer }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <View style={styles.detailItem}>
        <Icon name="phone" size={20} color={theme.colors.primary} />
        <Text style={styles.detailText}>{customer?.phone || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Icon name="email" size={20} color={theme.colors.primary} />
        <Text style={styles.detailText}>{customer?.email || 'N/A'}</Text>
      </View>
      <View style={styles.detailItem}>
        <Icon name="map-marker" size={20} color={theme.colors.primary} />
        <Text style={styles.detailText}>
          {customer?.address ? `${customer.address.street}, ${customer.address.city}` : 'N/A'}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
});

CustomerContact.displayName = 'CustomerContact';

export default CustomerContact;
