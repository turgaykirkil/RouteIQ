import React from 'react';
import { 
  View, 
  StyleSheet 
} from 'react-native';
import { 
  Button, 
  useTheme 
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface RouteActionButtonsProps {
  selectedPointsCount: number;
  isLoading: boolean;
  onCalculateRoute: () => void;
  onClearSelection: () => void;
}

const RouteActionButtons: React.FC<RouteActionButtonsProps> = ({ 
  selectedPointsCount, 
  isLoading,
  onCalculateRoute,
  onClearSelection 
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'transparent',
    },
    calculateButton: {
      flex: 0.7,
      marginRight: 8,
    },
    clearButton: {
      flex: 0.3,
    },
  });

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onCalculateRoute}
        disabled={selectedPointsCount < 2 || isLoading}
        loading={isLoading}
        style={styles.calculateButton}
        icon={() => (
          <MaterialCommunityIcons 
            name="map-marker-path" 
            size={20} 
            color={theme.colors.surface} 
          />
        )}
      >
        Rotayı Hesapla
      </Button>
      
      <Button
        mode="outlined"
        onPress={onClearSelection}
        disabled={selectedPointsCount === 0 || isLoading}
        style={styles.clearButton}
        icon={() => (
          <MaterialCommunityIcons 
            name="close" 
            size={20} 
            color={theme.colors.primary} 
          />
        )}
      >
        Temizle
      </Button>
    </View>
  );
};

export default React.memo(RouteActionButtons);
