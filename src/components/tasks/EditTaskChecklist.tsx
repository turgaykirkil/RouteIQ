import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, Checkbox, Text, useTheme } from 'react-native-paper';
import { FormikProps } from 'formik';
import { Task } from '../../types/task';

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

interface EditTaskChecklistProps {
  formik: FormikProps<Task>;
}

const EditTaskChecklist: React.FC<EditTaskChecklistProps> = ({ formik }) => {
  const theme = useTheme();
  const [newChecklistItem, setNewChecklistItem] = React.useState('');

  const styles = React.useMemo(
    () => StyleSheet.create({
      checklistContainer: {
        marginTop: 16, 
      },
      checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, 
      },
      checklistInput: {
        flex: 1,
        marginRight: 8, 
      },
      addChecklistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12, 
      },
      addChecklistInput: {
        flex: 1,
        marginRight: 8, 
      },
      emptyText: {
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        marginVertical: 16, 
      },
    }),
    [theme]
  );

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      const newItem = {
        id: generateUniqueId(),
        title: newChecklistItem.trim(),
        completed: false,
      };
      formik.setFieldValue('checklist', [...formik.values.checklist, newItem]);
      setNewChecklistItem('');
    }
  };

  const removeChecklistItem = (id: string) => {
    formik.setFieldValue(
      'checklist', 
      formik.values.checklist.filter(item => item.id !== id)
    );
  };

  const toggleChecklistItem = (id: string) => {
    formik.setFieldValue(
      'checklist', 
      formik.values.checklist.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <View style={styles.checklistContainer}>
      {formik.values.checklist.length === 0 ? (
        <Text style={styles.emptyText}>Henüz kontrol listesi eklenmemiş</Text>
      ) : (
        formik.values.checklist.map((item) => (
          <View key={item.id} style={styles.checklistItem}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleChecklistItem(item.id)}
            />
            <TextInput
              value={item.title}
              style={styles.checklistInput}
              mode="flat"
              disabled
            />
            <IconButton 
              icon="delete" 
              size={20} 
              onPress={() => removeChecklistItem(item.id)} 
            />
          </View>
        ))
      )}
      
      <View style={styles.addChecklistContainer}>
        <TextInput
          value={newChecklistItem}
          onChangeText={setNewChecklistItem}
          placeholder="Kontrol listesi maddesi ekle"
          style={styles.addChecklistInput}
          mode="outlined"
          right={
            <TextInput.Icon 
              icon="plus" 
              onPress={addChecklistItem} 
              disabled={!newChecklistItem.trim()}
            />
          }
          onSubmitEditing={addChecklistItem}
        />
      </View>
    </View>
  );
};

export default EditTaskChecklist;
