import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar as PaperSearchbar } from 'react-native-paper';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = memo<SearchBarProps>(({
  value,
  onChangeText,
  placeholder = 'Ara...',
}) => {
  return (
    <PaperSearchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={styles.searchBar}
    />
  );
});

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 8,
  },
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
