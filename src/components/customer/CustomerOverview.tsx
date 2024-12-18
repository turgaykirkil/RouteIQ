import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { Customer } from '../../types/customer';

interface CustomerOverviewProps {
  customer: Customer | null;
}

const CustomerOverview = memo<CustomerOverviewProps>(({ customer }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Business Overview</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {customer?.totalOrders !== undefined ? customer.totalOrders : 'N/A'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total Orders
          </Text>
        </View>
        <Divider style={[styles.verticalDivider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {customer?.totalRevenue !== undefined ? `$${customer.totalRevenue.toLocaleString()}` : 'N/A'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total Revenue
          </Text>
        </View>
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
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 8,
  },
});

CustomerOverview.displayName = 'CustomerOverview';

export default CustomerOverview;
