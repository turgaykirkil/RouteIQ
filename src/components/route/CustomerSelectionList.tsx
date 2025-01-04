import React, { useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../../types/customer';
import { useCustomers } from '../../hooks/useCustomers';

interface CustomerSelectionListProps {
  selectedPoints: Array<{customer: Customer, order: number}>;
  onCustomerPress: (customer: Customer) => void;
}

const CustomerSelectionList: React.FC<CustomerSelectionListProps> = ({ 
  selectedPoints, 
  onCustomerPress 
}) => {
  const theme = useTheme();
  const { customers, loading, error } = useCustomers();

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(customer => 
      customer?.address?.coordinates?.lat && 
      customer?.address?.coordinates?.lng
    );
  }, [customers]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      maxHeight: 250,
      backgroundColor: theme.colors.background,
    },
    customerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    customerName: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
    },
    selectedIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: 'bold',
    },
  }), [theme]);

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const isSelected = selectedPoints.some(point => point.customer.id === item.id);
    const selectedOrder = selectedPoints.find(point => point.customer.id === item.id)?.order;

    return (
      <TouchableOpacity 
        style={styles.customerItem} 
        onPress={() => onCustomerPress(item)}
      >
        <MaterialCommunityIcons 
          name={isSelected ? 'checkbox-marked' : 'checkbox-blank-outline'} 
          size={24} 
          color={isSelected ? theme.colors.primary : theme.colors.onSurface} 
        />
        <Text style={styles.customerName}>{item.name}</Text>
        {isSelected && (
          <View 
            style={[
              styles.selectedIndicator, 
              { backgroundColor: theme.colors.primary }
            ]}
          >
            <Text style={styles.selectedText}>{selectedOrder}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text>Müşteri bulunamadı veya koordinatları eksik</Text>
        }
      />
    </View>
  );
};

export default React.memo(CustomerSelectionList);
