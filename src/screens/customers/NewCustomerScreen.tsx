import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  Text,
  HelperText,
  Surface,
  Divider,
  IconButton,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { CustomerStackNavigationProp } from '../../navigation/types';
import { createCustomer } from '../../store/slices/customerSlice';
import Geolocation from 'react-native-geolocation-service';

interface CustomerForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

const initialFormState: CustomerForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
};

const NewCustomerScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<CustomerStackNavigationProp>();
  const [form, setForm] = useState<CustomerForm>(initialFormState);
  const [errors, setErrors] = useState<Partial<CustomerForm>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<CustomerForm> = {};

    if (!form.name.trim()) {
      newErrors.name = 'İsim gerekli';
    }
    if (!form.company.trim()) {
      newErrors.company = 'Şirket adı gerekli';
    }
    if (!form.email.trim()) {
      newErrors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Telefon numarası gerekli';
    }
    if (!form.address.street.trim()) {
      newErrors.address = { ...newErrors.address, street: 'Adres gerekli' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        return true;
      }
    }

    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Konum İzni',
          message: 'Müşteri konumunu kaydetmek için konum izni gerekli',
          buttonNeutral: 'Daha Sonra Sor',
          buttonNegative: 'İptal',
          buttonPositive: 'Tamam',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return false;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      Alert.alert('Hata', 'Konum izni reddedildi');
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          address: {
            ...prev.address,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        }));
      },
      (error) => {
        Alert.alert('Hata', 'Konum alınamadı: ' + error.message);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 10000 
      }
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(createCustomer(form));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Müşteri eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof CustomerForm],
          [child]: value,
        },
      }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.surface}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Temel Bilgiler
          </Text>
          <TextInput
            mode="outlined"
            label="İsim Soyisim"
            value={form.name}
            onChangeText={(value) => updateForm('name', value)}
            error={!!errors.name}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Şirket"
            value={form.company}
            onChangeText={(value) => updateForm('company', value)}
            error={!!errors.company}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.company}>
            {errors.company}
          </HelperText>

          <TextInput
            mode="outlined"
            label="E-posta"
            value={form.email}
            onChangeText={(value) => updateForm('email', value)}
            error={!!errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Telefon"
            value={form.phone}
            onChangeText={(value) => updateForm('phone', value)}
            error={!!errors.phone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>
        </Surface>

        <Divider style={styles.divider} />

        <Surface style={styles.surface}>
          <View style={styles.addressHeader}>
            <Text variant="titleMedium">Adres Bilgileri</Text>
            <IconButton
              icon="crosshairs-gps"
              mode="contained"
              onPress={getCurrentLocation}
              size={20}
            />
          </View>

          <TextInput
            mode="outlined"
            label="Sokak/Cadde"
            value={form.address.street}
            onChangeText={(value) => updateForm('address.street', value)}
            error={!!errors.address?.street}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.address?.street}>
            {errors.address?.street}
          </HelperText>

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Şehir"
              value={form.address.city}
              onChangeText={(value) => updateForm('address.city', value)}
              style={[styles.input, styles.flex1, styles.marginRight]}
            />
            <TextInput
              mode="outlined"
              label="İlçe"
              value={form.address.state}
              onChangeText={(value) => updateForm('address.state', value)}
              style={[styles.input, styles.flex1]}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Posta Kodu"
              value={form.address.zipCode}
              onChangeText={(value) => updateForm('address.zipCode', value)}
              keyboardType="number-pad"
              style={[styles.input, styles.flex1, styles.marginRight]}
            />
            <TextInput
              mode="outlined"
              label="Ülke"
              value={form.address.country}
              onChangeText={(value) => updateForm('address.country', value)}
              style={[styles.input, styles.flex1]}
            />
          </View>
        </Surface>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Müşteri Ekle
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  flex1: {
    flex: 1,
    marginHorizontal: 4,
  },
  marginRight: {
    marginRight: 4,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    padding: 4,
  },
});

export default NewCustomerScreen;
