import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { Task } from '../../types/task';

interface EditTaskStatusSelectProps {
  formik: FormikProps<Task>;
}

const EditTaskStatusSelect: React.FC<EditTaskStatusSelectProps> = ({ formik }) => {
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
      statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      statusChip: {
        flex: 1,
        marginHorizontal: 4,
      },
    }),
    [theme]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
      case 'todo':
        return theme.colors.primary;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const handleStatusSelect = (status: 'todo' | 'in_progress' | 'completed') => {
    formik.setFieldValue('status', status);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Durum Seç</Text>
      <View style={styles.statusContainer}>
        {(['todo', 'in_progress', 'completed'] as const).map((status) => (
          <Chip
            key={status}
            mode={formik.values.status === status ? 'flat' : 'outlined'}
            onPress={() => handleStatusSelect(status)}
            style={[
              styles.statusChip,
              { 
                backgroundColor: formik.values.status === status 
                  ? getStatusColor(status) 
                  : theme.colors.surface 
              }
            ]}
            textStyle={{ 
              color: formik.values.status === status 
                ? theme.colors.onPrimary 
                : getStatusColor(status) 
            }}
          >
            {status === 'todo' 
              ? 'Yapılacak' 
              : status === 'in_progress' 
                ? 'Devam Ediyor' 
                : 'Tamamlandı'}
          </Chip>
        ))}
      </View>
    </View>
  );
};

export default EditTaskStatusSelect;
