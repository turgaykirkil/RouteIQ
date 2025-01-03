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
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Performans için sabit icon mapping
const TAB_ICONS: Record<keyof MainTabParamList, string> = Object.freeze({
  'Home': 'home',
  'Tasks': 'clipboard-check',
  'Route': 'map-marker-path',
  'Customers': 'account-group',
  'Settings': 'cog'
});

// Performans için memoize edilmiş icon fonksiyonu
const createTabBarIcon = (route: { name: keyof MainTabParamList }) => {
  const iconName = TAB_ICONS[route.name] || 'circle';
  
  return ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons 
      name={iconName} 
      size={size} 
      color={color} 
      key={iconName}
    />
  );
};

const MainNavigator = () => {
  const theme = useTheme();

  // Performans için optimize edilmiş screenOptions
  const screenOptions = ({ route }: { route: { name: keyof MainTabParamList } }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.disabled,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    tabBarIcon: createTabBarIcon(route)
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      detachInactiveScreens={true}
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Ana Sayfa',
          lazy: true 
        }} 
      />
      <Tab.Screen 
        name="Tasks" 
        component={TaskNavigator} 
        options={{ 
          title: 'Görevler',
          lazy: true 
        }} 
      />
      <Tab.Screen 
        name="Route" 
        component={RouteOptimizationScreen} 
        options={{ 
          title: 'Rota',
          lazy: true 
        }} 
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomerNavigator} 
        options={{ 
          title: 'Müşteriler',
          lazy: true 
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsNavigator}
        options={{ 
          title: 'Ayarlar',
          lazy: true 
        }} 
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
