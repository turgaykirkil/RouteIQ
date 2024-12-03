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
import { useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { login } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi gerekli'),
  password: Yup.string().min(6, 'Şifre çok kısa!').required('Şifre gerekli'),
});

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        navigation.navigate('Main');
      }
    };
    checkUserSession();
  }, [navigation]);

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
          marginBottom: height * 0.04,
        },
        logo: {
          width: width * 0.3,
          height: width * 0.3,
          marginBottom: height * 0.02,
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
      }),
    [theme]
  );

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login({ email: values.email.toLowerCase(), password: values.password, rememberMe })).unwrap();
      navigation.navigate('Main');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
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

          <View style={styles.formContainer}>
            <Formik
              initialValues={{ email: '', password: '' }}
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
                <View>
                  <TextInput
                    mode="flat"
                    label="E-posta Adresi"
                    style={styles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    error={touched.email && !!errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    mode="flat"
                    label="Şifre"
                    style={styles.input}
                    secureTextEntry={secureTextEntry}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    error={touched.password && !!errors.password}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={secureTextEntry ? 'eye-off' : 'eye'}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                      />
                    }
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
                    onPress={handleSubmit}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Giriş Yap
                  </Button>

                  <TouchableOpacity
                    style={styles.forgotPasswordContainer}
                    onPress={() => navigation.navigate('ForgotPassword')}
                  >
                    <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                  </TouchableOpacity>

                  <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Hesabınız yok mu?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                      <Text style={styles.registerLink}>Kayıt Ol</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
