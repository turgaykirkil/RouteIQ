import React from 'react';
import { FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { TaskStackNavigationProp } from '../../navigation/types';

const TaskListFAB: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<TaskStackNavigationProp>();

  return (
    <FAB
      icon="plus"
      style={{
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
      }}
      onPress={() => navigation.navigate('NewTask')}
    />
  );
};

export default TaskListFAB;
