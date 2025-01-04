import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const ForgotPasswordHeader: React.FC = () => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        headerContainer: {
          alignItems: 'center',
          marginVertical: height * 0.04,
        },
        headerText: {
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: height * 0.02,
          textAlign: 'center',
          color: theme.colors.primary,
        },
        subHeaderText: {
          fontSize: 16,
          marginBottom: height * 0.04,
          textAlign: 'center',
          color: theme.colors.onSurfaceVariant,
          paddingHorizontal: width * 0.08,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Şifrenizi mi Unuttunuz?</Text>
      <Text style={styles.subHeaderText}>
        E-posta adresinizi girin, şifrenizi sıfırlamanız için size talimatları gönderelim.
      </Text>
    </View>
  );
};

export default ForgotPasswordHeader;
