import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, HelperText, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { TaskFormValues } from '../../types/task';

interface NewTaskFormProps {
  formik: FormikProps<TaskFormValues>;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ formik }) => {
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
        label="Başlık"
        mode="outlined"
        value={formik.values.title}
        onChangeText={formik.handleChange('title')}
        onBlur={formik.handleBlur('title')}
        error={formik.touched.title && !!formik.errors.title}
        style={styles.input}
      />
      <HelperText 
        type="error" 
        visible={formik.touched.title && !!formik.errors.title}
        style={styles.helperText}
      >
        {formik.errors.title}
      </HelperText>

      <TextInput
        label="Açıklama"
        mode="outlined"
        multiline
        numberOfLines={4}
        value={formik.values.description}
        onChangeText={formik.handleChange('description')}
        onBlur={formik.handleBlur('description')}
        error={formik.touched.description && !!formik.errors.description}
        style={styles.input}
      />
      <HelperText 
        type="error" 
        visible={formik.touched.description && !!formik.errors.description}
        style={styles.helperText}
      >
        {formik.errors.description}
      </HelperText>
    </View>
  );
};

export default NewTaskForm;
