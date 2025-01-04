import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, useTheme } from 'react-native-paper';

import { TaskStackParamList } from '../../navigation/types';
import { Task } from '../../types/task';
import { fetchTaskById, updateTask } from '../../store/slices/taskSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

import EditTaskForm from '../../components/tasks/EditTaskForm';
import EditTaskPrioritySelect from '../../components/tasks/EditTaskPrioritySelect';
import EditTaskStatusSelect from '../../components/tasks/EditTaskStatusSelect';
import EditTaskDatePicker from '../../components/tasks/EditTaskDatePicker';
import EditTaskChecklist from '../../components/tasks/EditTaskChecklist';

type EditTaskScreenProps = {
  navigation: NativeStackNavigationProp<TaskStackParamList, 'EditTask'>;
  route: RouteProp<TaskStackParamList, 'EditTask'>;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Başlık gereklidir'),
  description: Yup.string(),
  dueDate: Yup.date().required('Son tarih gereklidir'),
  priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Geçersiz öncelik').required('Öncelik gereklidir'),
  status: Yup.string().oneOf(['todo', 'in_progress', 'completed'], 'Geçersiz durum').required('Durum gereklidir'),
  checklist: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      title: Yup.string().required(),
      completed: Yup.boolean().required()
    })
  )
});

const EditTaskScreen: React.FC<EditTaskScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = route.params;
  const { selectedTask: task, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTaskById(taskId));
  }, [taskId]);

  const handleSubmit = async (values: Task) => {
    try {
      await dispatch(updateTask({ id: taskId, ...values }));
      navigation.goBack();
    } catch (error) {
      console.error('Görev güncellenirken hata:', error);
    }
  };

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 100 : 70,
        backgroundColor: theme.colors.background,
      },
      submitButton: {
        marginTop: 16,
      }
    }),
    [theme]
  );

  if (loading || !task) {
    return null; // Loading indicator eklenebilir
  }

  return (
    <Formik
      initialValues={task}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <EditTaskForm formik={formik} />
          <EditTaskPrioritySelect formik={formik} />
          <EditTaskStatusSelect formik={formik} />
          <EditTaskDatePicker formik={formik} />
          <EditTaskChecklist formik={formik} />
          
          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            style={styles.submitButton}
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Görevi Güncelle
          </Button>
        </ScrollView>
      )}
    </Formik>
  );
};

export default EditTaskScreen;
