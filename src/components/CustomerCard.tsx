import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../types/customer';

type CustomerCardProps = {
  customer: Customer;
  onPress: (customer: Customer) => void;
};

const CustomerCard = memo<CustomerCardProps>(({ customer, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={() => onPress(customer)}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>{customer.name}</Text>
            {customer.distance !== undefined && (
              <View style={[
                styles.distanceContainer,
                { backgroundColor: theme.colors.primaryContainer }
              ]}>
                <IconMC 
                  name="map-marker-distance" 
                  size={16} 
                  color={theme.colors.primary} 
                />
                <Text 
                  variant="bodySmall" 
                  style={[styles.distance, { color: theme.colors.primary }]}
                >
                  {customer.distance.toFixed(1)} km
                </Text>
              </View>
            )}
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>{customer.company}</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurface }}>{customer.email}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distance: {
    marginLeft: 4,
  },
});

CustomerCard.displayName = 'CustomerCard';

export default CustomerCard;
