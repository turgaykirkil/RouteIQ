import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert
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
import { StatusBar } from 'react-native';
import { authAPI } from '../../services/api';
import { RootStackParamList } from '../../navigation/types';
import { useDispatch } from 'react-redux';
import { login } from '../../store/authSlice';
import * as RNFS from 'react-native-fs';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi gerekli'),
  password: Yup.string().min(6, 'Şifre çok kısa!').required('Şifre gerekli'),
});

const LoginScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [rememberMe, setRememberMe] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await AsyncStorage.getItem('userData');
      // Burada navigation kaldırıyoruz çünkü bu AppNavigator'da kontrol ediliyor
    };
    checkUserSession();
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      
      const result = await authAPI.login(values.email, values.password);
      
      if (result.user) {
        try {
          // Önce directory'nin var olduğundan emin ol
          const directory = `${RNFS.DocumentDirectoryPath}/RCTAsyncLocalStorage_V1`;
          await RNFS.mkdir(directory);
          
          // Kullanıcı bilgilerini AsyncStorage'a kaydet
          await AsyncStorage.setItem('user', JSON.stringify(result.user));

          dispatch(login(result.user));
          navigation.navigate('Main');
        } catch (storageError) {
          console.error('Storage error:', storageError);
          // Storage hatası olsa bile kullanıcıyı yönlendir
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
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollView: {
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: width * 0.06,
          paddingBottom: height * 0.05,
        },
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
        errorText: {
          color: theme.colors.error,
          fontSize: 12,
          marginTop: 4,
          marginBottom: height * 0.01,
        },
        keyboardContainer: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        },
        scrollContainer: {
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        },
        rememberContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: height * 0.02,
        },
        loginButton: {
          padding: 6,
          borderRadius: 8,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
              Müşterilerinizi yönetmek hiç bu kadar kolay olmamıştı
            </Text>
          </View>

          <Formik
            initialValues={{ email: 'admin@routeiq.com', password: '123456' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.formContainer}>
                <TextInput
                  mode="outlined"
                  label="E-posta"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && !!errors.email}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  autoComplete="email"
                  contextMenuHidden={false}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <TextInput
                  mode="outlined"
                  label="Şifre"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && !!errors.password}
                  secureTextEntry={secureTextEntry}
                  right={
                    <TextInput.Icon
                      icon={secureTextEntry ? 'eye-off' : 'eye'}
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                  }
                  style={styles.input}
                  textContentType="password"
                  autoComplete="password"
                  contextMenuHidden={false}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <View style={styles.rememberContainer}>
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <Text>Beni Hatırla</Text>
                </View>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.loginButton}
                  labelStyle={styles.buttonLabel}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Giriş Yap
                </Button>

                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={() => {
                    navigation.navigate('Auth', { screen: 'ForgotPassword' });
                  }}
                >
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Hesabınız yok mu?</Text>
                  <TouchableOpacity onPress={() => {
                    navigation.navigate('Auth', { screen: 'Register' });
                  }}>
                    <Text style={styles.registerLink}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
