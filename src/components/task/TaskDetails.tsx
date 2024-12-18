import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, Divider } from 'react-native-paper';
import { formatDate } from '../../types/task';

interface TaskDetailsProps {
  description: string;
  priority: string;
  dueDate: string;
  customerName: string;
  onCustomerPress: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  description,
  priority,
  dueDate,
  customerName,
  onCustomerPress,
}) => {
  return (
    <Card style={styles.contentCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Detaylar
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {description}
        </Text>
        
        <Divider style={styles.divider} />
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>
              Öncelik
            </Text>
            <Chip mode="outlined" style={styles.priorityChip}>
              {priority}
            </Chip>
          </View>
          
          <View style={styles.detailItem}>
            <Text variant="labelMedium" style={styles.label}>
              Bitiş Tarihi
            </Text>
            <Text variant="bodyMedium">
              {formatDate(dueDate)}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.detailItem}
            onPress={onCustomerPress}
          >
            <Text variant="labelMedium" style={styles.label}>
              Müşteri
            </Text>
            <Text variant="bodyMedium" style={styles.linkText}>
              {customerName}
            </Text>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  contentCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    gap: 4,
  },
  label: {
    opacity: 0.7,
  },
  priorityChip: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#007AFF',
  },
});
