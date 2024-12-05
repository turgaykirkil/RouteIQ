import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet
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
import { customerAPI } from '../../services/api';
import theme from '../../theme';

type CustomerListScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerList'>;
};

type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
};

const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ navigation }) => {
  const themeWithCustom = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: ['active', 'inactive', 'pending'],
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const customers = await customerAPI.getAll();
        console.log('Customers fetched:', customers);
        setCustomers(customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}>
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                subtitle={item.company}
                //left={(props) => <Avatar.Text {...props} label={item.name.charAt(0)} />}
              />
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 8,
  },
});

export default CustomerListScreen;
