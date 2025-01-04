import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const RegisterFooter: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        loginContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: height * 0.02,
        },
        loginText: {
          color: theme.colors.onSurfaceVariant,
          fontSize: 14,
        },
        loginLink: {
          color: theme.colors.primary,
          marginLeft: 4,
          fontSize: 14,
          fontWeight: 'bold',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>Zaten bir hesabınız var mı?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterFooter;
