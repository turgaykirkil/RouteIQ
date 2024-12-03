import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Ad alanı zorunludur'),
  lastName: Yup.string().required('Soyad alanı zorunludur'),
  email: Yup.string().email('Geçersiz e-posta adresi').required('E-posta adresi zorunludur'),
  password: Yup.string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .required('Şifre zorunludur'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

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
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: width * 0.06,
          paddingVertical: height * 0.04,
        },
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
        formContainer: {
          width: '100%',
          backgroundColor: theme.colors.background,
        },
        input: {
          marginBottom: height * 0.02,
          backgroundColor: 'transparent',
        },
        button: {
          marginVertical: height * 0.02,
          padding: 6,
          borderRadius: 8,
        },
        buttonLabel: {
          fontSize: 16,
          fontWeight: 'bold',
        },
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
        errorText: {
          color: theme.colors.error,
          fontSize: 12,
          marginTop: -height * 0.01,
          marginBottom: height * 0.01,
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        halfInput: {
          flex: 0.48,
        },
      }),
    [theme]
  );

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await dispatch(register(values)).unwrap();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              RouteIQ'ya hoş geldiniz. Hemen ücretsiz hesabınızı oluşturun ve müşterilerinizi
              yönetmeye başlayın.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View>
                  <View style={styles.row}>
                    <View style={styles.halfInput}>
                      <TextInput
                        mode="flat"
                        label="Ad"
                        value={values.firstName}
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        error={touched.firstName && !!errors.firstName}
                        style={styles.input}
                        left={<TextInput.Icon icon="account" />}
                      />
                      {touched.firstName && errors.firstName && (
                        <Text style={styles.errorText}>{errors.firstName}</Text>
                      )}
                    </View>

                    <View style={styles.halfInput}>
                      <TextInput
                        mode="flat"
                        label="Soyad"
                        value={values.lastName}
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        error={touched.lastName && !!errors.lastName}
                        style={styles.input}
                        left={<TextInput.Icon icon="account" />}
                      />
                      {touched.lastName && errors.lastName && (
                        <Text style={styles.errorText}>{errors.lastName}</Text>
                      )}
                    </View>
                  </View>

                  <TextInput
                    mode="flat"
                    label="E-posta"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={touched.email && !!errors.email}
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    mode="flat"
                    label="Şifre"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={secureTextEntry}
                    error={touched.password && !!errors.password}
                    style={styles.input}
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

                  <TextInput
                    mode="flat"
                    label="Şifre Tekrarı"
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    secureTextEntry={secureConfirmTextEntry}
                    error={touched.confirmPassword && !!errors.confirmPassword}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={secureConfirmTextEntry ? 'eye-off' : 'eye'}
                        onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                      />
                    }
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                  >
                    Hesap Oluştur
                  </Button>

                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Zaten bir hesabınız var mı?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                      <Text style={styles.loginLink}>Giriş Yap</Text>
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

export default RegisterScreen;
