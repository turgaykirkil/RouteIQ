import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import NewTaskScreen from '../screens/tasks/NewTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import { TaskStackParamList } from './types';

const Stack = createNativeStackNavigator<TaskStackParamList>();

const TaskNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'Görevler',
        }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{
          title: 'Görev Detayı',
        }}
      />
      <Stack.Screen
        name="NewTask"
        component={NewTaskScreen}
        options={{
          title: 'Yeni Görev',
        }}
      />
      <Stack.Screen
        name="EditTask"
        component={EditTaskScreen}
        options={{
          title: 'Görevi Düzenle',
        }}
      />
    </Stack.Navigator>
  );
};

export default TaskNavigator;
