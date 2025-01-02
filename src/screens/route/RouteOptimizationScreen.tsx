import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  FlatList,
  Platform,
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

const { width, height } = Dimensions.get('window');

interface SelectedPoint {
  customer: Customer;
  order: number;
}

// Log fonksiyonunu optimize et
const optimizeLog = (() => {
  const logCache = new Set();
  const MAX_CACHE_SIZE = 5;

  return (message: string, data?: any) => {
    const cacheKey = message + JSON.stringify(data);
    
    // Aynı log son 5 dakika içinde gösterilmediyse logla
    if (!logCache.has(cacheKey)) {
      console.log(message, data);
      logCache.add(cacheKey);

      // Önbellek boyutunu sınırla
      if (logCache.size > MAX_CACHE_SIZE) {
        const oldestLog = logCache.values().next().value;
        logCache.delete(oldestLog);
      }
    }
  };
})();

const RouteOptimizationScreen: React.FC = () => {
  const theme = useTheme();
  const { customers, loading: customersLoading, error: customersError } = useCustomers();
  const { location } = useLocation();
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRouteDetailsModalVisible, setIsRouteDetailsModalVisible] = useState(false);
  const [routeOptimizationDetails, setRouteOptimizationDetails] = useState(null);
  const [isCalculateRouteVisible, setIsCalculateRouteVisible] = useState(true);
  const [isRouteDetailsVisible, setIsRouteDetailsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal state'i için useState hook'u ekle

  const [mapRegion, setMapRegion] = useState({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

  useEffect(() => {
    // Log çağrılarını optimize et
    if (selectedPoints.length > 0) {
      optimizeLog('Seçili Noktalar:', selectedPoints.length);
    }
    
    if (location) {
      optimizeLog('Konum:', location);
    }
  }, [selectedPoints, location]);

  useEffect(() => {
    // Eğer seçili noktalar sıfırlandıysa modal'ı kapat
    if (selectedPoints.length === 0) {
      setIsRouteDetailsModalVisible(false);
    }
  }, [selectedPoints]);

  // Müşteri seçimini güncelleyen fonksiyon
  const updateSelectedPoints = (newSelectedPoints: SelectedPoint[]) => {
    setSelectedPoints(newSelectedPoints);

    // Eğer seçili müşteri sayısı değişirse veya müşteriler değişirse
    // Rota hesapla butonunu göster
    if (optimizedRoute) {
      setOptimizedRoute(null);
      setRouteOptimizationDetails(null);
      setIsCalculateRouteVisible(true);
      setIsRouteDetailsVisible(false);
    }
  };

  // Rotadan vazgeç fonksiyonu
  const cancelRoute = () => {
    // Modal'ı kapat
    setIsRouteDetailsModalVisible(false);
    
    // Seçili noktaları sıfırla
    setSelectedPoints([]);
    
    // Rota detaylarını temizle
    setRouteOptimizationDetails(null);
    
    // Rota hesaplama butonunu tekrar görünür yap
    setIsCalculateRouteVisible(true);
  };

  // Müşteri seçim ekranında çağrılacak
  const handleCustomerSelection = (customer: Customer) => {
    const isAlreadySelected = selectedPoints.some(point => point.customer.id === customer.id);
    
    if (isAlreadySelected) {
      // Zaten seçili ise çıkar
      const updatedPoints = selectedPoints.filter(point => point.customer.id !== customer.id);
      updateSelectedPoints(updatedPoints);
    } else {
      // Yeni müşteriyi ekle
      const newSelectedPoint: SelectedPoint = {
        customer,
        order: selectedPoints.length + 1
      };
      
      const updatedPoints = [...selectedPoints, newSelectedPoint];
      updateSelectedPoints(updatedPoints);
    }
  };

  // Rota hesaplama fonksiyonu
  const calculateRoute = () => {
    try {
      setIsLoading(true);
      
      const routeDetails = routeService.calculateOptimizedRoute(
        selectedPoints.map(point => point.customer)
      );
      
      setRouteOptimizationDetails(routeDetails);
      setIsRouteDetailsModalVisible(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Rota hesaplanırken hata oluştu:', error);
      setIsLoading(false);
      Alert.alert('Hata', 'Rota hesaplanamadı');
    }
  };

  // Harita bölgesini hesaplayan yardımcı fonksiyon
  const calculateMapRegion = (coordinates: { latitude: number, longitude: number }[]) => {
    if (coordinates.length === 0) return null;

    // Koordinatların enlem ve boylamlarını hesapla
    const lats = coordinates.map(coord => coord.latitude);
    const lngs = coordinates.map(coord => coord.longitude);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Merkez koordinatları
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Yakınlaştırma için delta hesaplaması
    const latDelta = Math.max(0.5, Math.abs(maxLat - minLat) * 1.2);
    const lngDelta = Math.max(0.5, Math.abs(maxLng - minLng) * 1.2);

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta
    };
  };

  // Konum izni alma fonksiyonu
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Konum İzni",
            message: "Rota hesaplama için konumunuza ihtiyacımız var.",
            buttonNeutral: "Daha Sonra",
            buttonNegative: "İptal",
            buttonPositive: "Tamam"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS'ta izin gerekmiyor
  };

  // Haritada göster fonksiyonu
  const showRouteOnMap = async () => {
    if (selectedPoints.length === 0) return;

    try {
      // Seçili müşterilerin koordinatlarını al (seçim sırasını koru)
      const selectedCustomers = selectedPoints.map(point => point.customer);

      // Log ekle
      console.log('Haritada Gösterilecek Müşteriler:', selectedCustomers.map(c => ({
        name: c.name,
        lat: c.address.coordinates.lat,
        lng: c.address.coordinates.lng
      })));

      // Platform'a özel URL oluşturma
      const createWaypointsURL = () => {
        if (Platform.OS === 'ios') {
          // iOS Maps URL formatı
          const waypointsString = selectedCustomers.map(
            customer => 
              `daddr=${customer.address.coordinates.lat},${customer.address.coordinates.lng}`
          ).join('+');

          return `maps:0,0?${waypointsString}`;
        } else {
          // Android Google Maps URL formatı
          const waypointsString = selectedCustomers.map(
            customer => 
              `${customer.address.coordinates.lat},${customer.address.coordinates.lng}`
          ).join('|');

          return `geo:0,0?q=${waypointsString}`;
        }
      };

      const mapURL = createWaypointsURL();
      console.log('Oluşturulan Harita URL:', mapURL);

      Linking.openURL(mapURL);
    } catch (error) {
      console.error('Haritada gösterirken hata oluştu:', error);
      Alert.alert('Hata', 'Harita açılırken bir sorun oluştu');
    }
  };

  const RouteDetailsModal = ({ 
    isVisible, 
    onClose, 
    onCancelRoute,
    onShowOnMap,
    optimizationDetails 
  }: { 
    isVisible: boolean, 
    onClose: () => void, 
    onCancelRoute: () => void,
    onShowOnMap: () => void,
    optimizationDetails: any 
  }) => {
    const { height, width } = Dimensions.get('window');
    const theme = useTheme();

    if (!optimizationDetails) return null;

    const { 
      weatherConditions, 
      trafficConditions, 
      customerDetails 
    } = optimizationDetails;

    return (
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer, 
            { 
              width: width * 0.9, 
              maxHeight: height * 0.8 
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rota Optimizasyon Detayları</Text>
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeModalButton}
              >
                <Icon 
                  name="close" 
                  size={24} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={{ 
                paddingBottom: 20 
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {/* Hava Durumu Bilgileri */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🌦️ Hava Durumu</Text>
                <Text>Sıcaklık: {weatherConditions?.temperature}°C</Text>
                <Text>Durum: {weatherConditions?.condition}</Text>
                <Text>Nem: {weatherConditions?.humidity}%</Text>
                <Text>Rüzgar Hızı: {weatherConditions?.windSpeed} km/sa</Text>
              </View>

              {/* Trafik Durumu Bilgileri */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>🚦 Trafik Durumu</Text>
                <Text>Yoğunluk Seviyesi: {trafficConditions?.congestionLevel}</Text>
                <Text>Ortalama Hız: {trafficConditions?.averageSpeed} km/sa</Text>
                <Text>Trafik Olayları: {trafficConditions?.incidents?.length || 0}</Text>
              </View>

              {/* Müşteri Detayları */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>👥 Müşteri Öncelikleri</Text>
                {customerDetails?.map((customer, index) => (
                  <View key={customer.id} style={styles.customerDetailItem}>
                    <Text style={styles.customerName}>
                      {index + 1}. {customer.name}
                    </Text>
                    <Text>
                      Öncelik Skoru: {customer.priorityScore.toFixed(2)}
                    </Text>
                    <Text>
                      Hava Durumu Etkisi: {customer.weatherPenalty.toFixed(2)}
                    </Text>
                    <Text>
                      Trafik Etkisi: {customer.trafficPenalty.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActionContainer}>
              <TouchableOpacity 
                style={styles.modalActionButton}
                onPress={onShowOnMap}
              >
                <Icon 
                  name="map" 
                  size={20} 
                  color="white" 
                  style={styles.modalActionButtonIcon} 
                />
                <Text style={styles.modalActionButtonText}>Haritada Göster</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalActionButton, styles.modalCancelButton]}
                onPress={onCancelRoute}
              >
                <Icon 
                  name="close-circle" 
                  size={20} 
                  color="white" 
                  style={styles.modalActionButtonIcon} 
                />
                <Text style={styles.modalActionButtonText}>Rotadan Vazgeç</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
      alignItems: 'center',
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
    routeInfo: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    routeInfoText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      marginBottom: 8,
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
    cancelRouteButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.error,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelRouteButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)', // Yarı saydam arka plan
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 0, // İç padding kaldırıldı
      maxHeight: '85%', // Ekranın %85'ini kaplaması için
      width: '90%',
      alignSelf: 'center',
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 20
    },
    modalContent: {
      maxHeight: '70%', // Scroll alanı için alan bırak
      paddingHorizontal: 20, // İçerik için yan boşluklar
      paddingTop: 10,
      paddingBottom: 10 // Alt boşluk azaltıldı
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 15, // Padding değeri azaltıldı
      paddingBottom: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 0.5,
      borderBottomColor: '#e0e0e0'
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    modalActionContainer: {
      flexDirection: 'row',
      justifyContent: 'center', // Merkezi hizalama
      alignItems: 'center',
      paddingTop: 15, // Header ile aynı padding
      paddingBottom: 15,
      paddingHorizontal: 20,
      width: '100%', // Tam genişlik
      alignSelf: 'center', // Konteyneri merkezle
      borderTopWidth: 0.5,
      borderTopColor: '#e0e0e0'
    },
    modalActionButton: {
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 10, // Butonlar arası boşluk
      width: '45%', // Biraz daha geniş
    },
    modalActionButtonIcon: {
      marginRight: 10,
    },
    modalActionButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalCancelButton: {
      backgroundColor: theme.colors.error,
    },
    detailSection: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    customerDetailItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
    },
    customerName: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });

  const closeRouteDetailsModal = () => {
    setIsRouteDetailsModalVisible(false);
    setSelectedPoints([]); // Seçili noktaları da sıfırla
  };

  return (
    <View style={styles.container}>
      {/* Harita */}
      <MapView
        provider={PROVIDER_OPENSTREETMAP}
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Müşteri markerları */}
        {customers.map(customer => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.address.coordinates.lat,
              longitude: customer.address.coordinates.lng,
            }}
            onPress={() => handleCustomerSelection(customer)}
          >
            <View style={styles.markerContainer}>
              <MaterialCommunityIcons
                name={selectedPoints.some(p => p.customer.id === customer.id) 
                  ? 'map-marker' 
                  : 'map-marker-outline'}
                size={40}
                color={selectedPoints.some(p => p.customer.id === customer.id) 
                  ? theme.colors.primary 
                  : theme.colors.text}
              />
            </View>
            <Callout 
              tooltip
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 10,
                padding: 15,
                minWidth: 200
              }}
            >
              <View>
                <Text style={styles.calloutTitle}>{customer.name}</Text>
                <Text style={styles.calloutText}>
                  {customer.address.street}
                  {customer.address.city && `, ${customer.address.city}`}
                </Text>
                {customer.phone && (
                  <Text style={styles.calloutText}>📞 {customer.phone}</Text>
                )}
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Optimize edilmiş rota çizgisi */}
        {optimizedRoute && optimizedRoute.polyline && (
          <Polyline
            coordinates={optimizedRoute.polyline}
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

      {/* Rota Detayları Modal */}
      <RouteDetailsModal 
        isVisible={isRouteDetailsModalVisible}
        onClose={closeRouteDetailsModal}
        onCancelRoute={cancelRoute}
        onShowOnMap={showRouteOnMap}
        optimizationDetails={routeOptimizationDetails}
      />
    </View>
  );
};

export default RouteOptimizationScreen;
