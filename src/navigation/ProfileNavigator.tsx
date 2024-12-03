import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProfileEditScreen from '../screens/main/ProfileEditScreen';
import ProfileSettingsScreen from '../screens/main/ProfileSettingsScreen';
import { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
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
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{
          title: 'Profili Düzenle',
        }}
      />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{
          title: 'Profil Ayarları',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
