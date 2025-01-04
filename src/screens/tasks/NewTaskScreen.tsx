import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

import NewTaskForm from '../../components/tasks/NewTaskForm';
import NewTaskCustomerSelect from '../../components/tasks/NewTaskCustomerSelect';
import NewTaskAssigneeSelect from '../../components/tasks/NewTaskAssigneeSelect';
import NewTaskPrioritySelect from '../../components/tasks/NewTaskPrioritySelect';
import NewTaskDatePicker from '../../components/tasks/NewTaskDatePicker';
import NewTaskChecklist from '../../components/tasks/NewTaskChecklist';

import { TaskFormValues } from '../../types/task';
import { createTask } from '../../services/taskService';

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Başlık gereklidir'),
  description: Yup.string(),
  customerId: Yup.string().required('Müşteri seçimi gereklidir'),
  assignedTo: Yup.string().required('Atanan kişi gereklidir'),
  priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Geçersiz öncelik').required('Öncelik gereklidir'),
  dueDate: Yup.date().required('Son tarih gereklidir'),
  checklist: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      title: Yup.string().required(),
      completed: Yup.boolean().required()
    })
  )
});

const NewTaskScreen: React.FC<any> = ({ navigation, route }) => {
  const theme = useTheme();
  const { customers, teamMembers } = route.params || { customers: [], teamMembers: [] };

  const initialValues: TaskFormValues = {
    id: generateUniqueId(),
    title: '',
    description: '',
    customerId: '',
    customerName: '',
    assignedTo: '',
    assigneeName: '',
    priority: 'medium',
    dueDate: new Date(),
    checklist: [],
    status: 'pending'
  };

  const handleSubmit = async (values: TaskFormValues, { resetForm, setSubmitting }: any) => {
    try {
      setSubmitting(true);
      await createTask(values);
      navigation.goBack();
      resetForm();
    } catch (error) {
      console.error('Görev oluşturulurken hata:', error);
      setSubmitting(false);
    }
  };

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 100 : 70, // Bottom navigation ve safe area için ekstra padding
        backgroundColor: theme.colors.background,
      },
      submitButton: {
        marginTop: 16,
      }
    }),
    [theme]
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <ScrollView 
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <NewTaskForm formik={formik} />
          <NewTaskCustomerSelect 
            formik={formik} 
            customers={customers} 
          />
          <NewTaskAssigneeSelect 
            formik={formik} 
            teamMembers={teamMembers} 
          />
          <NewTaskPrioritySelect formik={formik} />
          <NewTaskDatePicker formik={formik} />
          <NewTaskChecklist formik={formik} />
          
          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            style={styles.submitButton}
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            Görevi Kaydet
          </Button>
        </ScrollView>
      )}
    </Formik>
  );
};

export default NewTaskScreen;
