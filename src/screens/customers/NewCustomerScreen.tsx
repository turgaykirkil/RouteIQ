import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';

type NewCustomerScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'NewCustomer'>;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      'Phone number must be in format (XXX) XXX-XXXX'
    )
    .required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  notes: Yup.string(),
});

type CustomerFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

const initialValues: CustomerFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

const NewCustomerScreen = ({ navigation }: NewCustomerScreenProps) => {
  const theme = useTheme();
  
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
        },
        form: {
          flex: 1,
        },
        input: {
          marginBottom: 4,
          backgroundColor: theme.colors.surface,
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
          marginBottom: 24,
        },
        button: {
          flex: 1,
          marginHorizontal: 8,
        },
      }),
    [theme]
  );

  const handleSubmit = (values: CustomerFormValues) => {
    // TODO: Implement API call to create customer
    console.log('Creating customer:', values);
    navigation.goBack();
  };

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
            <View style={styles.form}>
              <TextInput
                label="Name"
                mode="outlined"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && !!errors.name}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.name && !!errors.name}>
                {errors.name}
              </HelperText>

              <TextInput
                label="Company"
                mode="outlined"
                value={values.company}
                onChangeText={handleChange('company')}
                onBlur={handleBlur('company')}
                error={touched.company && !!errors.company}
                style={styles.input}
              />
              <HelperText
                type="error"
                visible={touched.company && !!errors.company}
              >
                {errors.company}
              </HelperText>

              <TextInput
                label="Email"
                mode="outlined"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && !!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              <HelperText type="error" visible={touched.email && !!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Phone"
                mode="outlined"
                value={values.phone}
                onChangeText={(value) => {
                  const formattedValue = formatPhoneNumber(value);
                  setFieldValue('phone', formattedValue);
                }}
                onBlur={handleBlur('phone')}
                error={touched.phone && !!errors.phone}
                keyboardType="phone-pad"
                style={styles.input}
              />
              <HelperText type="error" visible={touched.phone && !!errors.phone}>
                {errors.phone}
              </HelperText>

              <TextInput
                label="Address"
                mode="outlined"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && !!errors.address}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
              <HelperText
                type="error"
                visible={touched.address && !!errors.address}
              >
                {errors.address}
              </HelperText>

              <TextInput
                label="Notes"
                mode="outlined"
                value={values.notes}
                onChangeText={handleChange('notes')}
                onBlur={handleBlur('notes')}
                error={touched.notes && !!errors.notes}
                style={styles.input}
                multiline
                numberOfLines={4}
              />
              <HelperText type="error" visible={touched.notes && !!errors.notes}>
                {errors.notes}
              </HelperText>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                >
                  Create Customer
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default NewCustomerScreen;
