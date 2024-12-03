import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  FAB,
  useTheme,
  MD3Theme,
  ActivityIndicator,
  Searchbar,
  Chip,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TaskStackNavigationProp} from '../../navigation/types';
import {fetchTasks} from '../../store/slices/taskSlice';
import {RootState} from '../../store';
import {Task, formatDate, getPriorityColor} from '../../types/task';
import {AppDispatch} from '../../store';

const TaskListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<TaskStackNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {tasks, loading} = useSelector((state: RootState) => state.tasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const styles = useMemo(
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
        header: {
          padding: 16,
          backgroundColor: theme.colors.surface,
          elevation: 4,
        },
        searchBar: {
          marginBottom: 8,
        },
        filterContainer: {
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingBottom: 8,
        },
        filterChip: {
          marginRight: 8,
        },
        taskItem: {
          backgroundColor: theme.colors.surface,
          marginHorizontal: 16,
          marginVertical: 8,
          padding: 16,
          borderRadius: 8,
          elevation: 2,
        },
        taskTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          flex: 1,
          marginRight: 8,
          color: theme.colors.onSurface,
        },
        priorityChip: {
          minWidth: 80,
        },
        taskDescription: {
          fontSize: 14,
          color: theme.colors.onSurfaceVariant,
          marginBottom: 8,
        },
        taskFooter: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        taskDate: {
          fontSize: 12,
          color: theme.colors.onSurfaceVariant,
        },
        statusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        statusDot: {
          width: 8,
          height: 8,
          borderRadius: 4,
          marginRight: 4,
        },
        statusText: {
          fontSize: 12,
          color: theme.colors.onSurfaceVariant,
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
        },
        fab: {
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: theme.colors.primary,
        },
      }),
    [theme]
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await dispatch(fetchTasks()).unwrap();
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

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

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFilter = !selectedFilter || task.status === selectedFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [tasks, searchQuery, selectedFilter]);

  if (loading) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search tasks"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['todo', 'in_progress', 'completed'].map(filter => (
                <Chip
                  key={filter}
                  selected={selectedFilter === filter}
                  onPress={() =>
                    setSelectedFilter(selectedFilter === filter ? null : filter)
                  }
                  style={styles.filterChip}>
                  {filter.replace('_', ' ').toUpperCase()}
                </Chip>
              ))}
            </ScrollView>
          </View>
        </View>

        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        ) : (
          <ScrollView>
            {filteredTasks.map(task => (
              <View key={task.id} style={styles.taskItem}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.priorityChip,
                      {borderColor: getPriorityColor(task.priority)},
                    ]}>
                    {task.priority}
                  </Chip>
                </View>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}
                <View style={styles.taskFooter}>
                  <Text style={styles.taskDate}>
                    Due: {formatDate(task.dueDate)}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        {backgroundColor: getStatusColor(task.status)},
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('NewTask')}
        />
      </View>
    </SafeAreaView>
  );
};

export default TaskListScreen;
