import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Text,
  Portal,
  Dialog,
  Divider,
} from 'react-native-paper';
import { CustomerStackParamList } from '../../navigation/types';
import { Customer } from '../../types/customer';
import { updateCustomer } from '../../store/slices/customerSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

type EditCustomerScreenProps = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'EditCustomer'>;
  route: RouteProp<CustomerStackParamList, 'EditCustomer'>;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('ZIP code is required'),
    country: Yup.string().required('Country is required'),
  }),
  notes: Yup.string(),
});

const EditCustomerScreen: React.FC<EditCustomerScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { customerId } = route.params;
  const { selectedCustomer: customer, loading } = useSelector(
    (state: RootState) => state.customers
  );
  const [discardDialogVisible, setDiscardDialogVisible] = React.useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 16,
    },
    input: {
      marginBottom: 8,
      backgroundColor: theme.colors.surface,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
    halfInput: {
      flex: 1,
    },
    divider: {
      marginVertical: 24,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      gap: 16,
    },
    button: {
      flex: 1,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    cancelButton: {
      borderColor: theme.colors.error,
    },
    cancelButtonText: {
      color: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      marginTop: 4,
    },
  });

  const handleSubmit = async (values: Partial<Customer>) => {
    try {
      await dispatch(updateCustomer({ id: customerId, ...values }));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update customer:', error);
    }
  };

  if (!customer || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={customer}
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
          dirty,
        }) => (
          <View style={styles.form}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <TextInput
                mode="outlined"
                label="Name"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={touched.name && !!errors.name}
                style={styles.input}
              />
              {touched.name && errors.name && (
                <HelperText type="error" style={styles.errorText}>{errors.name}</HelperText>
              )}

              <TextInput
                mode="outlined"
                label="Company"
                value={values.company}
                onChangeText={handleChange('company')}
                onBlur={handleBlur('company')}
                error={touched.company && !!errors.company}
                style={styles.input}
              />
              {touched.company && errors.company && (
                <HelperText type="error" style={styles.errorText}>{errors.company}</HelperText>
              )}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <TextInput
                mode="outlined"
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && !!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {touched.email && errors.email && (
                <HelperText type="error" style={styles.errorText}>{errors.email}</HelperText>
              )}

              <TextInput
                mode="outlined"
                label="Phone"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={touched.phone && !!errors.phone}
                keyboardType="phone-pad"
                style={styles.input}
              />
              {touched.phone && errors.phone && (
                <HelperText type="error" style={styles.errorText}>{errors.phone}</HelperText>
              )}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Address</Text>
              <TextInput
                mode="outlined"
                label="Street"
                value={values.address.street}
                onChangeText={handleChange('address.street')}
                onBlur={handleBlur('address.street')}
                error={touched.address?.street && !!errors.address?.street}
                style={styles.input}
              />
              {touched.address?.street && errors.address?.street && (
                <HelperText type="error" style={styles.errorText}>{errors.address.street}</HelperText>
              )}

              <TextInput
                mode="outlined"
                label="City"
                value={values.address.city}
                onChangeText={handleChange('address.city')}
                onBlur={handleBlur('address.city')}
                error={touched.address?.city && !!errors.address?.city}
                style={styles.input}
              />
              {touched.address?.city && errors.address?.city && (
                <HelperText type="error" style={styles.errorText}>{errors.address.city}</HelperText>
              )}

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <TextInput
                    mode="outlined"
                    label="State"
                    value={values.address.state}
                    onChangeText={handleChange('address.state')}
                    onBlur={handleBlur('address.state')}
                    error={touched.address?.state && !!errors.address?.state}
                    style={styles.input}
                  />
                  {touched.address?.state && errors.address?.state && (
                    <HelperText type="error" style={styles.errorText}>{errors.address.state}</HelperText>
                  )}
                </View>

                <View style={styles.halfInput}>
                  <TextInput
                    mode="outlined"
                    label="ZIP Code"
                    value={values.address.zipCode}
                    onChangeText={handleChange('address.zipCode')}
                    onBlur={handleBlur('address.zipCode')}
                    error={touched.address?.zipCode && !!errors.address?.zipCode}
                    style={styles.input}
                  />
                  {touched.address?.zipCode && errors.address?.zipCode && (
                    <HelperText type="error" style={styles.errorText}>{errors.address.zipCode}</HelperText>
                  )}
                </View>
              </View>

              <TextInput
                mode="outlined"
                label="Country"
                value={values.address.country}
                onChangeText={handleChange('address.country')}
                onBlur={handleBlur('address.country')}
                error={touched.address?.country && !!errors.address?.country}
                style={styles.input}
              />
              {touched.address?.country && errors.address?.country && (
                <HelperText type="error" style={styles.errorText}>{errors.address.country}</HelperText>
              )}
            </View>

            <Divider style={styles.divider} />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <TextInput
                mode="outlined"
                label="Notes"
                value={values.notes}
                onChangeText={handleChange('notes')}
                onBlur={handleBlur('notes')}
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={[styles.button, styles.saveButton]}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  if (dirty) {
                    setDiscardDialogVisible(true);
                  } else {
                    navigation.goBack();
                  }
                }}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Button>
            </View>

            <Portal>
              <Dialog
                visible={discardDialogVisible}
                onDismiss={() => setDiscardDialogVisible(false)}
              >
                <Dialog.Title>Discard Changes?</Dialog.Title>
                <Dialog.Content>
                  <Text>
                    You have unsaved changes. Are you sure you want to discard
                    them?
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setDiscardDialogVisible(false)}>Keep Editing</Button>
                  <Button
                    onPress={() => {
                      setDiscardDialogVisible(false);
                      navigation.goBack();
                    }}
                  >
                    Discard
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default EditCustomerScreen;
