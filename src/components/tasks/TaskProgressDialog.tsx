import React from 'react';
import { Portal, Dialog, TextInput, Button } from 'react-native-paper';

interface TaskProgressDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onUpdate: () => void;
  progress: string;
  onProgressChange: (value: string) => void;
}

const TaskProgressDialog: React.FC<TaskProgressDialogProps> = ({
  visible,
  onDismiss,
  onUpdate,
  progress,
  onProgressChange
}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
      >
        <Dialog.Title>İlerleme Güncelle</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="İlerleme (%)"
            value={progress}
            onChangeText={onProgressChange}
            keyboardType="numeric"
            maxLength={3}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>İptal</Button>
          <Button onPress={onUpdate}>Güncelle</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default TaskProgressDialog;
