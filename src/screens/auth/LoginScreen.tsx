import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too Short!').required('Password is required'),
});

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContainer: {
          flexGrow: 1,
          padding: 16,
        },
        logoContainer: {
          alignItems: 'center',
          marginVertical: 32,
        },
        logo: {
          width: 150,
          height: 150,
        },
        welcomeText: {
          fontSize: 24,
          marginTop: 16,
          color: theme.colors.primary,
        },
        formContainer: {
          marginTop: 32,
        },
        input: {
          marginBottom: 16,
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: 16,
        },
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        },
        button: {
          marginVertical: 16,
          paddingVertical: 8,
        },
        linkButton: {
          alignItems: 'center',
          marginVertical: 16,
        },
        linkText: {
          color: theme.colors.primary,
        },
        registerContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 32,
        },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '', rememberMe: false }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            dispatch(login(values));
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View style={styles.formContainer}>
              <TextInput
                mode="outlined"
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && !!errors.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}

              <TextInput
                mode="outlined"
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && !!errors.password}
                style={styles.input}
                secureTextEntry
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}

              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={values.rememberMe ? 'checked' : 'unchecked'}
                  onPress={() => setFieldValue('rememberMe', !values.rememberMe)}
                  color={theme.colors.primary}
                />
                <Text>Remember Me</Text>
              </View>

              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.button}
                buttonColor={theme.colors.accent}
              >
                Login
              </Button>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <View style={styles.registerContainer}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
