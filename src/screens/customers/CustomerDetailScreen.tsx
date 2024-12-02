import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
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
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../theme';

type CustomerDetailScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerDetail'>;
  route: RouteProp<CustomerStackParamList, 'CustomerDetail'>;
};

const mockCustomer = {
  id: '1',
  name: 'John Doe',
  company: 'Tech Corp',
  email: 'john@techcorp.com',
  phone: '(555) 123-4567',
  address: '123 Business St, Tech City, TC 12345',
  status: 'active',
  lastVisit: '2024-01-15',
  notes: 'Key decision maker for enterprise solutions.',
  totalOrders: 12,
  totalRevenue: 25000,
  assignedTasks: [
    {
      id: '1',
      title: 'Follow up on proposal',
      dueDate: '2024-01-20',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Schedule product demo',
      dueDate: '2024-01-25',
      status: 'completed',
    },
  ],
};

const CustomerDetailScreen = ({ navigation, route }: CustomerDetailScreenProps) => {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${mockCustomer.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${mockCustomer.email}`);
  };

  const handleMap = () => {
    const address = encodeURIComponent(mockCustomer.address);
    Linking.openURL(`https://maps.google.com/?q=${address}`);
  };

  const handleDelete = () => {
    // TODO: Implement delete logic
    setDeleteDialogVisible(false);
    navigation.goBack();
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        profileCard: {
          margin: theme.spacing.md,
          ...theme.shadows.small,
        },
        profileHeader: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        profileInfo: {
          flex: 1,
          marginLeft: theme.spacing.md,
        },
        nameText: {
          ...theme.typography.h2,
          color: theme.colors.text,
        },
        companyText: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
        statusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: theme.spacing.xs,
        },
        statusText: {
          ...theme.typography.caption,
          color: theme.colors.text,
          marginLeft: theme.spacing.xs,
        },
        actionButtons: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: theme.spacing.lg,
        },
        actionButton: {
          flex: 1,
          marginHorizontal: theme.spacing.xs,
        },
        detailsCard: {
          margin: theme.spacing.md,
          marginBottom: 0,
          ...theme.shadows.small,
        },
        lastCard: {
          marginBottom: theme.spacing.md,
        },
        sectionTitle: {
          ...theme.typography.h2,
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
        },
        detailItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        },
        detailText: {
          ...theme.typography.body,
          color: theme.colors.text,
          marginLeft: theme.spacing.md,
          flex: 1,
        },
        statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        },
        statItem: {
          alignItems: 'center',
        },
        statNumber: {
          ...theme.typography.h2,
          color: theme.colors.primary,
        },
        statLabel: {
          ...theme.typography.caption,
          color: theme.colors.text,
        },
        verticalDivider: {
          height: '100%',
          width: 1,
          backgroundColor: theme.colors.border,
        },
        sectionHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        },
        seeAllText: {
          color: theme.colors.primary,
          ...theme.typography.body,
        },
        taskItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        },
        taskInfo: {
          marginLeft: theme.spacing.md,
          flex: 1,
        },
        taskTitle: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
        taskDate: {
          ...theme.typography.caption,
          color: theme.colors.placeholder,
        },
        notesText: {
          ...theme.typography.body,
          color: theme.colors.text,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={80}
                label={mockCustomer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
                backgroundColor={theme.colors.primary}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.nameText}>{mockCustomer.name}</Text>
                <Text style={styles.companyText}>{mockCustomer.company}</Text>
                <View style={styles.statusContainer}>
                  <Icon
                    name="circle"
                    size={12}
                    color={
                      mockCustomer.status === 'active'
                        ? theme.colors.success
                        : theme.colors.error
                    }
                  />
                  <Text style={styles.statusText}>
                    {mockCustomer.status.charAt(0).toUpperCase() +
                      mockCustomer.status.slice(1)}
                  </Text>
                </View>
              </View>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <IconButton
                    icon="dots-vertical"
                    size={24}
                    onPress={() => setMenuVisible(true)}
                  />
                }
              >
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate('CustomerDetail', {
                      customerId: mockCustomer.id,
                    });
                  }}
                  title="Edit"
                  leadingIcon="pencil"
                />
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    setDeleteDialogVisible(true);
                  }}
                  title="Delete"
                  leadingIcon="delete"
                />
              </Menu>
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
              <Text style={styles.detailText}>{mockCustomer.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="email" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{mockCustomer.email}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon name="map-marker" size={20} color={theme.colors.primary} />
              <Text style={styles.detailText}>{mockCustomer.address}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Business Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{mockCustomer.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <Divider style={styles.verticalDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  ${mockCustomer.totalRevenue.toLocaleString()}
                </Text>
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
            {mockCustomer.assignedTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <Icon
                  name={
                    task.status === 'completed'
                      ? 'checkbox-marked-circle'
                      : 'clock-outline'
                  }
                  size={20}
                  color={
                    task.status === 'completed'
                      ? theme.colors.success
                      : theme.colors.accent
                  }
                />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDate}>Due: {task.dueDate}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={[styles.detailsCard, styles.lastCard]}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{mockCustomer.notes}</Text>
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
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CustomerDetailScreen;
