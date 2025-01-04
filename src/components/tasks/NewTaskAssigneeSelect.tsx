import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, Menu, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { TaskFormValues } from '../../types/task';

interface NewTaskAssigneeSelectProps {
  formik: FormikProps<TaskFormValues>;
  teamMembers: Array<{ id: string; name: string }>;
}

const NewTaskAssigneeSelect: React.FC<NewTaskAssigneeSelectProps> = ({ 
  formik, 
  teamMembers 
}) => {
  const theme = useTheme();
  const [assigneeMenuVisible, setAssigneeMenuVisible] = React.useState(false);

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        marginTop: 16,
      },
      selectButton: {
        marginBottom: 4,
      },
      label: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
      },
    }),
    [theme]
  );

  const handleAssigneeSelect = (member: { id: string; name: string }) => {
    formik.setFieldValue('assignedTo', member.id);
    formik.setFieldValue('assigneeName', member.name);
    setAssigneeMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Atanan Kişi Seç</Text>
      <Menu
        visible={assigneeMenuVisible}
        onDismiss={() => setAssigneeMenuVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setAssigneeMenuVisible(true)}>
            <Button
              mode="outlined"
              style={styles.selectButton}
            >
              {formik.values.assigneeName || 'Atanan Kişi Seçiniz'}
            </Button>
          </TouchableOpacity>
        }
      >
        {teamMembers.map((member) => (
          <Menu.Item
            key={member.id}
            onPress={() => handleAssigneeSelect(member)}
            title={member.name}
          />
        ))}
      </Menu>
    </View>
  );
};

export default NewTaskAssigneeSelect;
