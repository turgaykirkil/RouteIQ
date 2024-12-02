import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Button,
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
  const [refreshing, setRefreshing] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          marginTop: 8,
        },
        filterChip: {
          marginRight: 8,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        listContainer: {
          padding: 16,
        },
        taskCard: {
          marginBottom: 16,
          elevation: 2,
        },
        taskHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
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
        statusIndicator: {
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
          paddingVertical: 32,
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
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
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [tasks, searchQuery, selectedFilter]);

  const renderTaskCard = ({item}: {item: Task}) => (
    <Card
      style={styles.taskCard}
      onPress={() => navigation.navigate('TaskDetail', {taskId: item.id})}>
      <Card.Content>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Chip
            style={[
              styles.priorityChip,
              {backgroundColor: getPriorityColor(item.priority)},
            ]}>
            {item.priority.toUpperCase()}
          </Chip>
        </View>
        <Text style={styles.taskDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.taskFooter}>
          <Text style={styles.taskDate}>
            Due: {formatDate(item.dueDate)}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                {backgroundColor: getStatusColor(item.status)},
              ]}
            />
            <Text style={styles.statusText}>
              {item.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tasks found</Text>
            </View>
          }
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewTask')}
      />
    </View>
  );
};

export default TaskListScreen;
