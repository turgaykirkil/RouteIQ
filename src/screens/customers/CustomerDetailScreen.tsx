import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Button, Portal, Dialog, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import { useCustomerDetail } from '../../hooks/useCustomerDetail';
import { useCustomerActions } from '../../hooks/useCustomerActions';
import CustomerProfile from '../../components/customer/CustomerProfile';
import CustomerContact from '../../components/customer/CustomerContact';
import CustomerOverview from '../../components/customer/CustomerOverview';
import CustomerTasks from '../../components/customer/CustomerTasks';
import CustomerNotes from '../../components/customer/CustomerNotes';

interface CustomerDetailScreenProps {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerDetail'>;
  route: RouteProp<CustomerStackParamList, 'CustomerDetail'>;
}

const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  const { customer, loading, error } = useCustomerDetail({
    customerId: route.params?.customerId,
    customerData: route.params?.customerData,
  });

  const { handleCall, handleEmail, handleOpenMaps } = useCustomerActions(customer);

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <Text>{error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.errorButton}>
          Go Back
        </Button>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <CustomerProfile
            customer={customer}
            onCall={handleCall}
            onEmail={handleEmail}
            onOpenMaps={handleOpenMaps}
          />
        </Card>

        <Card style={styles.card}>
          <CustomerContact customer={customer} />
        </Card>

        <Card style={styles.card}>
          <CustomerOverview customer={customer} />
        </Card>

        <Card style={styles.card}>
          <CustomerTasks
            customer={customer}
            onSeeAll={() => navigation.navigate('Tasks', { customerId: customer?.id })}
          />
        </Card>

        <Card style={[styles.card, styles.lastCard]}>
          <CustomerNotes customer={customer} />
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}
        >
          <Dialog.Title>Delete Customer</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this customer?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => {}}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  lastCard: {
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 16,
  },
});

export default CustomerDetailScreen;
