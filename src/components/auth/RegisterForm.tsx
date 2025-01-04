import React, { useState } from 'react';
import {
  View,
  StyleSheet,
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
import * as Yup from 'yup';
import { Formik } from 'formik';

const { width, height } = Dimensions.get('window');

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

interface RegisterFormProps {
  onRegistrationSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistrationSuccess }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
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
      
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
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
              error={touched.email && !!errors.email}
              style={styles.input}
              keyboardType="email-address"
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
              error={touched.password && !!errors.password}
              secureTextEntry={secureTextEntry}
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
              label="Şifre Tekrar"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={touched.confirmPassword && !!errors.confirmPassword}
              secureTextEntry={secureConfirmTextEntry}
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
              style={styles.button}
              labelStyle={styles.buttonLabel}
              loading={loading}
              disabled={loading}
            >
              Kayıt Ol
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default RegisterForm;
