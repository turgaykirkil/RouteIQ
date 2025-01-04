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
import { RootStackParamList } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginFooter: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        registerContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: height * 0.03,
        },
        registerText: {
          color: theme.colors.onSurfaceVariant,
        },
        registerLink: {
          color: theme.colors.primary,
          marginLeft: 4,
          fontWeight: 'bold',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.registerContainer}>
      <Text style={styles.registerText}>Hesabınız yok mu?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginFooter;
