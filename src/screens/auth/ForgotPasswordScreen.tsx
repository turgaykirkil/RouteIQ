import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçersiz e-posta adresi')
    .required('E-posta adresi gerekli'),
});

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const theme = useTheme();
  const [isEmailSent, setIsEmailSent] = useState(false);

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
        scrollContainer: {
          flexGrow: 1,
          paddingHorizontal: width * 0.06,
          paddingVertical: height * 0.04,
        },
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
        formContainer: {
          marginTop: height * 0.02,
        },
        input: {
          marginBottom: height * 0.02,
          backgroundColor: 'transparent',
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: height * 0.02,
          fontSize: 12,
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
          marginTop: height * 0.04,
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
        successContainer: {
          marginTop: height * 0.04,
          alignItems: 'center',
          paddingHorizontal: width * 0.08,
        },
        successText: {
          fontSize: 16,
          color: '#4CAF50',
          textAlign: 'center',
          marginBottom: height * 0.04,
          lineHeight: 24,
        },
      }),
    [theme]
  );

  const handleResetPassword = async (values: { email: string }) => {
    try {
      // TODO: Implement password reset logic
      console.log('Reset password for:', values.email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
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
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Şifrenizi mi Unuttunuz?</Text>
            <Text style={styles.subHeaderText}>
              E-posta adresinizi girin, şifrenizi sıfırlamanız için size talimatları gönderelim.
            </Text>
          </View>

          {!isEmailSent ? (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleResetPassword}
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
                    mode="flat"
                    label="E-posta Adresi"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && !!errors.email}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                    loading={isSubmitting}
                  >
                    Şifre Sıfırlama Talimatlarını Gönder
                  </Button>
                </View>
              )}
            </Formik>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                Şifre sıfırlama talimatları e-posta adresinize gönderildi.
                Lütfen gelen kutunuzu kontrol edin.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Giriş Ekranına Dön
              </Button>
            </View>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Şifrenizi hatırladınız mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
