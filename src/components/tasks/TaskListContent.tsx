import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TaskStackNavigationProp } from '../../navigation/types';
import { Task, formatDate, getPriorityColor } from '../../types/task';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface TaskListContentProps {
  tasks: Task[];
  loading: boolean;
  searchQuery: string;
  selectedFilter: string | null;
}

const TaskListContent: React.FC<TaskListContentProps> = ({
  tasks,
  loading,
  searchQuery,
  selectedFilter
}) => {
  const theme = useTheme();
  const navigation = useNavigation<TaskStackNavigationProp>();

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !selectedFilter || task.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.primary;
      case 'in_progress':
        return theme.colors.secondary;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const styles = useMemo(
    () => StyleSheet.create({
      taskListContainer: {
        paddingVertical: 8,
      },
      taskItem: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      },
      taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
        color: theme.colors.onSurface,
      },
      priorityChip: {
        borderRadius: 12,
        height: 24,
        paddingHorizontal: 8,
        minWidth: 65,
      },
      priorityLabel: {
        fontSize: 11,
        textTransform: 'lowercase',
        marginVertical: 0,
        includeFontPadding: false,
      },
      taskDescription: {
        fontSize: 14,
        color: theme.colors.onSurfaceVariant,
        marginBottom: 12,
        lineHeight: 20,
      },
      taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      taskDate: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '500',
      },
      statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
      },
      statusText: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        fontWeight: '500',
        textTransform: 'capitalize',
      },
      emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      },
      emptyText: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        marginTop: 8,
      },
      emptyIcon: {
        marginBottom: 12,
        opacity: 0.7,
      },
    }),
    [theme]
  );

  if (loading) {
    return (
      <View style={[styles.emptyContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={48}
          color={theme.colors.onSurfaceVariant}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyText}>
          {searchQuery || selectedFilter 
            ? 'Arama sonucu bulunamadı' 
            : 'Henüz görev eklenmemiş'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.taskListContainer}
      showsVerticalScrollIndicator={false}
    >
      {filteredTasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskItem}
          onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })}
        >
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle} numberOfLines={1}>
              {task.title}
            </Text>
            <View 
              style={[
                styles.priorityChip, 
                { backgroundColor: getPriorityColor(task.priority) }
              ]}
            />
          </View>
          <Text style={styles.taskDescription} numberOfLines={2}>
            {task.description}
          </Text>
          <View style={styles.taskFooter}>
            <Text style={styles.taskDate}>
              {formatDate(task.dueDate)}
            </Text>
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(task.status) }
                ]} 
              />
              <Text style={styles.statusText}>
                {task.status === 'in_progress' 
                  ? 'Devam Ediyor' 
                  : task.status === 'completed' 
                    ? 'Tamamlandı' 
                    : 'Bekliyor'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default TaskListContent;
