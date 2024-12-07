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
  Alert,
  Icon
} from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { customerAPI } from '../../services/api';
import theme from '../../theme';
import { sortCustomersByDistance } from '../../utils/geoUtils';
import Geolocation from '@react-native-community/geolocation';

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
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    // Kullanıcının konumunu al
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.log('Konum alınamadı', error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // Müşterileri çek
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const fetchedCustomers = await customerAPI.getAll();
        
        // Eğer kullanıcı konumu varsa sırala
        if (userLocation) {
          const sortedCustomers = sortCustomersByDistance(
            fetchedCustomers, 
            userLocation.lat, 
            userLocation.lon
          );
          setCustomers(sortedCustomers);
        } else {
          setCustomers(fetchedCustomers);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [userLocation]);

  const handleCustomerPress = (customer: Customer) => {
    console.log('CustomerListScreen: Customer Pressed', customer);
    
    // Detay sayfasına geçiş
    navigation.navigate('CustomerDetail', { 
      customerId: customer.id,
      customerData: customer  // Tüm müşteri verilerini de geçirelim
    });
    
    console.log('CustomerListScreen: Navigation to CustomerDetail triggered', {
      customerId: customer.id
    });
  };

  const handleOpenMap = () => {
    navigation.navigate('Map');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Müşteriler</Text>
        <TouchableOpacity onPress={handleOpenMap}>
          <Icon name="map" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={customers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCustomerPress(item)}>
            <Card style={styles.card}>
              <Card.Title
                title={item.name}
                subtitle={
                  item.distance !== undefined 
                    ? `${item.distance.toFixed(1)} km uzaklıkta` 
                    : item.company
                }
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomerListScreen;
