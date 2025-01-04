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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import { useCustomers } from '../../hooks/useCustomers';
import { useLocation } from '../../hooks/useLocation';
import { Customer } from '../../types/customer';
import { routeService } from '../../services/routeService';
import theme from '../../theme';

const { width, height } = Dimensions.get('window');

interface SelectedPoint {
  customer: Customer;
  order: number;
}

interface RouteDetails {
  customers: Customer[];
  distance: number;
  duration: number;
}

const RouteOptimizationScreen = () => {
  const theme = useTheme();
  const { 
    customers, 
    loading: customersLoading, 
    error: customersError 
  } = useCustomers();
  
  const { location } = useLocation();
  
  const [selectedPoints, setSelectedPoints] = useState<Array<{customer: Customer, order: number}>>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeDetailsModalVisible, setRouteDetailsModalVisible] = useState(false);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);

  const MAX_MODAL_HEIGHT = Dimensions.get('window').height * 0.8;
  const ROUTE_OVERVIEW_HEIGHT = 120; // Toplam mesafe ve süre kartlarının yüksekliği
  const SECTION_TITLE_HEIGHT = 50; // Müşteri Sırası başlığının yüksekliği
  const CUSTOMER_ITEM_HEIGHT = 100; // Her müşteri item'ının yüksekliği (padding dahil)
  const MODAL_HEADER_HEIGHT = 60; // Modal başlık yüksekliği
  const MODAL_FOOTER_HEIGHT = 80; // Modal footer yüksekliği
  const MODAL_VERTICAL_PADDING = 32; // Modal içerik dikey padding'i

  const calculateModalHeight = useCallback((customerCount: number) => {
    const customerListHeight = customerCount * CUSTOMER_ITEM_HEIGHT;
    const totalHeight = (
      MODAL_HEADER_HEIGHT + 
      ROUTE_OVERVIEW_HEIGHT + 
      SECTION_TITLE_HEIGHT + 
      customerListHeight + 
      MODAL_FOOTER_HEIGHT + 
      MODAL_VERTICAL_PADDING
    );
    return Math.min(totalHeight, MAX_MODAL_HEIGHT);
  }, []);

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

  const updateSelectedPoints = useCallback((newSelectedPoints: Array<{customer: Customer, order: number}>) => {
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
      const newSelectedPoint: {customer: Customer, order: number} = {
        customer,
        order: selectedPoints.length + 1
      };
      
      const updatedPoints = [...selectedPoints, newSelectedPoint];
      updateSelectedPoints(updatedPoints);
    }
  }, [selectedPoints, updateSelectedPoints]);

  const validateCustomerCoordinates = useCallback((customer: Customer): boolean => {
    const { coordinates } = customer.address;
    const isValid = coordinates && coordinates.lat && coordinates.lng;
    return !!isValid;
  }, []);

  const filterValidCustomers = useCallback((customers: Customer[]) => {
    if (!customers || customers.length === 0) return [];
    
    return customers.filter(customer => {
      const hasValidCoordinates = 
        customer?.address?.coordinates?.lat && 
        customer?.address?.coordinates?.lng;
      return hasValidCoordinates;
    });
  }, []);

  const handleCustomerPress = useCallback((customer: Customer) => {
    const isSelected = selectedPoints.some(point => point.customer.id === customer.id);
    
    if (isSelected) {
      const updatedPoints = selectedPoints.filter(point => point.customer.id !== customer.id);
      updateSelectedPoints(updatedPoints);
    } else {
      const newSelectedPoint = {
        customer,
        order: selectedPoints.length + 1
      };
      updateSelectedPoints([...selectedPoints, newSelectedPoint]);
    }
  }, [selectedPoints, updateSelectedPoints]);

  const calculateRoute = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!selectedPoints || selectedPoints.length < 2) {
        Alert.alert('Uyarı', 'Rota hesaplaması için en az 2 müşteri seçmelisiniz.');
        return;
      }

      const validCustomers = filterValidCustomers(selectedPoints.map(point => point.customer));
      
      if (validCustomers.length < 2) {
        Alert.alert('Uyarı', 'Seçilen müşterilerin koordinatları geçersiz. Lütfen başka müşteriler seçin.');
        return;
      }

      const optimizedRoute = await routeService.calculateOptimizedRoute(validCustomers);
      
      if (!optimizedRoute) {
        throw new Error('Rota hesaplanamadı');
      }

      setRouteDetails({
        customers: validCustomers,
        distance: optimizedRoute.totalDistance || 0,
        duration: optimizedRoute.estimatedTime || 0
      });

      setRouteDetailsModalVisible(true);
    } catch (error) {
      Alert.alert('Hata', 'Rota hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPoints, filterValidCustomers, routeService]);

  const closeRouteDetailsModal = useCallback(() => {
    setRouteDetailsModalVisible(false);
    setRouteDetails(null);
    setSelectedPoints([]);
    setOptimizedRoute(null);
  }, []);

  const handleShowOnMap = useCallback(() => {
    if (routeDetails?.customers) {
      // Haritada göster işlemleri
      setRouteDetailsModalVisible(false);
    }
  }, [routeDetails]);

  const renderRouteOptimizationModal = useCallback(() => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={routeDetailsModalVisible}
        onRequestClose={closeRouteDetailsModal}
      >
        <TouchableOpacity 
          style={styles.modal} 
          activeOpacity={1} 
          onPress={closeRouteDetailsModal}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1} 
            onPress={e => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rota Optimizasyonu</Text>
              <TouchableOpacity onPress={closeRouteDetailsModal}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.modalContent}>
              {routeDetails && (
                <>
                  <View style={styles.overviewContainer}>
                    <View style={styles.overviewCard}>
                      <Text style={styles.overviewTitle}>Toplam Mesafe</Text>
                      <Text style={styles.overviewValue}>
                        {routeDetails.distance.toFixed(0)} km
                      </Text>
                    </View>
                    <View style={styles.overviewCard}>
                      <Text style={styles.overviewTitle}>Tahmini Süre</Text>
                      <Text style={styles.overviewValue}>
                        {routeDetails.duration.toFixed(0)} dk
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.sectionTitle}>Müşteri Sırası</Text>
                  <ScrollView 
                    style={styles.customerListScroll}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                  >
                    {routeDetails.customers.map((customer, index) => (
                      <View key={customer.id} style={styles.customerItem}>
                        <View style={styles.customerItemContent}>
                          <Text style={styles.customerOrder}>{index + 1}.</Text>
                          <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{customer.name}</Text>
                            <Text style={styles.customerAddress}>
                              {customer.address.street}, {customer.address.city}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
            {/* Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.footerButton, styles.showOnMapButton]} 
                onPress={handleShowOnMap}
              >
                <MaterialCommunityIcons 
                  name="map-marker" 
                  size={20} 
                  color={theme.colors.onPrimary} 
                />
                <Text style={styles.buttonText}>Haritada Göster</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.footerButton, styles.cancelButton]} 
                onPress={closeRouteDetailsModal}
              >
                <MaterialCommunityIcons 
                  name="close" 
                  size={20} 
                  color={theme.colors.onPrimary} 
                />
                <Text style={styles.buttonText}>Rotadan Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }, [routeDetails, routeDetailsModalVisible, closeRouteDetailsModal, handleShowOnMap, theme.colors]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    calculateRouteButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    calculateRouteButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      maxHeight: Dimensions.get('window').height * 0.8,
      width: '100%'
    },
    modalContainer: {
      flex: 1,
      padding: 16,
    },
    customerListContainer: {
      maxHeight: 300,
      overflow: 'hidden'
    },
    customerListScroll: {
      maxHeight: 300,
      height: 300
    },
    customerListContent: {
      paddingBottom: 16
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.disabled,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    overviewContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      gap: 16,
    },
    overviewCard: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 12,
      padding: 16,
    },
    overviewTitle: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: 8,
    },
    overviewValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    customerItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      marginBottom: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    customerItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    customerOrder: {
      width: 30,
      marginRight: 12,
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
    },
    customerInfo: {
      flex: 1,
    },
    customerName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 4,
    },
    customerAddress: {
      fontSize: 14,
      color: theme.colors.text,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 24,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.disabled,
    },
    footerButton: {
      flex: 1,
      marginHorizontal: 8,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    showOnMapButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      backgroundColor: theme.colors.error,
    },
    buttonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {renderRouteOptimizationModal()}
      <MapView
        style={styles.map}
        initialRegion={initialMapRegion.current}
        showsUserLocation={true}
        showsMyLocationButton={true}
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
              onPress={() => handleCustomerPress(customer)}
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
      </MapView>

      {/* Rota Hesaplama Butonu */}
      {selectedPoints.length >= 1 && (
        <TouchableOpacity 
          style={styles.calculateRouteButton} 
          onPress={calculateRoute}
          disabled={isLoading}
        >
          <Text style={styles.calculateRouteButtonText}>
            {isLoading ? 'Hesaplanıyor...' : 'Rotayı Hesapla'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(RouteOptimizationScreen);
