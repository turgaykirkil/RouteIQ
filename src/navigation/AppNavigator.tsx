import React, { useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';

import LoginScreen from '../screens/auth/LoginScreen';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import { RootStackParamList } from './types';
import { RootState } from '../store/store';
import { checkAuthStatus } from '../store/authSlice';
import LoadingScreen from '../screens/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Performans için useEffect optimize edildi
  useEffect(() => {
    const checkAuth = () => dispatch(checkAuthStatus());
    checkAuth();
    
    // Cleanup fonksiyonu
    return () => {
      // Gerekirse temizleme işlemleri
    };
  }, [dispatch]);

  // Yükleme durumunu memoize et
  const LoadingComponent = useMemo(() => {
    return isLoading ? <LoadingScreen /> : null;
  }, [isLoading]);

  // Navigator'ı memoize et
  const Navigator = useMemo(() => {
    return (
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        animation: 'fade' // Geçiş animasyonunu optimize et
      }}>
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} 
            options={{ gestureEnabled: false }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ gestureEnabled: false }}
          />
        )}
      </Stack.Navigator>
    );
  }, [isAuthenticated]);

  // Yükleme durumunda loading ekranı
  if (isLoading) {
    return LoadingComponent;
  }

  return (
    <NavigationContainer>
      {Navigator}
    </NavigationContainer>
  );
};

// Performans için React.memo ile sarmalama
export default React.memo(AppNavigator);
