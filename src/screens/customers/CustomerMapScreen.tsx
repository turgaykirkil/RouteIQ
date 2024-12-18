import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import { useCustomers } from '../../hooks/useCustomers';
import { Customer } from '../../types/customer';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CustomerMapScreen = ({ navigation }) => {
  const theme = useTheme();
  const { customers } = useCustomers();

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
      (error) => {
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
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
        {customers?.map((customer) => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.address.coordinates.lat,
              longitude: customer.address.coordinates.lng,
            }}
            onPress={() => setSelectedCustomer(customer)}
          >
            <Callout>
              <Card style={styles.calloutCard}>
                <Card.Content>
                  <Text variant="titleMedium">{customer.name}</Text>
                  <Text variant="bodyMedium">{customer.address.street}</Text>
                  <Text variant="bodyMedium">{customer.phone}</Text>
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
            <Text variant="bodyMedium">{selectedCustomer.address.street}</Text>
            <Text variant="bodyMedium">{selectedCustomer.phone}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CustomerDetail', { customerId: selectedCustomer.id })}
            >
              Detaylar
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
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 4,
    borderRadius: 8,
  },
});

export default CustomerMapScreen;
