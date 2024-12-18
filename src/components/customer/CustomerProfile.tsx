import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../../types/customer';

interface CustomerProfileProps {
  customer: Customer | null;
  onCall: () => void;
  onEmail: () => void;
  onOpenMaps: () => void;
}

const CustomerProfile = memo<CustomerProfileProps>(({
  customer,
  onCall,
  onEmail,
  onOpenMaps
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={customer ? customer.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
          backgroundColor={theme.colors.primary}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.nameText}>{customer?.name || 'N/A'}</Text>
          <Text style={styles.companyText}>{customer?.company || 'N/A'}</Text>
          <View style={styles.statusContainer}>
            <Icon
              name="circle"
              size={12}
              color={customer?.status === 'active' ? theme.colors.success : theme.colors.error}
            />
            <Text style={styles.statusText}>
              {customer?.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="phone"
          onPress={onCall}
          style={styles.actionButton}
        >
          Call
        </Button>
        <Button
          mode="contained"
          icon="email"
          onPress={onEmail}
          style={styles.actionButton}
        >
          Email
        </Button>
        <Button
          mode="contained"
          icon="map-marker"
          onPress={onOpenMaps}
          style={styles.actionButton}
        >
          Map
        </Button>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

CustomerProfile.displayName = 'CustomerProfile';

export default CustomerProfile;
