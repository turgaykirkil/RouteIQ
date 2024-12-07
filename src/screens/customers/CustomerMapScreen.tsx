import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import * as turf from '@turf/turf';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCustomers, fetchCustomers } from '../../store/slices/customerSlice';
import { Customer } from '../../types/customer';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CustomerMapScreen = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const customers = useAppSelector(selectCustomers);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers());
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const calculateOptimalRoute = () => {
    if (!userLocation || customers.length === 0) return [];

    // Convert customers to turf points
    const points = customers.map((customer) => 
      turf.point([customer.location.longitude, customer.location.latitude], { id: customer.id })
    );
    
    // Create a feature collection
    const collection = turf.featureCollection(points);
    
    // Calculate nearest points in sequence
    let route = [];
    let currentPoint = turf.point([userLocation.longitude, userLocation.latitude]);
    let remainingPoints = [...points];

    while (remainingPoints.length > 0) {
      const nearest = turf.nearest(currentPoint, turf.featureCollection(remainingPoints));
      route.push(nearest);
      currentPoint = nearest;
      remainingPoints = remainingPoints.filter(
        (point) => point.properties.id !== nearest.properties.id
      );
    }

    return route;
  };

  const getCustomerMarkerColor = (customer: Customer) => {
    switch (customer.status) {
      case 'active':
        return theme.colors.primary;
      case 'inactive':
        return theme.colors.error;
      case 'pending':
        return theme.colors.warning;
      default:
        return theme.colors.disabled;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.location.latitude,
              longitude: customer.location.longitude,
            }}
            pinColor={getCustomerMarkerColor(customer)}
            onPress={() => setSelectedCustomer(customer)}
          >
            <Callout>
              <Card style={styles.calloutCard}>
                <Card.Content>
                  <Text variant="titleMedium">{customer.name}</Text>
                  <Text variant="bodyMedium">{customer.company}</Text>
                  <Text variant="bodySmall">{customer.address.street}</Text>
                  <Text variant="bodySmall">
                    {customer.address.city}, {customer.address.state}{' '}
                    {customer.address.zipCode}
                  </Text>
                </Card.Content>
              </Card>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedCustomer && (
        <Card style={styles.customerCard}>
          <Card.Content>
            <Text variant="titleLarge">{selectedCustomer.name}</Text>
            <Text variant="bodyLarge">{selectedCustomer.company}</Text>
            <Text variant="bodyMedium">
              Last Visit: {new Date(selectedCustomer.lastVisit).toLocaleDateString()}
            </Text>
            <View style={styles.statsContainer}>
              <Text variant="bodySmall">
                Total Orders: {selectedCustomer.statistics.totalOrders}
              </Text>
              <Text variant="bodySmall">
                Revenue: ${selectedCustomer.statistics.totalRevenue.toLocaleString()}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate('CustomerDetail', {
                  customerId: selectedCustomer.id,
                })
              }
            >
              View Details
            </Button>
            <Button
              mode="outlined"
              onPress={() => setSelectedCustomer(null)}
            >
              Close
            </Button>
          </Card.Actions>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutCard: {
    minWidth: 200,
  },
  customerCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default CustomerMapScreen;
