/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import theme from './src/theme';
import { login } from './src/store/authSlice';
import SplashScreen from 'react-native-splash-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          store.dispatch(login(JSON.parse(userData)));
        }
      } catch (error) {
        console.error('Error checking user data:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Logo 1 saniye görünsün
        SplashScreen.hide();
      } catch (error) {
        console.log('Splash screen error:', error);
      }
    };
    
    hideSplash();
  }, []);

  if (!isInitialized) {
    return null; // veya bir loading spinner
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <ReduxProvider store={store}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
};

export default App;
