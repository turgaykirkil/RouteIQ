import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, useTheme } from 'react-native-paper';

interface TaskListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange
}) => {
  const theme = useTheme();

  const filters = [
    { label: 'Bekleyen', value: 'pending' },
    { label: 'Devam Eden', value: 'in_progress' },
    { label: 'Tamamlanan', value: 'completed' }
  ];

  const styles = useMemo(
    () => StyleSheet.create({
      header: {
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
      filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
      },
      filterChip: {
        marginRight: 8,
        height: 32,
      },
      chipLabel: {
        fontSize: 12,
      },
    }),
    [theme]
  );

  return (
    <View>
      <View style={styles.header}>
        <Searchbar
          placeholder="Görev ara..."
          onChangeText={onSearchChange}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ 
            minHeight: 48, 
            fontSize: 14 
          }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurfaceVariant}
        />
      </View>
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <Chip
            key={filter.label}
            mode={selectedFilter === filter.value ? 'flat' : 'outlined'}
            onPress={() => onFilterChange(filter.value)}
            style={[
              styles.filterChip,
              {
                backgroundColor: 
                  selectedFilter === filter.value 
                    ? theme.colors.primaryContainer 
                    : theme.colors.background,
                borderColor: theme.colors.outline,
                borderWidth: 1,
              }
            ]}
            textStyle={styles.chipLabel}
          >
            {filter.label}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default TaskListHeader;
