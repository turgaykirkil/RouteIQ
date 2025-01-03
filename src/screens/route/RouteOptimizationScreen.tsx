import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef 
} from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  FlatList, 
  Platform,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Linking,
  PermissionsAndroid
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MapView, { Marker, Polyline, PROVIDER_OPENSTREETMAP, Callout } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';
import { useCustomers } from '../../hooks/useCustomers';
import { useLocation } from '../../hooks/useLocation';
import { Customer } from '../../types/customer';
import { routeService } from '../../services/routeService';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';

const { width, height } = Dimensions.get('window');

interface SelectedPoint {
  customer: Customer;
  order: number;
}

const RouteOptimizationScreen = () => {
  const theme = useTheme();
  const { 
    customers, 
    loading: customersLoading, 
    error: customersError 
  } = useCustomers();
  
  const { location } = useLocation();
  
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeDetails, setRouteDetails] = useState<any | null>(null);
  const [isRouteDetailsModalVisible, setIsRouteDetailsModalVisible] = useState(false);

  const initialMapRegion = useRef({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [mapRegion, setMapRegion] = useState(initialMapRegion.current);

  useEffect(() => {
    if (location) {
      setMapRegion({
        latitude: location.lat,
        longitude: location.lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [location]);

  const updateSelectedPoints = useCallback((newSelectedPoints: SelectedPoint[]) => {
    setSelectedPoints(newSelectedPoints);

    if (optimizedRoute) {
      setOptimizedRoute(null);
      setRouteDetails(null);
    }
  }, [optimizedRoute]);

  const handleCustomerSelection = useCallback((customer: Customer) => {
    const isAlreadySelected = selectedPoints.some(point => point.customer.id === customer.id);
    
    if (isAlreadySelected) {
      const updatedPoints = selectedPoints.filter(point => point.customer.id !== customer.id);
      updateSelectedPoints(updatedPoints);
    } else {
      const newSelectedPoint: SelectedPoint = {
        customer,
        order: selectedPoints.length + 1
      };
      
      const updatedPoints = [...selectedPoints, newSelectedPoint];
      updateSelectedPoints(updatedPoints);
    }
  }, [selectedPoints, updateSelectedPoints]);

  const calculateRoute = useCallback(() => {
    try {
      setIsLoading(true);
      
      const calculatedRoute = routeService.calculateOptimizedRoute(
        selectedPoints.map(point => point.customer)
      );
      
      setRouteDetails(calculatedRoute);
      setOptimizedRoute(calculatedRoute);
      setIsRouteDetailsModalVisible(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Rota hesaplanırken hata:', error);
      setIsLoading(false);
      Alert.alert(
        'Rota Hesaplama Hatası', 
        'Rotanız hesaplanamadı. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    }
  }, [selectedPoints]);

  const closeRouteDetailsModal = useCallback(() => {
    setIsRouteDetailsModalVisible(false);
    setSelectedPoints([]); 
  }, []);

  useEffect(() => {
    console.log('Müşteri Sayısı:', customers?.length);
    console.log('İlk Müşteri Koordinatları:', 
      customers && customers[0]?.address?.coordinates
    );
  }, [customers])

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRouteDetailsModalVisible}
        onRequestClose={closeRouteDetailsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rota Detayları</Text>
              <TouchableOpacity onPress={closeRouteDetailsModal}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {routeDetails && (
                <View>
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Toplam Mesafe</Text>
                    <Text>{routeDetails.totalDistance} km</Text>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Müşteri Sırası</Text>
                    {routeDetails.customers.map((customer, index) => (
                      <View key={customer.id} style={styles.customerDetailItem}>
                        <Text style={styles.customerName}>{index + 1}. {customer.name}</Text>
                        <Text>{customer.address.street}, {customer.address.city}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalActionContainer}>
              <TouchableOpacity 
                style={[styles.modalActionButton, styles.modalCancelButton]} 
                onPress={closeRouteDetailsModal}
              >
                <Text style={styles.modalActionButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Müşteri listesi kaldırıldı */}
      
      <MapView
        provider={PROVIDER_OPENSTREETMAP}
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Müşteri markerları */}
        {customers && customers.map(customer => (
          customer.address?.coordinates?.lat && customer.address?.coordinates?.lng && (
            <Marker
              key={customer.id}
              coordinate={{
                latitude: customer.address.coordinates.lat,
                longitude: customer.address.coordinates.lng,
              }}
              onPress={() => handleCustomerSelection(customer)}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color={selectedPoints.some(p => p.customer.id === customer.id) 
                  ? theme.colors.primary 
                  : '#808080'}
              />
            </Marker>
          )
        ))}
        
        {selectedPoints.map((point, index) => (
          <Marker
            key={point.customer.id}
            coordinate={{
              latitude: point.customer.address.coordinates.lat,
              longitude: point.customer.address.coordinates.lng
            }}
            title={point.customer.name}
            description={`Sıra: ${point.order}`}
          >
            <MaterialCommunityIcons 
              name="map-marker" 
              size={40} 
              color={theme.colors.primary} 
            />
          </Marker>
        ))}

        {optimizedRoute?.coordinates && (
          <Polyline
            coordinates={optimizedRoute.coordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Rota Hesapla Butonu */}
      {selectedPoints.length > 0 && (
        <TouchableOpacity 
          style={styles.calculateRouteButton}
          onPress={calculateRoute}
          disabled={isLoading}
        >
          <Text style={styles.calculateRouteButtonText}>
            {isLoading ? 'Hesaplanıyor...' : 'Rota Hesapla'}
          </Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text>Rota hesaplanıyor...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  orderBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: theme.colors.onPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  calloutWrapper: {
    width: 300,
    backgroundColor: 'transparent',
  },
  calloutContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
    borderWidth: 1,
    minWidth: 200,
    maxWidth: 300,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    lineHeight: 20,
  },
  calculateRouteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  calculateRouteButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    maxHeight: '70%',
    padding: 15,
  },
  detailSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  customerDetailItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  modalActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalActionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#4CAF50',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(RouteOptimizationScreen);
