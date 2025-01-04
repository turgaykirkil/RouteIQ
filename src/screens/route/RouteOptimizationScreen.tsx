import React, { 
  useState, 
  useCallback 
} from 'react';
import { 
  View, 
  StyleSheet, 
  Alert
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { Customer } from '../../types/customer';
import { routeService } from '../../services/routeService';

import RouteMapView from '../../components/route/RouteMapView';
import RouteDetailsModal from '../../components/route/RouteDetailsModal';

const RouteOptimizationScreen = () => {
  const theme = useTheme();
  const [selectedPoints, setSelectedPoints] = useState<Array<{customer: Customer, order: number}>>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any | null>(null);
  const [routeDetailsModalVisible, setRouteDetailsModalVisible] = useState(false);
  const [routeDetails, setRouteDetails] = useState<{
    customers: Customer[];
    distance: number;
    duration: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  const handleCustomerPress = useCallback((customer: Customer | null) => {
    if (!customer) {
      // Tüm seçimleri temizle
      setSelectedPoints([]);
      setOptimizedRoute(null);
      return;
    }

    const isAlreadySelected = selectedPoints.some(point => point.customer.id === customer.id);
    
    if (isAlreadySelected) {
      const updatedPoints = selectedPoints.filter(point => point.customer.id !== customer.id);
      setSelectedPoints(updatedPoints.map((point, index) => ({
        ...point,
        order: index + 1
      })));
    } else {
      const newSelectedPoint = {
        customer,
        order: selectedPoints.length + 1
      };
      
      setSelectedPoints([...selectedPoints, newSelectedPoint]);
    }
  }, [selectedPoints]);

  const calculateRoute = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!selectedPoints || selectedPoints.length < 1) {
        Alert.alert('Uyarı', 'Rota hesaplaması için en az 1 müşteri seçmelisiniz.');
        return null;
      }

      const validCustomers = selectedPoints.map(point => point.customer)
        .filter(customer => 
          customer?.address?.coordinates?.lat && 
          customer?.address?.coordinates?.lng
        );
      
      if (validCustomers.length < 1) {
        Alert.alert('Uyarı', 'Seçilen müşterilerin koordinatları geçersiz. Lütfen başka müşteriler seçin.');
        return null;
      }

      const optimizedRoute = await routeService.calculateOptimizedRoute(validCustomers);
      
      if (!optimizedRoute) {
        throw new Error('Rota hesaplanamadı');
      }

      const details = {
        customers: validCustomers,
        distance: optimizedRoute.totalDistance || 0,
        duration: optimizedRoute.estimatedTime || 0
      };

      setRouteDetails(details);
      setOptimizedRoute(optimizedRoute);
      setRouteDetailsModalVisible(true);

      return optimizedRoute;
    } catch (error) {
      Alert.alert('Hata', 'Rota hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [selectedPoints, routeService]);

  const closeRouteDetailsModal = useCallback(() => {
    setRouteDetailsModalVisible(false);
    setRouteDetails(null);
  }, []);

  const showRouteOnMap = useCallback(() => {
    // Optimized route'u haritada göster
    setRouteDetailsModalVisible(false);
  }, []);

  const cancelRoute = useCallback(() => {
    // Rotayı tamamen iptal et
    setSelectedPoints([]);
    setOptimizedRoute(null);
    setRouteDetails(null);
    setRouteDetailsModalVisible(false);
  }, []);

  return (
    <View style={styles.container}>
      <RouteMapView 
        selectedPoints={selectedPoints}
        optimizedRoute={optimizedRoute}
        onCustomerPress={handleCustomerPress}
        onCalculateRoute={calculateRoute}
        isLoading={isLoading}
      />
      
      <RouteDetailsModal 
        visible={routeDetailsModalVisible}
        routeDetails={routeDetails}
        onClose={closeRouteDetailsModal}
        onShowOnMap={showRouteOnMap}
        onCancelRoute={cancelRoute}
      />
    </View>
  );
};

export default React.memo(RouteOptimizationScreen);
