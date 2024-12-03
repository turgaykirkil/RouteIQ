import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/main/HomeScreen';
import TaskNavigator from './TaskNavigator';
import CustomerNavigator from './CustomerNavigator';
import MapScreen from '../screens/main/MapScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

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
              iconName = 'list';
              break;
            case 'Customers':
              iconName = 'people';
              break;
            case 'Map':
              iconName = 'map';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
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
        name="Map" 
        component={MapScreen} 
        options={{ 
          title: 'Harita',
          tabBarItemStyle: { 
            position: 'absolute', 
            left: '50%', 
            transform: [{ translateX: -24 }] 
          } 
        }} 
      />
      <Tab.Screen 
        name="Customers" 
        component={CustomerNavigator} 
        options={{ title: 'Müşteriler' }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Ayarlar' }} 
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
