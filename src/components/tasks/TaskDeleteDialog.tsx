import React from 'react';
import { Portal, Dialog, Text, Button } from 'react-native-paper';

interface TaskDeleteDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onDelete: () => void;
  taskTitle?: string;
}

const TaskDeleteDialog: React.FC<TaskDeleteDialogProps> = ({
  visible,
  onDismiss,
  onDelete,
  taskTitle
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
      >
        <Dialog.Title>Görevi Sil</Dialog.Title>
        <Dialog.Content>
          <Text>
            {taskTitle 
              ? `"${taskTitle}" başlıklı görevi silmek istediğinizden emin misiniz?` 
              : 'Bu görevi silmek istediğinizden emin misiniz?'}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>İptal</Button>
          <Button onPress={onDelete} mode="contained" color="error">Sil</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default TaskDeleteDialog;
