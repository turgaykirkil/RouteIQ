import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
  const theme = useTheme();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollContainer: {
          flexGrow: 1,
          padding: theme.spacing.lg,
        },
        headerContainer: {
          alignItems: 'center',
          marginVertical: theme.spacing.xl,
        },
        headerText: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: theme.spacing.sm,
          textAlign: 'center',
          color: theme.colors.primary,
        },
        subHeaderText: {
          fontSize: 16,
          marginBottom: theme.spacing.lg,
          textAlign: 'center',
          color: theme.colors.onSurfaceVariant,
        },
        formContainer: {
          marginTop: theme.spacing.lg,
        },
        input: {
          marginBottom: theme.spacing.sm,
        },
        errorText: {
          color: theme.colors.error,
          marginBottom: theme.spacing.sm,
          fontSize: 12,
        },
        button: {
          marginVertical: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        },
        loginContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: theme.spacing.lg,
        },
        linkText: {
          color: theme.colors.primary,
          fontSize: 16,
        },
        successContainer: {
          marginTop: theme.spacing.xl,
          alignItems: 'center',
        },
        successText: {
          fontSize: 16,
          color: theme.colors.success,
          textAlign: 'center',
          marginBottom: theme.spacing.lg,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Reset Password</Text>
          <Text style={styles.subHeaderText}>
            Enter your email address and we'll send you instructions to reset your password.
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

                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                  buttonColor={theme.colors.primary}
                >
                  Send Reset Instructions
                </Button>
              </View>
            )}
          </Formik>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Password reset instructions have been sent to your email address.
              Please check your inbox.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Login')}
              style={styles.button}
              buttonColor={theme.colors.primary}
            >
              Return to Login
            </Button>
          </View>
        )}

        <View style={styles.loginContainer}>
          <Text>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
