import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';

import RegisterHeader from '../../components/auth/RegisterHeader';
import RegisterForm from '../../components/auth/RegisterForm';
import RegisterFooter from '../../components/auth/RegisterFooter';

const RegisterScreen = () => {
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
        scrollContent: {
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 24,
        },
        scrollContainer: {
          flexGrow: 1,
          justifyContent: 'center',
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scrollContainer}>
            <RegisterHeader />
            <RegisterForm />
            <RegisterFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
