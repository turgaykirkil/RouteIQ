import React, { useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal, 
  Dimensions, 
  FlatList,
  TouchableOpacity 
} from 'react-native';
import { 
  Text, 
  useTheme, 
  Button 
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../../types/customer';

interface RouteDetailsModalProps {
  visible: boolean;
  routeDetails: {
    customers: Customer[];
    distance: number;
    duration: number;
  } | null;
  onClose: () => void;
  onShowOnMap: () => void;
  onCancelRoute: () => void;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({ 
  visible, 
  routeDetails, 
  onClose, 
  onShowOnMap, 
  onCancelRoute 
}) => {
  const theme = useTheme();
  const MAX_MODAL_HEIGHT = Dimensions.get('window').height * 0.8;

  const styles = useMemo(() => StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: MAX_MODAL_HEIGHT,
      padding: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    routeOverview: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      backgroundColor: theme.colors.background,
      padding: 12,
      borderRadius: 8,
    },
    routeOverviewItem: {
      alignItems: 'center',
    },
    routeOverviewLabel: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
    },
    routeOverviewValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    customerListTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.colors.onSurface,
    },
    customerListContainer: {
      marginBottom: 16,
    },
    customerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    customerName: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
    },
    orderIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    orderText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 16,
    },
    cancelButton: {
      flex: 1,
      marginRight: 8,
    },
    showMapButton: {
      flex: 1,
    },
    closeTextButton: {
      marginTop: 16,
    },
  }), [theme]);

  const renderCustomerItem = ({ item, index }: { item: Customer, index: number }) => (
    <View style={styles.customerItem}>
      <View style={styles.orderIndicator}>
        <Text style={styles.orderText}>{index + 1}</Text>
      </View>
      <Text style={styles.customerName}>{item.name}</Text>
      <MaterialCommunityIcons 
        name="map-marker" 
        size={24} 
        color={theme.colors.primary} 
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Rota Detayları</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={theme.colors.onSurface} 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.routeOverview}>
            <View style={styles.routeOverviewItem}>
              <Text style={styles.routeOverviewLabel}>Toplam Mesafe</Text>
              <Text style={styles.routeOverviewValue}>
                {routeDetails?.distance ? `${routeDetails.distance.toFixed(1)} km` : '-'}
              </Text>
            </View>
            <View style={styles.routeOverviewItem}>
              <Text style={styles.routeOverviewLabel}>Tahmini Süre</Text>
              <Text style={styles.routeOverviewValue}>
                {routeDetails?.duration ? `${routeDetails.duration.toFixed(0)} dk` : '-'}
              </Text>
            </View>
          </View>

          <Text style={styles.customerListTitle}>Müşteri Sırası</Text>
          <View style={styles.customerListContainer}>
            <FlatList
              data={routeDetails?.customers || []}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={
                <Text>Müşteri bulunamadı</Text>
              }
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button 
              mode="outlined" 
              onPress={onCancelRoute} 
              style={styles.cancelButton}
            >
              Rotadan Vazgeç
            </Button>
            <Button 
              mode="contained" 
              onPress={onShowOnMap} 
              style={styles.showMapButton}
            >
              Haritada Göster
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(RouteDetailsModal);
