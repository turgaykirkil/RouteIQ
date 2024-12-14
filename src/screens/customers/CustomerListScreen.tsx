import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
  Linking,
  ScrollView,
  ActivityIndicator
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
  Icon
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { customerService } from '../../services/customerService';
import theme from '../../theme';
import { calculateDistance } from '../../utils/geoUtils';
import Geolocation from '@react-native-community/geolocation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

type CustomerListScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerList'>;
};

type Customer = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  distance?: number;
  status: string;
  address: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
};

const CustomerListScreen: React.FC<CustomerListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const userRole = user?.role || '';
      const userId = user?.id || '';
      const response = await customerService.getCustomers(userRole, userId);
      
      if (userLocation) {
        const customersWithDistance = response.map(customer => ({
          ...customer,
          distance: customer.address?.coordinates ? calculateDistance(
            userLocation.lat,
            userLocation.lon,
            customer.address.coordinates.lat,
            customer.address.coordinates.lng
          ) : undefined
        }));
        setCustomers(customersWithDistance);
      } else {
        setCustomers(response);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      Alert.alert('Hata', 'Müşteriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        Geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
            fetchCustomers();
          },
          error => {
            console.log('Konum alınamadı:', error);
            fetchCustomers();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (error) {
        console.error('Konum izni hatası:', error);
        fetchCustomers();
      }
    };

    checkLocationPermission();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    
    const searchLower = searchQuery.toLowerCase();
    return customers.filter(customer => {
      const matchName = customer.name.toLowerCase().includes(searchLower);
      const matchCompany = customer.company.toLowerCase().includes(searchLower);
      const matchEmail = customer.email.toLowerCase().includes(searchLower);
      return matchName || matchCompany || matchEmail;
    });
  }, [customers, searchQuery]);

  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate('CustomerDetail', {
      customerId: customer.id,
      customerData: customer
    });
  };

  const handleOpenMap = () => {
    navigation.navigate('Map');
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCustomers().finally(() => setRefreshing(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Müşteri ara..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredCustomers}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCustomerPress(item)}>
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Text variant="titleMedium">{item.name}</Text>
                      {item.distance !== undefined && (
                        <View style={styles.distanceContainer}>
                          <IconMC name="map-marker-distance" size={16} color={theme.colors.primary} />
                          <Text variant="bodySmall" style={styles.distance}>
                            {item.distance.toFixed(1)} km
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text variant="bodyMedium">{item.company}</Text>
                    <Text variant="bodySmall">{item.email}</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    elevation: 4,
  },
  searchBar: {
    marginBottom: 8,
  },
  card: {
    margin: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distance: {
    marginLeft: 4,
    color: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  }
});

export default CustomerListScreen;
