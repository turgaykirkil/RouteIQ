import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';

interface CustomerListSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CustomerListSearchBar: React.FC<CustomerListSearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        searchBar: {
          elevation: 1,
          height: 48,
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: 24,
          paddingHorizontal: 8,
        },
        searchBarInput: {
          minHeight: 48,
          fontSize: 14,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Müşteri ara..."
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchBarInput}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        iconColor={theme.colors.onSurfaceVariant}
      />
    </View>
  );
};

export default CustomerListSearchBar;
