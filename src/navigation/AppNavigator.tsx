import React, { useEffect } from 'react';
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
  
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);


  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
