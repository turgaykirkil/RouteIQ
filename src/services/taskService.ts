import { Task, NewTaskInput } from '../types/task';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with Tech Corp',
    description: 'Schedule a meeting to discuss new requirements',
    dueDate: new Date('2024-02-15').toISOString(), 
    priority: 'high',
    customerId: '1',
    customerName: 'John Doe - Tech Corp',
    assignedTo: '1',
    assigneeName: 'Alice Johnson',
    status: 'in_progress',
    progress: 60,
    checklist: [
      { id: '1', title: 'Review previous meeting notes', completed: true },
      { id: '2', title: 'Prepare presentation', completed: true },
      { id: '3', title: 'Schedule meeting', completed: false },
      { id: '4', title: 'Send agenda', completed: false },
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    title: 'Prepare proposal for Design Co',
    description: 'Create a detailed proposal for the new project',
    dueDate: new Date('2024-02-20').toISOString(),
    priority: 'medium',
    customerId: '2',
    customerName: 'Jane Smith - Design Co',
    assignedTo: '2',
    assigneeName: 'Bob Smith',
    status: 'todo',
    progress: 0,
    checklist: [
      { id: '1', title: 'Gather requirements', completed: false },
      { id: '2', title: 'Create timeline', completed: false },
      { id: '3', title: 'Calculate budget', completed: false },
    ],
    createdAt: new Date('2024-01-05').toISOString(),
    updatedAt: new Date('2024-01-05').toISOString(),
  },
];

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(500);
    return [...mockTasks];
  },

  // Get task by id
  getTaskById: async (id: string): Promise<Task | undefined> => {
    await delay(300);
    return mockTasks.find(task => task.id === id);
  },

  // Create new task
  createTask: async (newTask: NewTaskInput): Promise<Task> => {
    await delay(500);
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      status: 'todo',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.push(task);
    return task;
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(500);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...mockTasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[index] = updatedTask;
    return updatedTask;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');
    mockTasks.splice(index, 1);
  },

  // Update task progress
  updateTaskProgress: async (id: string, progress: number): Promise<Task> => {
    await delay(500);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...mockTasks[index],
      progress,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[index] = updatedTask;
    return updatedTask;
  },

  // Update checklist item
  updateChecklistItem: async (
    taskId: string,
    itemId: string,
    completed: boolean
  ): Promise<Task> => {
    await delay(500);
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found');

    const checklistItemIndex = mockTasks[taskIndex].checklist.findIndex(
      item => item.id === itemId
    );
    if (checklistItemIndex === -1) throw new Error('Checklist item not found');

    mockTasks[taskIndex].checklist[checklistItemIndex].completed = completed;
    mockTasks[taskIndex].updatedAt = new Date().toISOString();

    return mockTasks[taskIndex];
  },

  // Update task status
  updateTaskStatus: async (
    id: string,
    status: Task['status']
  ): Promise<Task> => {
    await delay(500);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...mockTasks[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    mockTasks[index] = updatedTask;
    return updatedTask;
  },
};
