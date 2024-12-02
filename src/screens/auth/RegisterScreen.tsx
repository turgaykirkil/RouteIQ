import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import * as Yup from 'yup';
import { Formik } from 'formik';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          padding: 16,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 24,
          textAlign: 'center',
          color: theme.colors.primary,
        },
        input: {
          marginBottom: 16,
        },
        button: {
          marginTop: 24,
          marginBottom: 16,
        },
        loginContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 16,
        },
        loginText: {
          color: theme.colors.onSurfaceVariant,
        },
        loginLink: {
          color: theme.colors.primary,
          marginLeft: 4,
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: 16,
          textAlign: 'center',
        },
      }),
    [theme]
  );

  const handleRegister = async (values) => {
    try {
      setLoading(true);
      await dispatch(register(values));
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Account</Text>

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
              <TextInput
                label="First Name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                mode="outlined"
                error={touched.firstName && !!errors.firstName}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.firstName && !!errors.firstName}>
                {errors.firstName}
              </HelperText>

              <TextInput
                label="Last Name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                mode="outlined"
                error={touched.lastName && !!errors.lastName}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.lastName && !!errors.lastName}>
                {errors.lastName}
              </HelperText>

              <TextInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && !!errors.email}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.email && !!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                mode="outlined"
                secureTextEntry
                error={touched.password && !!errors.password}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.password && !!errors.password}>
                {errors.password}
              </HelperText>

              <TextInput
                label="Confirm Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                mode="outlined"
                secureTextEntry
                error={touched.confirmPassword && !!errors.confirmPassword}
                style={styles.input}
              />
              <HelperText
                type="error"
                visible={touched.confirmPassword && !!errors.confirmPassword}
              >
                {errors.confirmPassword}
              </HelperText>

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Register
              </Button>
            </View>
          )}
        </Formik>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
