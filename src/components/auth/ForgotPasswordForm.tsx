import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { width, height } = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçersiz e-posta adresi')
    .required('E-posta adresi gerekli'),
});

interface ForgotPasswordFormProps {
  onPasswordResetRequest: (email: string) => Promise<void>;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onPasswordResetRequest }) => {
  const theme = useTheme();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
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

  const handleResetPassword = async (values: { email: string }, { setSubmitting }) => {
    try {
      await onPasswordResetRequest(values.email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successText}>
          Şifre sıfırlama talimatları e-posta adresinize gönderildi.
          Lütfen gelen kutunuzu kontrol edin.
        </Text>
      </View>
    );
  }

  return (
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
  );
};

export default ForgotPasswordForm;
