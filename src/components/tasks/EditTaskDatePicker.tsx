import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FormikProps } from 'formik';
import { Task } from '../../types/task';
import { formatDate } from '../../utils/display';

interface EditTaskDatePickerProps {
  formik: FormikProps<Task>;
}

const EditTaskDatePicker: React.FC<EditTaskDatePickerProps> = ({ formik }) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const styles = React.useMemo(
    () => StyleSheet.create({
      container: {
        marginTop: 16,
      },
      label: {
        color: theme.colors.onSurfaceVariant,
        marginBottom: 8,
      },
      dateButton: {
        marginBottom: 4,
      },
    }),
    [theme]
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      formik.setFieldValue('dueDate', selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Son Tarih</Text>
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {formatDate(formik.values.dueDate)}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={formik.values.dueDate}
          mode="date"
          is24Hour={true}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

export default EditTaskDatePicker;
