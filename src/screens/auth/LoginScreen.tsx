import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';

import LoginHeader from '../../components/auth/LoginHeader';
import LoginForm from '../../components/auth/LoginForm';
import LoginFooter from '../../components/auth/LoginFooter';

const LoginScreen = () => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        scrollView: {
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
        },
        keyboardContainer: {
          flex: 1,
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={theme.colors.background} barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.scrollContent}>
            <LoginHeader />
            <LoginForm />
            <LoginFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
