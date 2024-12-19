import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from '../screens/main/HomeScreen';
import TaskNavigator from './TaskNavigator';
import CustomerNavigator from './CustomerNavigator';
import RouteOptimizationScreen from '../screens/route/RouteOptimizationScreen';
import SettingsNavigator from './SettingsNavigator';

import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.background,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Tasks':
              iconName = 'clipboard-check';
              break;
            case 'Route':
              iconName = 'map-marker-path';
              break;
            case 'Customers':
              iconName = 'account-group';
              break;
            case 'Settings':
              iconName = 'cog';
              break;
            default:
              iconName = 'circle';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Ana Sayfa' }} 
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskNavigator} 
        options={{ title: 'Görevler' }} 
      />
      <Tab.Screen 
        name="Route" 
        component={RouteOptimizationScreen} 
        options={{ title: 'Rota' }} 
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomerNavigator} 
        options={{ title: 'Müşteriler' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsNavigator}
        options={{ title: 'Ayarlar' }} 
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
