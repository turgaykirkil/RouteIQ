import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Chip,
  List,
  IconButton,
  Menu,
  useTheme,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TaskStackParamList } from '../../navigation/types';

type NewTaskScreenProps = {
  navigation: NativeStackNavigationProp<TaskStackParamList, 'NewTask'>;
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Priority is required'),
  customerId: Yup.string().required('Customer is required'),
  assignedTo: Yup.string().required('Assignee is required'),
  checklist: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().required(),
      title: Yup.string().required('Checklist item title is required'),
      completed: Yup.boolean(),
    })
  ),
});

type TaskFormValues = {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  customerId: string;
  customerName: string;
  assignedTo: string;
  assigneeName: string;
  checklist: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
};

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  dueDate: new Date(),
  priority: 'medium',
  customerId: '',
  customerName: '',
  assignedTo: '',
  assigneeName: '',
  checklist: [],
};

// Mock data for customers and team members
const mockCustomers = [
  { id: '1', name: 'John Doe - Tech Corp' },
  { id: '2', name: 'Jane Smith - Design Co' },
];

const mockTeamMembers = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
];

const NewTaskScreen = ({ navigation }: NewTaskScreenProps) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [customerMenuVisible, setCustomerMenuVisible] = React.useState(false);
  const [assigneeMenuVisible, setAssigneeMenuVisible] = React.useState(false);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        form: {
          padding: theme.spacing.md,
        },
        input: {
          marginBottom: theme.spacing.xs,
        },
        label: {
          ...theme.typography.body,
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
          marginTop: theme.spacing.md,
        },
        dateButton: {
          marginBottom: theme.spacing.md,
        },
        priorityContainer: {
          flexDirection: 'row',
          marginBottom: theme.spacing.md,
        },
        priorityChip: {
          marginRight: theme.spacing.sm,
        },
        priorityText: {
          color: theme.colors.text,
        },
        selectedPriorityText: {
          color: theme.colors.white,
        },
        selectButton: {
          marginBottom: theme.spacing.xs,
        },
        checklistItem: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.sm,
        },
        checklistInput: {
          flex: 1,
          marginRight: theme.spacing.sm,
        },
        addButton: {
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.lg,
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        button: {
          flex: 1,
          marginHorizontal: theme.spacing.xs,
        },
      }),
    [theme]
  );

  const handleSubmit = (values: TaskFormValues) => {
    // TODO: Implement API call to create task
    navigation.goBack();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.placeholder;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Formik
          initialValues={initialValues}
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
                label="Title"
                mode="outlined"
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                error={touched.title && !!errors.title}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.title && !!errors.title}>
                {errors.title}
              </HelperText>

              <TextInput
                label="Description"
                mode="outlined"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                error={touched.description && !!errors.description}
                style={styles.input}
                multiline
                numberOfLines={4}
              />
              <HelperText
                type="error"
                visible={touched.description && !!errors.description}
              >
                {errors.description}
              </HelperText>

              <Text style={styles.label}>Due Date</Text>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {values.dueDate.toLocaleDateString()}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={values.dueDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue('dueDate', selectedDate);
                    }
                  }}
                />
              )}

              <Text style={styles.label}>Priority</Text>
              <View style={styles.priorityContainer}>
                {['low', 'medium', 'high'].map((priority) => (
                  <Chip
                    key={priority}
                    selected={values.priority === priority}
                    onPress={() => setFieldValue('priority', priority)}
                    style={[
                      styles.priorityChip,
                      values.priority === priority && {
                        backgroundColor: getPriorityColor(priority),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        values.priority === priority && styles.selectedPriorityText,
                      ]}
                    >
                      {priority.toUpperCase()}
                    </Text>
                  </Chip>
                ))}
              </View>

              <Text style={styles.label}>Customer</Text>
              <Menu
                visible={customerMenuVisible}
                onDismiss={() => setCustomerMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setCustomerMenuVisible(true)}
                    style={styles.selectButton}
                  >
                    {values.customerName || 'Select Customer'}
                  </Button>
                }
              >
                {mockCustomers.map((customer) => (
                  <Menu.Item
                    key={customer.id}
                    onPress={() => {
                      setFieldValue('customerId', customer.id);
                      setFieldValue('customerName', customer.name);
                      setCustomerMenuVisible(false);
                    }}
                    title={customer.name}
                  />
                ))}
              </Menu>
              <HelperText
                type="error"
                visible={touched.customerId && !!errors.customerId}
              >
                {errors.customerId}
              </HelperText>

              <Text style={styles.label}>Assigned To</Text>
              <Menu
                visible={assigneeMenuVisible}
                onDismiss={() => setAssigneeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setAssigneeMenuVisible(true)}
                    style={styles.selectButton}
                  >
                    {values.assigneeName || 'Select Assignee'}
                  </Button>
                }
              >
                {mockTeamMembers.map((member) => (
                  <Menu.Item
                    key={member.id}
                    onPress={() => {
                      setFieldValue('assignedTo', member.id);
                      setFieldValue('assigneeName', member.name);
                      setAssigneeMenuVisible(false);
                    }}
                    title={member.name}
                  />
                ))}
              </Menu>
              <HelperText
                type="error"
                visible={touched.assignedTo && !!errors.assignedTo}
              >
                {errors.assignedTo}
              </HelperText>

              <Text style={styles.label}>Checklist</Text>
              {values.checklist.map((item, index) => (
                <View key={item.id} style={styles.checklistItem}>
                  <TextInput
                    mode="outlined"
                    value={item.title}
                    onChangeText={(text) => {
                      const newChecklist = [...values.checklist];
                      newChecklist[index].title = text;
                      setFieldValue('checklist', newChecklist);
                    }}
                    style={styles.checklistInput}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => {
                      const newChecklist = values.checklist.filter(
                        (_, i) => i !== index
                      );
                      setFieldValue('checklist', newChecklist);
                    }}
                  />
                </View>
              ))}
              <Button
                mode="outlined"
                onPress={() => {
                  const newChecklist = [
                    ...values.checklist,
                    {
                      id: Date.now().toString(),
                      title: '',
                      completed: false,
                    },
                  ];
                  setFieldValue('checklist', newChecklist);
                }}
                style={styles.addButton}
              >
                Add Checklist Item
              </Button>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.goBack()}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleSubmit()}
                  style={styles.button}
                >
                  Create Task
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

export default NewTaskScreen;
