import React, { useState, useMemo } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import {
  List,
  Switch,
  Divider,
  useTheme,
  Text,
  Button,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [syncInterval, setSyncInterval] = useState('15');
  const [syncDialogVisible, setSyncDialogVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const styles = useMemo(
    () =>
      ({
        safeArea: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        dialogContent: {
          paddingHorizontal: 24,
          paddingBottom: 24,
        },
        dialogActions: {
          paddingHorizontal: 24,
          paddingBottom: 16,
        },
      }),
    [theme]
  );

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      // Navigation'a gerek yok, state değişimi ile otomatik yönlenecek
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutDialogVisible(false);
    }
  };

  const handleSync = () => {
    // TODO: Implement sync logic
    setSyncDialogVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <List.Section>
          <List.Subheader>Notifications</List.Subheader>
          <List.Item
            title="Push Notifications"
            description="Receive push notifications for updates"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
              />
            )}
          />
          <List.Item
            title="Email Notifications"
            description="Receive email notifications for updates"
            left={(props) => <List.Icon {...props} icon="email" />}
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Dark Mode"
            description="Enable dark mode for the app"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch value={darkMode} onValueChange={setDarkMode} />
            )}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Data Synchronization</List.Subheader>
          <List.Item
            title="Sync Interval"
            description={`Sync every ${syncInterval} minutes`}
            left={(props) => <List.Icon {...props} icon="sync" />}
            onPress={() => setSyncDialogVisible(true)}
          />
          <List.Item
            title="Sync Now"
            description="Manually sync all data"
            left={(props) => <List.Icon {...props} icon="cloud-sync" />}
            onPress={handleSync}
          />
        </List.Section>

        <Divider />

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Profile"
            description="View and edit your profile"
            left={(props) => <List.Icon {...props} icon="account" />}
            onPress={() => {}}
          />
          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            onPress={() => {}}
          />
          <List.Item
            title="Logout"
            description="Sign out from your account"
            left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={() => setLogoutDialogVisible(true)}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => {}}
          />
          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            onPress={() => {}}
          />
        </List.Section>

        <Portal>
          <Dialog
            visible={syncDialogVisible}
            onDismiss={() => setSyncDialogVisible(false)}
          >
            <Dialog.Title>Sync Interval</Dialog.Title>
            <Dialog.Content>
              <List.Item
                title="15 minutes"
                onPress={() => {
                  setSyncInterval('15');
                  setSyncDialogVisible(false);
                }}
                right={() =>
                  syncInterval === '15' && (
                    <Icon
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )
                }
              />
              <List.Item
                title="30 minutes"
                onPress={() => {
                  setSyncInterval('30');
                  setSyncDialogVisible(false);
                }}
                right={() =>
                  syncInterval === '30' && (
                    <Icon
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )
                }
              />
              <List.Item
                title="1 hour"
                onPress={() => {
                  setSyncInterval('60');
                  setSyncDialogVisible(false);
                }}
                right={() =>
                  syncInterval === '60' && (
                    <Icon
                      name="check"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )
                }
              />
            </Dialog.Content>
          </Dialog>

          <Dialog
            visible={logoutDialogVisible}
            onDismiss={() => setLogoutDialogVisible(false)}
          >
            <Dialog.Title>Çıkış Yap</Dialog.Title>
            <Dialog.Content>
              <Text>Çıkış yapmak istediğinizden emin misiniz?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setLogoutDialogVisible(false)}>İptal</Button>
              <Button onPress={handleLogout} textColor={theme.colors.error}>
                Çıkış Yap
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
