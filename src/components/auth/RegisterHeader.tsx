import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const RegisterHeader: React.FC = () => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          marginBottom: height * 0.04,
        },
        title: {
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: height * 0.02,
          textAlign: 'center',
          color: theme.colors.primary,
        },
        subtitle: {
          fontSize: 16,
          textAlign: 'center',
          color: theme.colors.onSurfaceVariant,
          marginBottom: height * 0.04,
          paddingHorizontal: width * 0.08,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Hesap Oluştur</Text>
      <Text style={styles.subtitle}>
        RouteIQ'ya hoş geldiniz. Hemen ücretsiz hesabınızı oluşturun ve müşterilerinizi
        yönetmeye başlayın.
      </Text>
    </View>
  );
};

export default RegisterHeader;
