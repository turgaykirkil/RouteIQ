export type TaskPriority = 'low' | 'medium' | 'high';

export type ChecklistItem = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  priority: TaskPriority;
  customerId: string;
  customerName: string;
  assignedTo: string;
  assigneeName: string;
  status: 'todo' | 'in_progress' | 'completed';
  progress: number;
  checklist: ChecklistItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type NewTaskInput = Omit<
  Task,
  'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'
>;

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high':
      return '#dc3545'; // error red
    case 'medium':
      return '#ffc107'; // warning yellow
    case 'low':
      return '#28a745'; // success green
    default:
      return '#6c757d'; // gray
  }
};

export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'completed':
      return '#28a745'; // success green
    case 'in_progress':
      return '#007bff'; // primary blue
    case 'todo':
      return '#6c757d'; // gray
    default:
      return '#6c757d';
  }
};

export const calculateProgress = (task: Task): number => {
  if (!task.checklist.length) return task.status === 'completed' ? 100 : 0;
  
  const completedItems = task.checklist.filter(item => item.completed).length;
  return Math.round((completedItems / task.checklist.length) * 100);
};

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};
