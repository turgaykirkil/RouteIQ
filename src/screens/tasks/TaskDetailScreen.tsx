import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  IconButton,
  Menu,
  Dialog,
  TextInput,
  useTheme,
  MD3Theme,
  Portal,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {
  TaskStackNavigationProp,
  TaskStackParamList,
  MainTabParamList,
} from '../../navigation/types';
import {
  fetchTaskById,
  updateTaskStatus,
  updateTaskProgress,
  updateChecklistItem,
  deleteTask,
  TaskStatus,
} from '../../store/slices/taskSlice';
import {RootState} from '../../store';
import {Task, formatDate, getPriorityColor} from '../../types/task';
import {AppDispatch} from '../../store';

type TaskDetailScreenRouteProp = RouteProp<TaskStackParamList, 'TaskDetail'>;
type CompositeNavigationProp = TaskStackNavigationProp & {
  navigate: (screen: keyof MainTabParamList, params: any) => void;
};

const TaskDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<CompositeNavigationProp>();
  const route = useRoute<TaskDetailScreenRouteProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {taskId} = route.params;
  const {selectedTask: task, loading} = useSelector(
    (state: RootState) => state.tasks,
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [progressDialogVisible, setProgressDialogVisible] = useState(false);
  const [progress, setProgress] = useState('0');

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
  }, [dispatch, taskId]);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await dispatch(
        updateTaskStatus({id: task?.id || '', status: newStatus}),
      ).unwrap();
      setMenuVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const handleProgressUpdate = async () => {
    const progressValue = parseInt(progress);
    if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
      Alert.alert('Error', 'Please enter a valid progress value (0-100)');
      return;
    }

    try {
      await dispatch(
        updateTaskProgress({id: task?.id || '', progress: progressValue}),
      ).unwrap();
      setProgressDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const handleChecklistItemToggle = async (itemId: string) => {
    try {
      await dispatch(
        updateChecklistItem({taskId: task?.id || '', itemId, completed: true}),
      ).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to update checklist item');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(task?.id || '')).unwrap();
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const handleCustomerPress = (customerId: string) => {
    navigation.navigate('Customers', {
      screen: 'CustomerDetail',
      params: {customerId},
    });
  };

  if (!task || loading) {
    return (
      <View style={styles(theme).loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles(theme).container}>
        <Card style={styles(theme).card}>
          <Card.Content>
            <View style={styles(theme).header}>
              <View style={styles(theme).titleContainer}>
                <Text style={styles(theme).title}>{task.title}</Text>
                <Chip
                  style={[
                    styles(theme).priorityChip,
                    {backgroundColor: getPriorityColor(task.priority)},
                  ]}
                  textStyle={styles(theme).chipText}>
                  {task.priority.toUpperCase()}
                </Chip>
              </View>
            </View>

            <Text style={styles(theme).description}>{task.description}</Text>

            <View style={styles(theme).infoContainer}>
              <View style={styles(theme).infoItem}>
                <Text style={styles(theme).infoLabel}>Due Date</Text>
                <Text style={styles(theme).infoValue}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>

              <View style={styles(theme).infoItem}>
                <Text style={styles(theme).infoLabel}>Customer</Text>
                <TouchableOpacity
                  onPress={() => handleCustomerPress(task.customerId)}>
                  <Text style={[styles(theme).infoValue, styles(theme).link]}>
                    {task.customerName}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles(theme).infoItem}>
                <Text style={styles(theme).infoLabel}>Assigned To</Text>
                <Text style={styles(theme).infoValue}>{task.assigneeName}</Text>
              </View>
            </View>

            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionTitle}>Status & Progress</Text>
              <View style={styles(theme).statusContainer}>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Button
                      mode="outlined"
                      onPress={() => setMenuVisible(true)}
                      style={styles(theme).statusButton}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </Button>
                  }>
                  <Menu.Item
                    onPress={() => handleStatusChange('todo')}
                    title="To Do"
                  />
                  <Menu.Item
                    onPress={() => handleStatusChange('in_progress')}
                    title="In Progress"
                  />
                  <Menu.Item
                    onPress={() => handleStatusChange('completed')}
                    title="Completed"
                  />
                </Menu>
                <View style={styles(theme).progressContainer}>
                  <View style={styles(theme).progressBarContainer}>
                    <View
                      style={[
                        styles(theme).progressBar,
                        {
                          width: `${task.progress}%`,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles(theme).progressText}>
                    {task.progress}%
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles(theme).section}>
              <Text style={styles(theme).sectionTitle}>Checklist</Text>
              {task.checklist.map(item => (
                <View key={item.id} style={styles(theme).checklistItem}>
                  <Text style={styles(theme).infoValue}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => handleChecklistItemToggle(item.id)}>
                    <Text
                      style={[
                        styles(theme).infoValue,
                        item.completed
                          ? styles(theme).link
                          : {textDecorationLine: 'none'},
                      ]}>
                      {item.completed ? 'Completed' : 'Not Completed'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this task?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={progressDialogVisible}
          onDismiss={() => setProgressDialogVisible(false)}>
          <Dialog.Title>Update Progress</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              value={progress}
              onChangeText={setProgress}
              keyboardType="numeric"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setProgressDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={handleProgressUpdate}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      margin: 8,
      elevation: 2,
    },
    header: {
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      flex: 1,
      marginRight: 8,
    },
    priorityChip: {
      minWidth: 80,
    },
    chipText: {
      color: theme.colors.surface,
    },
    description: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 16,
    },
    infoContainer: {
      marginBottom: 16,
    },
    infoItem: {
      marginBottom: 8,
    },
    infoLabel: {
      fontSize: 12,
      color: theme.colors.secondary,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.onSurface,
    },
    link: {
      color: theme.colors.primary,
    },
    section: {
      marginVertical: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    statusSection: {
      marginBottom: 16,
    },
    statusContainer: {
      flexDirection: 'column',
      gap: 8,
    },
    statusButton: {
      alignSelf: 'flex-start',
      marginBottom: 8,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressBarContainer: {
      flex: 1,
      height: 8,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 4,
      marginHorizontal: 8,
    },
    progressBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 12,
      minWidth: 40,
    },
    checklistSection: {
      marginBottom: 16,
    },
    checklistItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
  });

export default TaskDetailScreen;
