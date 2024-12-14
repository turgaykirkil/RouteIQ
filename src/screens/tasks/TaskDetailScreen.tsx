import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Task, formatDate, getPriorityColor } from '../../types/task';
import { taskService } from '../../services/taskService';
import { Text, Button, Menu, Portal, Dialog, Card, Chip, TextInput, useTheme, MD3Theme, IconButton, ActivityIndicator, Surface, Divider } from 'react-native-paper';
import { AppDispatch } from '../../store/store';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TaskStackNavigationProp, TaskStackParamList } from '../../navigation/types';
import { MainTabParamList } from '../../navigation/types';

// Define route prop types
interface TaskDetailScreenRouteProp extends RouteProp<TaskStackParamList, 'TaskDetail'> {}

// Define composite navigation prop
interface CompositeNavigationProp extends TaskStackNavigationProp {
  navigate: (screen: keyof MainTabParamList, params: any) => void;
}

interface TaskDetailScreenProps {
  route: TaskDetailScreenRouteProp;
}

const TaskDetailScreen = ({ route }: TaskDetailScreenProps) => {
  const theme = useTheme();
  const { taskId } = route.params;
  const navigation = useNavigation<CompositeNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUser = useSelector((state: RootState) => state.auth.user);
  const [localTask, setLocalTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [progressDialogVisible, setProgressDialogVisible] = useState(false);
  const [progress, setProgress] = useState('0');

  useEffect(() => {
    const loadTask = async () => {
      if (!loggedInUser || !taskId) {
        setError('Gerekli bilgiler eksik');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await taskService.getTaskById(taskId);

        if (!response) {
          setError('Görev bulunamadı');
          setLoading(false);
          return;
        }
        
        setLocalTask(response);
        setLoading(false);
      } catch (err: any) {
        setError(err?.message || 'Görev yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, loggedInUser]);

  // Yardımcı fonksiyon - eksik verileri kontrol etmek için
  const getDisplayValue = (value: any, defaultValue: string = 'N/A') => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  };

  if (loading) {
    return (
      <View style={styles(theme).loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles(theme).loadingText}>Görev yükleniyor...</Text>
      </View>
    );
  }

  if (error || !localTask) {
    return (
      <View style={styles(theme).errorContainer}>
        <Text variant="headlineSmall" style={styles(theme).errorText}>{error || 'Görev bulunamadı'}</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        >
          Geri Dön
        </Button>
      </View>
    );
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await dispatch(
        updateTaskStatus({id: localTask.id || '', status: newStatus}),
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
        updateTaskProgress({id: localTask.id || '', progress: progressValue}),
      ).unwrap();
      setProgressDialogVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
    }
  };

  const handleChecklistItemToggle = async (itemId: string) => {
    try {
      await dispatch(
        updateChecklistItem({taskId: localTask.id || '', itemId, completed: true}),
      ).unwrap();
    } catch (error) {
      Alert.alert('Error', 'Failed to update checklist item');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(localTask.id || '')).unwrap();
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

  return (
    <>
      <ScrollView style={styles(theme).container}>
        <Surface style={styles(theme).headerCard} elevation={2}>
          <View style={styles(theme).headerContent}>
            <Text variant="headlineMedium" style={styles(theme).title}>
              {getDisplayValue(localTask.title)}
            </Text>
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              style={styles(theme).menuButton}
            />
          </View>
          <Chip mode="outlined" style={[styles(theme).statusChip, { backgroundColor: getPriorityColor(localTask.priority, theme) }]}>
            {getDisplayValue(localTask.status).toUpperCase()}
          </Chip>
        </Surface>

        <Card style={styles(theme).contentCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles(theme).sectionTitle}>Detaylar</Text>
            <Text variant="bodyLarge" style={styles(theme).description}>
              {getDisplayValue(localTask.description)}
            </Text>
            
            <Divider style={styles(theme).divider} />
            
            <View style={styles(theme).detailsGrid}>
              <View style={styles(theme).detailItem}>
                <Text variant="labelMedium" style={styles(theme).label}>Öncelik</Text>
                <Chip mode="outlined" style={styles(theme).priorityChip}>
                  {getDisplayValue(localTask.priority)}
                </Chip>
              </View>
              
              <View style={styles(theme).detailItem}>
                <Text variant="labelMedium" style={styles(theme).label}>Bitiş Tarihi</Text>
                <Text variant="bodyMedium">{formatDate(localTask.dueDate)}</Text>
              </View>

              <TouchableOpacity 
                style={styles(theme).detailItem}
                onPress={() => handleCustomerPress(localTask.customerId)}
              >
                <Text variant="labelMedium" style={styles(theme).label}>Müşteri</Text>
                <Text variant="bodyMedium" style={styles(theme).linkText}>
                  {getDisplayValue(localTask.customerName)}
                </Text>
              </TouchableOpacity>

              <View style={styles(theme).detailItem}>
                <Text variant="labelMedium" style={styles(theme).label}>Atanan</Text>
                <Text variant="bodyMedium">{getDisplayValue(localTask.assigneeName)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {localTask.checklist && localTask.checklist.length > 0 && (
          <Card style={styles(theme).contentCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles(theme).sectionTitle}>Kontrol Listesi</Text>
              {localTask.checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles(theme).checklistItem}
                  onPress={() => handleChecklistItemToggle(item.id)}
                >
                  <IconButton
                    icon={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    size={24}
                    onPress={() => handleChecklistItemToggle(item.id)}
                  />
                  <Text variant="bodyMedium" style={[
                    styles(theme).checklistText,
                    item.completed && styles(theme).completedText
                  ]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </Card.Content>
          </Card>
        )}
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

const styles = (theme: MD3Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.error,
  },
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  menuButton: {
    margin: -8,
  },
  statusChip: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  contentCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    color: theme.colors.primary,
    marginBottom: 12,
  },
  description: {
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: theme.colors.primary,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checklistText: {
    flex: 1,
    marginLeft: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurfaceVariant,
  },
});

export default TaskDetailScreen;
