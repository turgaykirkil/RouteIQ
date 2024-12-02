import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Searchbar,
  Card,
  Avatar,
  FAB,
  Chip,
  Menu,
  IconButton,
  Portal,
  Modal,
  Button,
  List,
  Divider,
  useTheme,
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCustomers, selectCustomers, selectLoading } from '../../store/slices/customerSlice';

type CustomerListScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerList'>;
};

type FilterOptions = {
  status: ('active' | 'inactive' | 'pending')[];
  sortBy: 'name' | 'lastVisit' | 'company';
  sortOrder: 'asc' | 'desc';
};

const CustomerListScreen = ({ navigation }: CustomerListScreenProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);
  const loading = useAppSelector(selectLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: ['active', 'inactive', 'pending'],
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        header: {
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          elevation: 4,
        },
        searchBar: {
          flex: 1,
          marginRight: 8,
        },
        list: {
          padding: 16,
        },
        card: {
          marginBottom: 16,
          elevation: 2,
        },
        cardRight: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        statusChip: {
          marginRight: 8,
        },
        lastVisit: {
          marginTop: 8,
          color: theme.colors.onSurfaceVariant,
        },
        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        },
        modalContent: {
          backgroundColor: theme.colors.surface,
          padding: 20,
          margin: 20,
          borderRadius: 8,
        },
        divider: {
          marginVertical: 16,
        },
        chipContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 8,
        },
        filterChip: {
          margin: 4,
        },
        sortSection: {
          marginTop: 16,
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 24,
        },
        button: {
          marginLeft: 8,
        },
      }),
    [theme]
  );

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    dispatch(fetchCustomers());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomers();
    setRefreshing(false);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status.includes(customer.status);

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const sortValue = filters.sortBy;
    const modifier = filters.sortOrder === 'asc' ? 1 : -1;

    if (sortValue === 'lastVisit') {
      return (new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime()) * modifier;
    }

    return a[sortValue].localeCompare(b[sortValue]) * modifier;
  });

  const renderCustomerCard = ({ item: customer }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CustomerDetail', { customerId: customer.id })}
    >
      <Card style={styles.card}>
        <Card.Title
          title={customer.name}
          subtitle={customer.company}
          left={(props) => (
            <Avatar.Text
              {...props}
              label={customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            />
          )}
          right={(props) => (
            <View style={styles.cardRight}>
              <Chip
                mode="outlined"
                style={[
                  styles.statusChip,
                  {
                    borderColor:
                      customer.status === 'active'
                        ? theme.colors.primary
                        : customer.status === 'inactive'
                        ? theme.colors.error
                        : theme.colors.warning,
                  },
                ]}
              >
                {customer.status}
              </Chip>
              <IconButton
                {...props}
                icon="dots-vertical"
                onPress={() => navigation.navigate('CustomerDetail', { customerId: customer.id })}
              />
            </View>
          )}
        />
        <Card.Content>
          <Text>{customer.email}</Text>
          <Text>{customer.phone}</Text>
          <Text style={styles.lastVisit}>Last Visit: {new Date(customer.lastVisit).toLocaleDateString()}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search customers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <IconButton
          icon="filter-variant"
          onPress={() => setFilterModalVisible(true)}
          mode="contained"
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('NewCustomer')}
        style={styles.fab}
      />

      <Portal>
        <Modal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text variant="headlineSmall">Filters</Text>
          <Divider style={styles.divider} />

          <List.Section>
            <List.Subheader>Status</List.Subheader>
            <View style={styles.chipContainer}>
              {(['active', 'inactive', 'pending'] as const).map((status) => (
                <Chip
                  key={status}
                  selected={filters.status.includes(status)}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter((s) => s !== status)
                        : [...prev.status, status],
                    }));
                  }}
                  style={styles.filterChip}
                >
                  {status}
                </Chip>
              ))}
            </View>
          </List.Section>

          <List.Section>
            <List.Subheader>Sort By</List.Subheader>
            <View style={styles.chipContainer}>
              {[
                { label: 'Name', value: 'name' },
                { label: 'Last Visit', value: 'lastVisit' },
                { label: 'Company', value: 'company' },
              ].map(({ label, value }) => (
                <Chip
                  key={value}
                  selected={filters.sortBy === value}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: value as FilterOptions['sortBy'],
                    }));
                  }}
                  style={styles.filterChip}
                >
                  {label}
                </Chip>
              ))}
            </View>
          </List.Section>

          <List.Section>
            <List.Subheader>Sort Order</List.Subheader>
            <View style={styles.chipContainer}>
              {[
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
              ].map(({ label, value }) => (
                <Chip
                  key={value}
                  selected={filters.sortOrder === value}
                  onPress={() => {
                    setFilters((prev) => ({
                      ...prev,
                      sortOrder: value as FilterOptions['sortOrder'],
                    }));
                  }}
                  style={styles.filterChip}
                >
                  {label}
                </Chip>
              ))}
            </View>
          </List.Section>

          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => {
                setFilters({
                  status: ['active', 'inactive', 'pending'],
                  sortBy: 'name',
                  sortOrder: 'asc',
                });
              }}
              style={styles.button}
            >
              Reset
            </Button>
            <Button
              mode="contained"
              onPress={() => setFilterModalVisible(false)}
              style={styles.button}
            >
              Apply
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

export default CustomerListScreen;
