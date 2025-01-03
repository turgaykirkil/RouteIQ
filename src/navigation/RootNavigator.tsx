import React, { useEffect, useMemo, useCallback } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { checkAuth } from '../store/slices/authSlice';
import { ActivityIndicator, View } from 'react-native';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ProfileNavigator from './ProfileNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading Component'i optimize et ve memoize et
const LoadingComponent = React.memo(({ theme }) => (
  <View 
    style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background 
    }}
    testID="loading-container"
  >
    <ActivityIndicator 
      size="large" 
      color={theme.colors.primary} 
      testID="root-loading-indicator"
      accessibilityLabel="Yükleniyor"
    />
  </View>
), (prevProps, nextProps) => prevProps.theme === nextProps.theme);

const RootNavigator = React.memo(() => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();

  // Auth kontrol fonksiyonunu optimize et
  const checkAuthStatus = useCallback(async () => {
    try {
      await dispatch(checkAuth()).unwrap();
    } catch (error) {
      console.error('Auth kontrol hatası', error);
    }
  }, [dispatch]);

  // Auth kontrol efekti
  useEffect(() => {
    checkAuthStatus();
    
    // Cleanup fonksiyonu
    return () => {
      // Gerekirse temizleme işlemleri
    };
  }, [checkAuthStatus]);

  // Loading durumunu memoize et
  const LoadingView = useMemo(() => {
    return loading ? <LoadingComponent theme={theme} /> : null;
  }, [loading, theme]);

  // Navigator seçeneklerini memoize et ve optimize et
  const navigatorOptions = useMemo(() => ({
    headerShown: false,
    animation: 'slide_from_right',
    detachInactiveScreens: true,
    lazy: true,
    // Performans için ek ayarlar
    freezeOnBlur: true
  }), []);

  // Ekran gruplarını memoize et
  const AuthScreenGroup = useMemo(() => (
    <Stack.Group screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen 
        name="Auth" 
        component={AuthNavigator} 
        options={{ 
          // Performans için lazy loading
          lazy: true 
        }}
      />
    </Stack.Group>
  ), []);

  const MainScreenGroup = useMemo(() => (
    <Stack.Group screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen 
        name="Main" 
        component={MainNavigator} 
        options={{ 
          // Performans için lazy loading
          lazy: true 
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileNavigator} 
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom',
          lazy: true
        }}
      />
    </Stack.Group>
  ), []);

  // Error handling ekle
  if (error) {
    console.error('Auth Error:', error);
    // Hata durumunda kullanıcıya bilgi verebilirsin
  }

  // Loading durumunda loading view göster
  if (loading) {
    return LoadingView;
  }

  return (
    <Stack.Navigator 
      screenOptions={navigatorOptions}
      // Performans için ek ayarlar
      sceneContainerStyle={{ 
        backgroundColor: 'transparent',
        // Performans için ek stil
        overflow: 'hidden'
      }}
    >
      {!isAuthenticated ? AuthScreenGroup : MainScreenGroup}
    </Stack.Navigator>
  );
}, (prevProps, nextProps) => true);

export default RootNavigator;
