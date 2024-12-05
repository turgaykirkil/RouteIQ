import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  Portal,
  Dialog,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import db from '../../../db.json';
import theme from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import customerService from '../../services/customerService'; // Import customerService

// Define props for the CustomerDetailScreen
interface CustomerDetailScreenProps {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerDetail'>;
  route: RouteProp<CustomerStackParamList, 'CustomerDetail'>;
}

const CustomerDetailScreen: React.FC<CustomerDetailScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [customer, setCustomer] = useState(null);

  const loggedInUser = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (loggedInUser) {
      console.log('Logged in user:', loggedInUser);
      const filteredCustomers = db.customers.filter(
        c => loggedInUser.canViewAll || c.salesRepId === loggedInUser.id
      );
      console.log('Filtered customers:', filteredCustomers);
      // API çağrısı örneği
      customerService.getCustomers({ userId: loggedInUser.id }).then(response => {
        console.log('API Response:', response);
        setCustomer(response);
      }).catch(error => {
        console.error('API Error:', error);
      });
    }
  }, [loggedInUser]);

  const handleCall = () => {
    if (customer && customer.phone) {
      // Linking.openURL(`tel:${customer.phone}`);
    }
  };

  const handleEmail = () => {
    if (customer && customer.email) {
      // Linking.openURL(`mailto:${customer.email}`);
    }
  };

  const handleMap = () => {
    if (customer && customer.address) {
      const address = encodeURIComponent(`${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}, ${customer.address.country}`);
      // Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={80}
                label={customer ? customer.name.split(' ').map((n) => n[0]).join('') : 'N/A'}
                backgroundColor={theme.colors.primary}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.nameText}>{customer && customer.name ? customer.name : 'N/A'}</Text>
                <Text style={styles.companyText}>{customer && customer.company ? customer.company : 'N/A'}</Text>
                <View style={styles.statusContainer}>
                  <Icon
                    name="circle"
                    size={12}
                    color={customer && customer.status === 'active' ? theme.colors.success : theme.colors.error}
                  />
                  <Text style={styles.statusText}>{customer && customer.status ? customer.status.charAt(0).toUpperCase() + customer.status.slice(1) : 'N/A'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                icon="phone"
                onPress={handleCall}
                style={styles.actionButton}
              >
                Call
              </Button>
              <Button
                mode="contained"
                icon="email"
                onPress={handleEmail}
                style={styles.actionButton}
              >
                Email
              </Button>
              <Button
                mode="contained"
                icon="map-marker"
                onPress={handleMap}
                style={styles.actionButton}
              >
                Map
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.detailItem}>
              <Icon name="phone" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{customer && customer.phone ? customer.phone : 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="email" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{customer && customer.email ? customer.email : 'N/A'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{customer && customer.address ? `${customer.address.street}, ${customer.address.city}` : 'N/A'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Business Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{customer && customer.totalOrders !== undefined ? customer.totalOrders : 'N/A'}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{customer && customer.totalRevenue !== undefined ? `$${customer.totalRevenue.toLocaleString()}` : 'N/A'}</Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {customer && customer.assignedTasks ? customer.assignedTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Icon
                  name={task.status === 'completed' ? 'checkbox-marked-circle' : 'clock-outline'}
                  size={20}
                  color={task.status === 'completed' ? theme.colors.success : theme.colors.accent}
                />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDate}>Due: {task.dueDate}</Text>
                </View>
              </View>
            )) : <Text style={styles.notesText}>N/A</Text>}
          </Card.Content>
        </Card>

        <Card style={[styles.detailsCard, styles.lastCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{customer && customer.notes ? customer.notes : 'N/A'}</Text>
          </Card.Content>
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

// Define styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    margin: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileInfo: {
    marginLeft: 16,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  companyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    margin: 8,
  },
  detailsCard: {
    margin: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  verticalDivider: {
    height: '100%',
    width: 1,
    backgroundColor: theme.colors.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  seeAllText: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskInfo: {
    marginLeft: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDate: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  notesText: {
    fontSize: 16,
    padding: 16,
  },
  lastCard: {
    marginBottom: 16,
  },
});

export default CustomerDetailScreen;
