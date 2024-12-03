import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import SettingsScreen from '../screens/settings/SettingsScreen';
import { SettingsStackParamList } from './types';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="SettingsList"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
