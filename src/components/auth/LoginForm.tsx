import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';
import { authAPI } from '../../services/api';
import { RootStackParamList } from '../../navigation/types';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi gerekli'),
  password: Yup.string().min(6, 'Şifre çok kısa!').required('Şifre gerekli'),
});

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [rememberMe, setRememberMe] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const result = await authAPI.login(values.email, values.password);
      
      if (result.user) {
        try {
          const directory = `${RNFS.DocumentDirectoryPath}/RCTAsyncLocalStorage_V1`;
          await RNFS.mkdir(directory);
          
          await AsyncStorage.setItem('user', JSON.stringify(result.user));

          dispatch(login(result.user));
          
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            navigation.navigate('Main');
          }
        } catch (storageError) {
          console.error('Storage error:', storageError);
          dispatch(login(result.user));
          navigation.navigate('Main');
        }
      } else {
        Alert.alert('Giriş Başarısız', 'Kullanıcı bilgileri alınamadı.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Giriş Başarısız', 'Lütfen e-posta adresinizi ve şifrenizi kontrol edin.');
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        formContainer: {
          width: '100%',
          paddingHorizontal: width * 0.08,
          backgroundColor: theme.colors.background,
        },
        input: {
          marginBottom: height * 0.02,
          backgroundColor: 'transparent',
        },
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: height * 0.02,
        },
        checkboxLabel: {
          marginLeft: 8,
          color: theme.colors.onSurface,
        },
        button: {
          padding: 6,
          borderRadius: 8,
        },
        buttonLabel: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        forgotPasswordContainer: {
          alignItems: 'center',
          marginTop: height * 0.02,
        },
        forgotPasswordText: {
          color: theme.colors.primary,
          fontSize: 14,
        },
        errorText: {
          color: theme.colors.error,
          fontSize: 12,
          marginTop: 4,
          marginBottom: height * 0.01,
        },
      }),
    [theme]
  );

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.formContainer}>
          <TextInput
            label="E-posta"
            mode="outlined"
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && Boolean(errors.email)}
          />
          {touched.email && errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}

          <TextInput
            label="Şifre"
            mode="outlined"
            style={styles.input}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry={secureTextEntry}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
            error={touched.password && Boolean(errors.password)}
          />
          {touched.password && errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
            />
            <Text style={styles.checkboxLabel}>Beni Hatırla</Text>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => handleSubmit()}
          >
            Giriş Yap
          </Button>

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
