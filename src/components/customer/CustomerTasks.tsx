import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Customer } from '../../types/customer';

interface CustomerTasksProps {
  customer: Customer | null;
  onSeeAll?: () => void;
}

const CustomerTasks = memo<CustomerTasksProps>(({ customer, onSeeAll }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      {customer?.assignedTasks ? (
        customer.assignedTasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Icon
              name={task.status === 'completed' ? 'checkbox-marked-circle' : 'clock-outline'}
              size={20}
              color={task.status === 'completed' ? theme.colors.success : theme.colors.accent}
            />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={[styles.taskDate, { color: theme.colors.textSecondary }]}>
                Due: {task.dueDate}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No tasks assigned</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  taskInfo: {
    flex: 1,
    marginLeft: 16,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    paddingVertical: 16,
  },
});

CustomerTasks.displayName = 'CustomerTasks';

export default CustomerTasks;
