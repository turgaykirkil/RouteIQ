import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Menu, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { TaskFormValues } from '../../types/task';

interface NewTaskCustomerSelectProps {
  formik: FormikProps<TaskFormValues>;
  customers: Array<{ id: string; name: string }>;
}

const NewTaskCustomerSelect: React.FC<NewTaskCustomerSelectProps> = ({ 
  formik, 
  customers 
}) => {
  const theme = useTheme();
  const [customerMenuVisible, setCustomerMenuVisible] = React.useState(false);

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        marginTop: 16,
      },
      selectButton: {
        marginBottom: 4,
      },
      label: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
      },
    }),
    [theme]
  );

  const handleCustomerSelect = (customer: { id: string; name: string }) => {
    formik.setFieldValue('customerId', customer.id);
    formik.setFieldValue('customerName', customer.name);
    setCustomerMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Müşteri Seç</Text>
      <Menu
        visible={customerMenuVisible}
        onDismiss={() => setCustomerMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setCustomerMenuVisible(true)}>
            <Button
              mode="outlined"
              style={styles.selectButton}
            >
              {formik.values.customerName || 'Müşteri Seçiniz'}
            </Button>
          </TouchableOpacity>
        }
      >
        {customers.map((customer) => (
          <Menu.Item
            key={customer.id}
            onPress={() => handleCustomerSelect(customer)}
            title={customer.name}
          />
        ))}
      </Menu>
    </View>
  );
};

export default NewTaskCustomerSelect;
