import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Chip, Surface, useTheme } from 'react-native-paper';
import { getPriorityColor } from '../../types/task';

interface TaskHeaderProps {
  title: string;
  status: string;
  priority: string;
  onMenuPress: (event: any) => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  title,
  status,
  priority,
  onMenuPress,
}) => {
  const theme = useTheme();

  return (
    <Surface style={styles.headerCard} elevation={2}>
      <View style={styles.headerContent}>
        <Text variant="headlineMedium" style={styles.title}>
          {title}
        </Text>
        <IconButton
          icon="dots-vertical"
          onPress={onMenuPress}
          style={styles.menuButton}
        />
      </View>
      <Chip 
        mode="outlined" 
        style={[
          styles.statusChip, 
          { backgroundColor: getPriorityColor(priority, theme) }
        ]}
      >
        {status.toUpperCase()}
      </Chip>
    </Surface>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  menuButton: {
    margin: 0,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
});
