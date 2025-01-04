import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { Task } from '../../types/task';

interface EditTaskFormProps {
  formik: FormikProps<Task>;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ formik }) => {
  const theme = useTheme();

  const styles = React.useMemo(
    () => StyleSheet.create({
      input: {
        marginBottom: 8,
      },
      helperText: {
        marginBottom: 12,
      },
    }),
    [theme]
  );

  return (
    <View>
      <TextInput
        mode="outlined"
        label="Başlık"
        value={formik.values.title}
        onChangeText={formik.handleChange('title')}
        onBlur={formik.handleBlur('title')}
        error={formik.touched.title && !!formik.errors.title}
        style={styles.input}
      />
      {formik.touched.title && formik.errors.title && (
        <HelperText 
          type="error" 
          visible={formik.touched.title && !!formik.errors.title}
          style={styles.helperText}
        >
          {formik.errors.title}
        </HelperText>
      )}

      <TextInput
        mode="outlined"
        label="Açıklama"
        multiline
        numberOfLines={4}
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
        error={formik.touched.description && !!formik.errors.description}
        style={styles.input}
      />
      {formik.touched.description && formik.errors.description && (
        <HelperText 
          type="error" 
          visible={formik.touched.description && !!formik.errors.description}
          style={styles.helperText}
        >
          {formik.errors.description}
        </HelperText>
      )}
    </View>
  );
};

export default EditTaskForm;
