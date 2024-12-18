import React, { useState, useMemo, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking, Alert } from 'react-native';
import {
  Text,
  Searchbar,
  FAB,
  useTheme,
  ActivityIndicator,
  Chip,
  Avatar,
  IconButton,
  Portal,
  Modal,
  Button,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';
import { useCustomers } from '../../hooks/useCustomers';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Swipeable } from 'react-native-gesture-handler';

const CustomerListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CustomerStackNavigationProp>();
  const { customers, loading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton
            icon="map"
            iconColor={theme.colors.surface}
            size={24}
            onPress={() => navigation.navigate('CustomerMap')}
          />
          <IconButton
            icon="chart-bar"
            iconColor={theme.colors.surface}
            size={24}
            onPress={() => navigation.navigate('CustomerAnalytics')}
          />
        </View>
      ),
    });
  }, [navigation, theme.colors]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        header: {
          padding: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        searchBar: {
          marginBottom: 8,
          elevation: 0,
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
        filterContainer: {
          flexDirection: 'row',
          paddingHorizontal: 16,
        },
        filterChip: {
          flex: 1,
          marginRight: 8,
          height: 32,
        },
        chipLabel: {
          fontSize: 12,
        },
        customerListContainer: {
          paddingVertical: 8,
        },
        customerItem: {
          backgroundColor: theme.colors.surface,
          marginHorizontal: 16,
          marginVertical: 6,
          padding: 16,
          borderRadius: 12,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          flexDirection: 'row',
          alignItems: 'center',
        },
        customerInfo: {
          flex: 1,
          marginLeft: 12,
        },
        customerHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        },
        customerName: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.colors.onSurface,
          flex: 1,
          marginRight: 8,
        },
        customerType: {
          fontSize: 12,
          color: theme.colors.primary,
          fontWeight: '500',
        },
        customerDetails: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
        },
        detailText: {
          fontSize: 13,
          color: theme.colors.onSurfaceVariant,
          marginLeft: 4,
        },
        detailContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 16,
        },
        detailIcon: {
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
        },
        emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        },
        emptyText: {
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: 8,
        },
        emptyIcon: {
          marginBottom: 12,
          opacity: 0.7,
        },
        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        },
        avatar: {
          backgroundColor: theme.colors.primaryContainer,
        },
        rightActions: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 6,
          marginLeft: -8,
        },
        actionButton: {
          justifyContent: 'center',
          alignItems: 'center',
          width: 64,
          height: '100%',
        },
        actionButtonCall: {
          backgroundColor: theme.colors.primary,
        },
        actionButtonMap: {
          backgroundColor: theme.colors.secondary,
        },
        modalContainer: {
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          borderRadius: 8,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 16,
          textAlign: 'center',
        },
        modalContent: {
          marginBottom: 20,
        },
        modalActions: {
          flexDirection: 'row',
          justifyContent: 'space-around',
        },
      }),
    [theme]
  );

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const handleCall = (customer: any) => {
    setSelectedCustomer(customer);
    setIsCallModalVisible(true);
  };

  const handleCallConfirm = () => {
    if (selectedCustomer?.phone) {
      Linking.openURL(`tel:${selectedCustomer.phone}`);
    }
    setIsCallModalVisible(false);
  };

  const handleMapNavigation = (customer: any) => {
    console.log('Müşteri koordinatları:', customer.address?.coordinates);
    
    if (customer.address?.coordinates) {
      const { lat, lng } = customer.address.coordinates;
      const url = `maps://app?daddr=${lat},${lng}`;
      
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          const browserUrl = `https://maps.apple.com/?daddr=${lat},${lng}`;
          Linking.openURL(browserUrl).catch((err) => {
            console.error('Harita açılırken bir hata oluştu:', err);
            Alert.alert(
              'Hata',
              'Harita uygulaması açılamadı. Lütfen cihazınızda harita uygulamasının yüklü olduğundan emin olun.'
            );
          });
        }
      });
    } else {
      Alert.alert(
        'Uyarı',
        'Bu müşteri için konum bilgisi bulunmamaktadır.'
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Müşteri ara..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
        </View>

        {filteredCustomers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={48}
              color={theme.colors.onSurfaceVariant}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz müşteri eklenmemiş'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.customerListContainer}>
            {filteredCustomers.map((customer) => (
              <Swipeable
                key={customer.id}
                renderRightActions={() => (
                  <View style={styles.rightActions}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.actionButtonCall]}
                      onPress={() => handleCall(customer)}
                    >
                      <MaterialCommunityIcons name="phone" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.actionButtonMap]}
                      onPress={() => handleMapNavigation(customer)}
                    >
                      <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              >
                <TouchableOpacity
                  style={styles.customerItem}
                  onPress={() => navigation.navigate('CustomerDetail', { customerId: customer.id })}
                >
                  <Avatar.Text
                    size={40}
                    label={customer.name.substring(0, 2).toUpperCase()}
                    style={styles.avatar}
                  />
                  <View style={styles.customerInfo}>
                    <View style={styles.customerHeader}>
                      <Text style={styles.customerName} numberOfLines={1}>
                        {customer.name}
                      </Text>
                      <Text style={styles.customerType}>
                        {customer.type === 'corporate' ? 'Kurumsal' : 'Bireysel'}
                      </Text>
                    </View>
                    <View style={styles.customerDetails}>
                      <View style={styles.detailContainer}>
                        <MaterialCommunityIcons name="phone" style={styles.detailIcon} />
                        <Text style={styles.detailText}>{customer.phone}</Text>
                      </View>
                      <View style={styles.detailContainer}>
                        <MaterialCommunityIcons name="map-marker-distance" style={styles.detailIcon} />
                        <Text style={styles.detailText}>
                          {customer.distance ? `${customer.distance} km` : 'Mesafe bilgisi yok'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            ))}
          </ScrollView>
        )}

        <Portal>
          <Modal
            visible={isCallModalVisible}
            onDismiss={() => setIsCallModalVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Müşteri Araması</Text>
            <View style={styles.modalContent}>
              <Text>{selectedCustomer?.name}</Text>
              <Text>{selectedCustomer?.phone}</Text>
            </View>
            <View style={styles.modalActions}>
              <Button 
                mode="outlined" 
                onPress={() => setIsCallModalVisible(false)}
              >
                İptal
              </Button>
              <Button 
                mode="contained" 
                onPress={handleCallConfirm}
              >
                Ara
              </Button>
            </View>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('NewCustomer')}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomerListScreen;
