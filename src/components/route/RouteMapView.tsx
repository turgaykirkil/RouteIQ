import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions,
  Text,
  Alert
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_OPENSTREETMAP, Callout } from 'react-native-maps';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocation } from '../../hooks/useLocation';
import { useCustomers } from '../../hooks/useCustomers';
import { Customer } from '../../types/customer';
import RouteActionButtons from './RouteActionButtons';

interface RouteMapViewProps {
  selectedPoints: Array<{customer: Customer, order: number}>;
  optimizedRoute?: any;
  onCustomerPress: (customer: Customer | null) => void;
  onCalculateRoute: () => Promise<any>;
  isLoading: boolean;
}

const RouteMapView: React.FC<RouteMapViewProps> = ({ 
  selectedPoints, 
  optimizedRoute, 
  onCustomerPress,
  onCalculateRoute,
  isLoading
}) => {
  const theme = useTheme();
  const { location } = useLocation();
  const { customers } = useCustomers();
  const mapRef = useRef<MapView>(null);

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

  const clearSelection = useCallback(() => {
    onCustomerPress(null);
  }, [onCustomerPress]);

  const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    calloutContainer: {
      width: Dimensions.get('window').width * 0.7,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    calloutTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    calloutDetails: {
      fontSize: 14,
      color: '#666',
    },
    actionButtonsContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 10,
      backgroundColor: 'transparent',
    }
  });

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_OPENSTREETMAP}
        style={styles.map}
        region={mapRegion}
        showsUserLocation
        followsUserLocation
      >
        {customers && customers.map(customer => (
          customer.address?.coordinates?.lat && customer.address?.coordinates?.lng && (
            <Marker
              key={customer.id}
              coordinate={{
                latitude: customer.address.coordinates.lat,
                longitude: customer.address.coordinates.lng,
              }}
              onPress={() => onCustomerPress(customer)}
            >
              <MaterialCommunityIcons
                name="map-marker"
                size={40}
                color={selectedPoints.some(p => p.customer.id === customer.id) 
                  ? theme.colors.primary 
                  : '#808080'}
              />
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{customer.name}</Text>
                  <Text style={styles.calloutDetails}>
                    {customer.address.street}, {customer.address.city}
                  </Text>
                </View>
              </Callout>
            </Marker>
          )
        ))}

        {optimizedRoute && optimizedRoute.coordinates && (
          <Polyline
            coordinates={optimizedRoute.coordinates.map((coord: any) => ({
              latitude: coord.lat,
              longitude: coord.lng,
            }))}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.actionButtonsContainer}>
        <RouteActionButtons 
          selectedPointsCount={selectedPoints.length}
          isLoading={isLoading}
          onCalculateRoute={onCalculateRoute}
          onClearSelection={clearSelection}
        />
      </View>
    </View>
  );
};

export default React.memo(RouteMapView);
