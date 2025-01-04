import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, Menu, useTheme, ActivityIndicator } from 'react-native-paper';
import { CompositeNavigationProp } from '@react-navigation/native';
import { TaskStackNavigationProp, TaskStackParamList } from '../../navigation/types';
import { MainTabParamList } from '../../navigation/types';
import { useTaskDetail } from '../../hooks/useTaskDetail';
import { useTaskActions } from '../../hooks/useTaskActions';
import { TaskHeader } from '../../components/task/TaskHeader';
import { TaskDetails } from '../../components/task/TaskDetails';
import { getDisplayValue } from '../../utils/display';

import TaskDeleteDialog from '../../components/tasks/TaskDeleteDialog';
import TaskProgressDialog from '../../components/tasks/TaskProgressDialog';

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
  
  const { task, error, loading } = useTaskDetail({ taskId });
  const {
    menuVisible,
    setMenuVisible,
    menuAnchor,
    showMenu,
    deleteDialogVisible,
    setDeleteDialogVisible,
    progressDialogVisible,
    setProgressDialogVisible,
    progress,
    setProgress,
    handleStatusChange,
    handleProgressUpdate,
    handleDelete
  } = useTaskActions(taskId);

  const handleCustomerPress = (customerId: string) => {
    navigation.navigate('Customers', {
      screen: 'CustomerDetail',
      params: { customerId },
    });
  };

  const onDeleteConfirm = async () => {
    const success = await handleDelete();
    if (success) {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Görev yükleniyor...</Text>
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={styles.errorText}>
          {error || 'Görev bulunamadı'}
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        >
          Geri Dön
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <TaskHeader
          title={getDisplayValue(task.title)}
          status={getDisplayValue(task.status)}
          priority={getDisplayValue(task.priority)}
          onMenuPress={showMenu}
        />

        <TaskDetails
          description={getDisplayValue(task.description)}
          priority={getDisplayValue(task.priority)}
          dueDate={task.dueDate}
          customerName={getDisplayValue(task.customerName)}
          onCustomerPress={() => handleCustomerPress(task.customerId)}
        />
      </ScrollView>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={menuAnchor}
      >
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            setProgressDialogVisible(true);
          }} 
          title="İlerleme Güncelle" 
        />
        <Menu.Item 
          onPress={() => handleStatusChange('completed')} 
          title="Tamamlandı" 
        />
        <Menu.Item 
          onPress={() => handleStatusChange('in_progress')} 
          title="Devam Ediyor" 
        />
        <Menu.Item 
          onPress={() => {
            setMenuVisible(false);
            setDeleteDialogVisible(true);
          }} 
          title="Sil" 
        />
      </Menu>

      <TaskDeleteDialog
        visible={deleteDialogVisible}
        onDismiss={() => setDeleteDialogVisible(false)}
        onDelete={onDeleteConfirm}
        taskTitle={task.title}
      />

      <TaskProgressDialog
        visible={progressDialogVisible}
        onDismiss={() => setProgressDialogVisible(false)}
        onUpdate={handleProgressUpdate}
        progress={progress}
        onProgressChange={setProgress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 16,
  },
});

export default TaskDetailScreen;
