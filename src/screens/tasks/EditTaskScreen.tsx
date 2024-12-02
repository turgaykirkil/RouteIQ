import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  Button,
  HelperText,
  useTheme,
  Text,
  IconButton,
  Chip,
  Portal,
  Dialog,
  List,
  Checkbox,
  Menu,
  Divider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskStackParamList } from '../../navigation/types';
import { Task, TaskPriority, TaskStatus } from '../../types/task';
import { fetchTaskById, updateTask } from '../../store/slices/taskSlice';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';

type EditTaskScreenProps = {
  navigation: NativeStackNavigationProp<TaskStackParamList, 'EditTask'>;
  route: RouteProp<TaskStackParamList, 'EditTask'>;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
  status: Yup.string().oneOf(['todo', 'in_progress', 'completed']).required('Status is required'),
  customerId: Yup.string().required('Customer is required'),
  assigneeId: Yup.string().required('Assignee is required'),
  checklist: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      title: Yup.string().required('Checklist item title is required'),
      completed: Yup.boolean(),
    })
  ),
});

const EditTaskScreen = ({ navigation, route }: EditTaskScreenProps) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = route.params;
  const { selectedTask: task, loading } = useSelector((state: RootState) => state.tasks);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = React.useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = React.useState(false);
  const [deleteItemDialogVisible, setDeleteItemDialogVisible] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [newItemDialogVisible, setNewItemDialogVisible] = React.useState(false);
  const [newItemTitle, setNewItemTitle] = React.useState('');

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = () => {
    dispatch(fetchTaskById(taskId));
  };

  const handleSubmit = async (values: Partial<Task>) => {
    try {
      await dispatch(updateTask({ id: taskId, ...values }));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleAddChecklistItem = (values: any, setFieldValue: any) => {
    const newItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      completed: false,
    };
    const updatedChecklist = [...values.checklist, newItem];
    setFieldValue('checklist', updatedChecklist);
    setNewItemTitle('');
    setNewItemDialogVisible(false);
  };

  const handleDeleteChecklistItem = (values: any, setFieldValue: any) => {
    if (itemToDelete) {
      const updatedChecklist = values.checklist.filter(
        (item: any) => item.id !== itemToDelete
      );
      setFieldValue('checklist', updatedChecklist);
      setItemToDelete(null);
      setDeleteItemDialogVisible(false);
    }
  };

  if (!task || loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={task}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View style={styles.form}>
            <TextInput
              mode="outlined"
              label="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              error={touched.title && !!errors.title}
              style={styles.input}
            />
            {touched.title && errors.title && (
              <HelperText type="error">{errors.title}</HelperText>
            )}

            <TextInput
              mode="outlined"
              label="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              error={touched.description && !!errors.description}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            {touched.description && errors.description && (
              <HelperText type="error">{errors.description}</HelperText>
            )}

            <View style={styles.dateContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                Due Date: {new Date(values.dueDate).toLocaleDateString()}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(values.dueDate)}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue('dueDate', selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </View>

            <View style={styles.menuContainer}>
              <Menu
                visible={priorityMenuVisible}
                onDismiss={() => setPriorityMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setPriorityMenuVisible(true)}
                    style={styles.menuButton}
                  >
                    Priority: {values.priority.toUpperCase()}
                  </Button>
                }
              >
                {(['low', 'medium', 'high'] as TaskPriority[]).map((priority) => (
                  <Menu.Item
                    key={priority}
                    onPress={() => {
                      setFieldValue('priority', priority);
                      setPriorityMenuVisible(false);
                    }}
                    title={priority.toUpperCase()}
                  />
                ))}
              </Menu>

              <Menu
                visible={statusMenuVisible}
                onDismiss={() => setStatusMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setStatusMenuVisible(true)}
                    style={styles.menuButton}
                  >
                    Status: {values.status.replace('_', ' ').toUpperCase()}
                  </Button>
                }
              >
                {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map(
                  (status) => (
                    <Menu.Item
                      key={status}
                      onPress={() => {
                        setFieldValue('status', status);
                        setStatusMenuVisible(false);
                      }}
                      title={status.replace('_', ' ').toUpperCase()}
                    />
                  )
                )}
              </Menu>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.checklistSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Checklist</Text>
                <IconButton
                  icon="plus"
                  onPress={() => setNewItemDialogVisible(true)}
                />
              </View>

              {values.checklist.map((item: any, index: number) => (
                <List.Item
                  key={item.id}
                  title={item.title}
                  left={() => (
                    <Checkbox
                      status={item.completed ? 'checked' : 'unchecked'}
                      onPress={() => {
                        const updatedChecklist = [...values.checklist];
                        updatedChecklist[index].completed = !item.completed;
                        setFieldValue('checklist', updatedChecklist);
                      }}
                    />
                  )}
                  right={() => (
                    <IconButton
                      icon="delete"
                      onPress={() => {
                        setItemToDelete(item.id);
                        setDeleteItemDialogVisible(true);
                      }}
                    />
                  )}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.submitButton}
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
            </View>

            <Portal>
              <Dialog
                visible={deleteItemDialogVisible}
                onDismiss={() => setDeleteItemDialogVisible(false)}
              >
                <Dialog.Title>Delete Checklist Item</Dialog.Title>
                <Dialog.Content>
                  <Text>Are you sure you want to delete this item?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setDeleteItemDialogVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    onPress={() => handleDeleteChecklistItem(values, setFieldValue)}
                  >
                    Delete
                  </Button>
                </Dialog.Actions>
              </Dialog>

              <Dialog
                visible={newItemDialogVisible}
                onDismiss={() => setNewItemDialogVisible(false)}
              >
                <Dialog.Title>Add Checklist Item</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    mode="outlined"
                    label="Item Title"
                    value={newItemTitle}
                    onChangeText={setNewItemTitle}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setNewItemDialogVisible(false)}>
                    Cancel
                  </Button>
                  <Button
                    onPress={() => handleAddChecklistItem(values, setFieldValue)}
                  >
                    Add
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.sm,
  },
  dateContainer: {
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    marginBottom: theme.spacing.sm,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  menuButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  checklistSection: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.onSurface,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  submitButton: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  cancelButton: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
});

export default EditTaskScreen;
