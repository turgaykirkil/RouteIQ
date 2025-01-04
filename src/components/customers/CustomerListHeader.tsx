import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';

const CustomerListHeader: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CustomerStackNavigationProp>();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          padding: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        headerTitle: {
          fontSize: 20,
          fontWeight: '600',
          color: theme.colors.onSurface,
        },
        headerActions: {
          flexDirection: 'row',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Müşteriler</Text>
      <View style={styles.headerActions}>
        <IconButton
          icon="map"
          iconColor={theme.colors.onSurface}
          size={24}
          onPress={() => navigation.navigate('CustomerMap')}
        />
        <IconButton
          icon="chart-bar"
          iconColor={theme.colors.onSurface}
          size={24}
          onPress={() => navigation.navigate('CustomerAnalytics')}
        />
      </View>
    </View>
  );
};

export default CustomerListHeader;
