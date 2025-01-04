import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { TaskFormValues } from '../../types/task';

interface NewTaskPrioritySelectProps {
  formik: FormikProps<TaskFormValues>;
}

const NewTaskPrioritySelect: React.FC<NewTaskPrioritySelectProps> = ({ formik }) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        marginTop: 16, 
      },
      label: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8, 
      },
      priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      priorityChip: {
        flex: 1,
        marginHorizontal: 4, 
      },
    }),
    [theme]
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const handlePrioritySelect = (priority: 'low' | 'medium' | 'high') => {
    formik.setFieldValue('priority', priority);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Öncelik Seç</Text>
      <View style={styles.priorityContainer}>
        {(['low', 'medium', 'high'] as const).map((priority) => (
          <Chip
            key={priority}
            mode={formik.values.priority === priority ? 'flat' : 'outlined'}
            onPress={() => handlePrioritySelect(priority)}
            style={[
              styles.priorityChip,
              { 
                backgroundColor: formik.values.priority === priority 
                  ? getPriorityColor(priority) 
                  : theme.colors.surface 
              }
            ]}
            textStyle={{ 
              color: formik.values.priority === priority 
                ? theme.colors.onPrimary 
                : getPriorityColor(priority) 
            }}
          >
            {priority === 'low' 
              ? 'Düşük' 
              : priority === 'medium' 
                ? 'Orta' 
                : 'Yüksek'}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default NewTaskPrioritySelect;
