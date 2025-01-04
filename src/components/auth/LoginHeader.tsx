import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

const LoginHeader: React.FC = () => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        logoContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: height * 0.05,
          marginBottom: height * 0.03,
        },
        logo: {
          width: width * 0.5,
          height: height * 0.15,
        },
        welcomeContainer: {
          alignItems: 'center',
          marginBottom: height * 0.04,
          paddingHorizontal: width * 0.08,
        },
        welcomeText: {
          fontSize: 28,
          fontWeight: 'bold',
          color: theme.colors.primary,
          textAlign: 'center',
        },
        welcomeSubText: {
          fontSize: 16,
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          marginTop: 8,
        },
      }),
    [theme]
  );

  return (
    <>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>RouteIQ'ya Hoş Geldiniz</Text>
        <Text style={styles.welcomeSubText}>
          Hesabınıza giriş yaparak çalışmaya başlayın
        </Text>
      </View>
    </>
  );
};

export default LoginHeader;
