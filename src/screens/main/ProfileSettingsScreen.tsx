import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ProfileStackNavigationProp } from '../../navigation/types';

const ProfileSettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileStackNavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Profil Ayarları
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Geri Dön
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileSettingsScreen;
