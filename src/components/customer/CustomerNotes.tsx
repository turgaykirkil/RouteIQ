import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Customer } from '../../types/customer';

interface CustomerNotesProps {
  customer: Customer | null;
}

const CustomerNotes = memo<CustomerNotesProps>(({ customer }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Notes</Text>
      <Text style={styles.notesText}>{customer?.notes || 'No notes available'}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.87,
  },
});

CustomerNotes.displayName = 'CustomerNotes';

export default CustomerNotes;
