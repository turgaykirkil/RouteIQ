import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme, Alert } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TaskStackNavigationProp } from '../../navigation/types';
import { taskAPI } from '../../services/api';
import { Task } from '../../types/task';

import TaskListHeader from '../../components/tasks/TaskListHeader';
import TaskListContent from '../../components/tasks/TaskListContent';
import TaskListFAB from '../../components/tasks/TaskListFAB';

const TaskListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<TaskStackNavigationProp>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await taskAPI.getAll();
        setLocalTasks(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

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
      }),
    [theme]
  );

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(prevFilter => 
      prevFilter === filter ? null : filter
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TaskListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        <TaskListContent
          tasks={localTasks}
          loading={isLoading}
          searchQuery={searchQuery}
          selectedFilter={selectedFilter}
        />
        <TaskListFAB />
      </View>
    </SafeAreaView>
  );
};

export default TaskListScreen;