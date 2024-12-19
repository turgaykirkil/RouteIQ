import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MapView, { Marker, Polyline, PROVIDER_OPENSTREETMAP, Callout } from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCustomers } from '../../hooks/useCustomers';
import { useLocation } from '../../hooks/useLocation';
import { Customer } from '../../types/customer';
import { routeService } from '../../services/routeService';

const { width, height } = Dimensions.get('window');

interface SelectedPoint {
  customer: Customer;
  order: number;
}

const RouteOptimizationScreen = () => {
  const theme = useTheme();
  const { customers } = useCustomers();
  const { location } = useLocation();
  const [selectedPoints, setSelectedPoints] = useState<SelectedPoint[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleMarkerPress = (customer: Customer) => {
    const existingPoint = selectedPoints.find(p => p.customer.id === customer.id);
    
    if (existingPoint) {
      // Noktayı kaldır
      setSelectedPoints(selectedPoints.filter(p => p.customer.id !== customer.id));
      // Sıralamayı güncelle
      const updatedPoints = selectedPoints
        .filter(p => p.customer.id !== customer.id)
        .map(p => ({
          ...p,
          order: p.order > existingPoint.order ? p.order - 1 : p.order
        }));
      setSelectedPoints(updatedPoints);
    } else {
      // Yeni nokta ekle
      setSelectedPoints([
        ...selectedPoints,
        { customer, order: selectedPoints.length + 1 }
      ]);
    }
  };

  const calculateRoute = async () => {
    if (selectedPoints.length < 2) {
      Alert.alert('Uyarı', 'En az 2 nokta seçmelisiniz.');
      return;
    }

    setIsLoading(true);
    try {
      const startPoint = location ? 
        { lat: location.lat, lng: location.lon } : 
        { lat: mapRegion.latitude, lng: mapRegion.longitude };

      // Seçilen noktaları sıraya göre düzenle
      const orderedPoints = [...selectedPoints]
        .sort((a, b) => a.order - b.order)
        .map(p => p.customer);

      const routeDetails = await routeService.calculateOptimalRoute(
        orderedPoints,
        startPoint
      );

      setOptimizedRoute(routeDetails);
    } catch (error) {
      console.error('Route calculation error:', error);
      Alert.alert('Hata', 'Rota hesaplanırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width,
      height,
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
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      ...theme.shadows.small,
    },
    routeInfoText: {
      fontSize: 14,
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    calculateButton: {
      position: 'absolute',
      bottom: optimizedRoute ? 140 : 20,
      right: 20,
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 30,
      ...theme.shadows.small,
    },
    calculateButtonText: {
      color: theme.colors.onPrimary,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_OPENSTREETMAP}
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.address.coordinates.lat,
              longitude: customer.address.coordinates.lng,
            }}
            onPress={() => handleMarkerPress(customer)}
          >
            <View style={styles.markerContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color={theme.colors.primary}
              />
              {selectedPoints.find(p => p.customer.id === customer.id) && (
                <View style={styles.orderBadge}>
                  <Text style={styles.orderText}>
                    {selectedPoints.find(p => p.customer.id === customer.id)?.order}
                  </Text>
                </View>
              )}
            </View>
            <Callout tooltip>
              <View style={styles.calloutWrapper}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{customer.name}</Text>
                  <Text style={styles.calloutText}>
                    {customer.address.street}
                    {customer.address.city && `, ${customer.address.city}`}
                  </Text>
                  {customer.phone && (
                    <Text style={styles.calloutText}>📞 {customer.phone}</Text>
                  )}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
        {optimizedRoute && (
          <Polyline
            coordinates={optimizedRoute.coordinates.map((coord: number[]) => ({
              latitude: coord[0],
              longitude: coord[1],
            }))}
            strokeWidth={3}
            strokeColor={theme.colors.primary}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculateRoute}
        disabled={isLoading}
      >
        <Text style={styles.calculateButtonText}>
          {isLoading ? 'Hesaplanıyor...' : 'Rota Hesapla'}
        </Text>
      </TouchableOpacity>

      {optimizedRoute && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>
            Seçili Noktalar: {selectedPoints.length}
          </Text>
          <Text style={styles.routeInfoText}>
            Toplam Mesafe: {optimizedRoute.distance.toFixed(1)} km
          </Text>
          <Text style={styles.routeInfoText}>
            Tahmini Süre: {Math.round(optimizedRoute.duration)} dakika
          </Text>
        </View>
      )}
    </View>
  );
};

export default RouteOptimizationScreen;
