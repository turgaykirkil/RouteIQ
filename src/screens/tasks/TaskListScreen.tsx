import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Text,
  FAB,
  useTheme,
  MD3Theme,
  ActivityIndicator,
  Searchbar,
  Chip,
  Alert,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { TaskStackNavigationProp } from '../../navigation/types';
import { fetchTasks } from '../../store/slices/taskSlice';
import { RootState } from '../../store';
import { Task, formatDate, getPriorityColor } from '../../types/task';
import { AppDispatch } from '../../store';
import { taskAPI } from '../../services/api';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TaskListScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<TaskStackNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

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
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        searchBar: {
          marginBottom: 8,
          elevation: 0,
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.outline,
        },
        filterContainer: {
          flexDirection: 'row',
          paddingHorizontal: 16,
        },
        filterChip: {
          flex: 1,
          marginRight: 8,
          height: 32,
        },
        chipLabel: {
          fontSize: 12,
        },
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
    return localTasks
      .filter(task => {
        const matchesSearch = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFilter = !selectedFilter || task.status === selectedFilter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [localTasks, searchQuery, selectedFilter]);

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  if (isLoading) {
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
            placeholder="Görev ara..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          <View style={styles.filterContainer}>
            <Chip
              selected={selectedFilter === 'todo'}
              onPress={() => setSelectedFilter(selectedFilter === 'todo' ? null : 'todo')}
              style={styles.filterChip}
              mode="outlined"
              compact
              showSelectedCheck={true}
              selectedColor={theme.colors.primary}
              textStyle={styles.chipLabel}
            >
              To Do
            </Chip>
            <Chip
              selected={selectedFilter === 'in_progress'}
              onPress={() => setSelectedFilter(selectedFilter === 'in_progress' ? null : 'in_progress')}
              style={styles.filterChip}
              mode="outlined"
              compact
              showSelectedCheck={true}
              selectedColor={theme.colors.primary}
              textStyle={styles.chipLabel}
            >
              In Progress
            </Chip>
            <Chip
              selected={selectedFilter === 'completed'}
              onPress={() => setSelectedFilter(selectedFilter === 'completed' ? null : 'completed')}
              style={[styles.filterChip, { marginRight: 0 }]}
              mode="outlined"
              compact
              showSelectedCheck={true}
              selectedColor={theme.colors.primary}
              textStyle={styles.chipLabel}
            >
              Completed
            </Chip>
          </View>
        </View>

        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={48}
              color={theme.colors.onSurfaceVariant}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Arama sonucu bulunamadı'
                : selectedFilter
                ? `${selectedFilter === 'todo' ? 'To Do' : selectedFilter === 'in_progress' ? 'In Progress' : 'Completed'} durumunda görev yok`
                : 'Henüz görev eklenmemiş'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.taskListContainer}>
            {filteredTasks.map(task => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => handleTaskPress(task.id)}
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.priorityChip,
                      { borderColor: getPriorityColor(task.priority) }
                    ]}
                    textStyle={[
                      styles.priorityLabel,
                      { color: getPriorityColor(task.priority) }
                    ]}
                  >
                    {task.priority}
                  </Chip>
                </View>
                
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {task.description}
                </Text>

                <View style={styles.taskFooter}>
                  <Text style={styles.taskDate}>
                    {`Teslim: ${formatDate(task.dueDate)}`}
                  </Text>
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(task.status) }
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {task.status === 'todo'
                        ? 'To Do'
                        : task.status === 'in_progress'
                        ? 'In Progress'
                        : 'Completed'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <FAB
          icon="plus"
          onPress={() => navigation.navigate('CreateTask')}
          style={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
};

export default TaskListScreen;
