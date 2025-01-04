import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';

import ForgotPasswordHeader from '../../components/auth/ForgotPasswordHeader';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';
import ForgotPasswordFooter from '../../components/auth/ForgotPasswordFooter';

const { width, height } = Dimensions.get('window');

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProps) => {
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
        scrollContainer: {
          flexGrow: 1,
          paddingHorizontal: width * 0.06,
          paddingVertical: height * 0.04,
        },
        scrollContent: {
          flexGrow: 1,
          justifyContent: 'center',
        },
      }),
    [theme]
  );

  const handlePasswordResetRequest = async (email: string) => {
    try {
      // TODO: Implement password reset logic
      console.log('Password reset requested for:', email);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

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
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scrollContent}>
            <ForgotPasswordHeader />
            <ForgotPasswordForm onPasswordResetRequest={handlePasswordResetRequest} />
            <ForgotPasswordFooter />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
