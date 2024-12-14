import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Alert,
  Platform,
  Linking
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
import { sortCustomersByDistance } from '../../utils/geoUtils';
import Geolocation from '@react-native-community/geolocation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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
  const { user } = useSelector((state: RootState) => state.auth);
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
    const checkLocationPermission = async () => {
      try {
        Geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            Alert.alert(
              'Konum Bilgisi',
              'Konumunuza yakın firmaları görebilmeniz için konum ayarlarına izin vermeniz gerekmektedir.',
              [
                {
                  text: 'Tamam',
                  onPress: () => {
                    setUserLocation({
                      lat: 38.4192, // İzmir merkez koordinatları
                      lon: 27.1287
                    });
                  }
                }
              ]
            );
          }
        );
      } catch (error) {
        setUserLocation({
          lat: 38.4192,
          lon: 27.1287
        });
      }
    };

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const fetchedCustomers = await customerService.getCustomers({
          role: user.role,
          userId: user.id
        });
        
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
        if (__DEV__) {
          console.error('Müşteriler alınırken hata:', error);
        }
        Alert.alert(
          'Hata',
          'Müşteri listesi alınırken bir hata oluştu. Lütfen tekrar deneyin.'
        );
      } finally {
        setLoading(false);
      }
    };

    checkLocationPermission();
    fetchCustomers();
  }, []);

  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate('CustomerDetail', {
      customerId: customer.id,
      customerData: customer
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
