import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import SettingsScreen from '../screens/settings/SettingsScreen';
import { SettingsStackParamList } from './types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

// Sabit ekran konfigürasyonları
const SETTINGS_SCREEN_CONFIG = Object.freeze({
  SettingsList: {
    title: 'Ayarlar',
    component: SettingsScreen
  }
});

const SettingsNavigator = React.memo(() => {
  const theme = useTheme();

  // Navigator seçeneklerini memoize et
  const navigatorScreenOptions = useMemo<NativeStackNavigationOptions>(() => ({
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    // Performans için ek ayarlar
    animation: 'slide_from_right',
    gestureEnabled: true,
    detachInactiveScreens: true
  }), [theme]);

  // Ekran tanımlamalarını memoize et
  const SettingsScreens = useMemo(() => (
    Object.entries(SETTINGS_SCREEN_CONFIG).map(([name, config]) => (
      <Stack.Screen
        key={name}
        name={name as keyof SettingsStackParamList}
        component={config.component}
        options={{
          title: config.title,
          lazy: true
        }}
      />
    ))
  ), []);

  return (
    <Stack.Navigator
      screenOptions={navigatorScreenOptions}
      // Performans için ek ayarlar
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      {SettingsScreens}
    </Stack.Navigator>
  );
});

export default SettingsNavigator;
