import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme, Text, Searchbar } from 'react-native-paper';
import MapView, { 
  Marker, 
  PROVIDER_DEFAULT, 
  Polyline,
  MapViewProps,
  Region
} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import customerService from '../../services/customerService';
import { Customer } from '../../types';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Location {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

const MapScreen = () => {
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState<Region>({
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  
  const [savedLocations, setSavedLocations] = useState<Location[]>([
    {
      id: '1',
      title: 'Merkez',
      description: 'Ana Konum',
      coordinate: {
        latitude: 41.0082,
        longitude: 28.9784,
      },
    },
  ]);

  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // Kullanıcının rolüne göre müşterileri çek
        const fetchedCustomers = await customerService.getCustomers({
          userId: loggedInUser?.id
        });

        // Koordinatları olan müşterileri filtrele
        const customersWithCoordinates = fetchedCustomers.filter(
          customer => 
            customer.address?.coordinates?.lat && 
            customer.address?.coordinates?.lng
        );

        setCustomers(customersWithCoordinates);
      } catch (error) {
        console.error('Müşteri koordinatları çekilemedi:', error);
      }
    };

    if (loggedInUser) {
      fetchCustomers();
    }
  }, [loggedInUser]);

  const onSearchLocation = () => {
    // Burada gerçek bir geocoding servisi kullanılabilir
    // Örnek: Google Places API, Mapbox Geocoding API
  };

  const addLocation = () => {
    const newLocation: Location = {
      id: String(savedLocations.length + 1),
      title: `Konum ${savedLocations.length + 1}`,
      description: 'Yeni Konum',
      coordinate: {
        latitude: region.latitude,
        longitude: region.longitude,
      },
    };
    setSavedLocations([...savedLocations, newLocation]);
  };

  const calculateRoute = () => {
    if (selectedLocations.length >= 2) {
      // Burada gerçek bir rota API'si kullanılabilir
      // Örnek: Google Directions API, Mapbox Directions API
      const routePoints = selectedLocations.map(loc => loc.coordinate);
      setRouteCoordinates(routePoints);
    }
  };

  const selectLocation = (location: Location) => {
    if (!selectedLocations.find(loc => loc.id === location.id)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const mapStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: theme.dark ? '#242f3e' : '#f5f5f5',
        },
      ],
    },
    // Daha fazla stil eklenebilir
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Konum ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={onSearchLocation}
          style={styles.searchBar}
        />
      </View>
      
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={mapStyle}
      >
        {customers.map((customer) => (
          <Marker
            key={customer.id}
            coordinate={{
              latitude: customer.address.coordinates.lat,
              longitude: customer.address.coordinates.lng
            }}
            title={customer.name}
            description={customer.company}
          />
        ))}
        
        {savedLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={location.coordinate}
            title={location.title}
            description={location.description}
            onPress={() => selectLocation(location)}
          />
        ))}
        
        {routeCoordinates.length >= 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={addLocation}
        >
          <Icon name="add-location" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={calculateRoute}
          disabled={selectedLocations.length < 2}
        >
          <Icon name="directions" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  searchBar: {
    elevation: 5,
    borderRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    gap: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default MapScreen;
