import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';

const CustomerListFAB: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CustomerStackNavigationProp>();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        },
      }),
    [theme]
  );

  return (
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() => navigation.navigate('NewCustomer')}
    />
  );
};

export default CustomerListFAB;
