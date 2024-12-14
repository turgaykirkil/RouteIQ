import { Task, NewTaskInput } from '../types/task';
import db from '../../db.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simulated delay for async operations
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  // Get all tasks with optional filters
  getTasks: async (params?: {
    search?: string;
    status?: string[];
    priority?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    role?: 'admin' | 'supervisor' | 'sales_rep';
  }) => {

    await delay(500);
    
    let tasks = [...db.tasks];
    

    // Apply search filter
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      
      tasks = tasks.filter(task => {
        const matchTitle = task.title.toLowerCase().includes(searchLower);
        const matchDescription = task.description.toLowerCase().includes(searchLower);
        
        return matchTitle || matchDescription;
      });

    }

    // Apply status filter
    if (params?.status?.length) {
      
      tasks = tasks.filter(task => {
        const isStatusMatch = params.status.includes(task.status);
        return isStatusMatch;
      });

    }

    // Apply priority filter
    if (params?.priority?.length) {
      
      tasks = tasks.filter(task => {
        const isPriorityMatch = params.priority.includes(task.priority);
        return isPriorityMatch;
      });

    }

    // Apply sorting
    if (params?.sortBy) {
      
      tasks.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Task];
        const bValue = b[params.sortBy as keyof Task];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        
        return aValue < bValue ? -order : order;
      });

    }

    return tasks;
  },

  // Get task by id
  getTaskById: async (id: string): Promise<Task | undefined> => {
    try {
      await delay(300);

      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        throw new Error('Kullanıcı girişi yapılmamış!');
      }
      
      const user = JSON.parse(userStr);

      const task = db.tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error('Görev bulunamadı!');
      }
      
      // Eğer kullanıcı sales_rep ise ve görev kendisine ait değilse, erişimi engelle
      if (user.role === 'sales_rep' && task.salesRepId !== user.id) {
        throw new Error('Bu göreve erişim yetkiniz yok!');
      }
      
      return task;
    } catch (error) {
      throw error;
    }
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
    db.tasks.push(task);
    return task;
  },

  // Update task
  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(500);
    const index = db.tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');

    const updatedTask = {
      ...db.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db.tasks[index] = updatedTask;
    return updatedTask;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await delay(500);
    const index = db.tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');
    db.tasks.splice(index, 1);
  },

  // Update checklist item
  updateChecklistItem: async (
    taskId: string,
    itemId: string,
    completed: boolean
  ): Promise<Task> => {
    await delay(500);
    const task = db.tasks.find(task => task.id === taskId);
    if (!task) throw new Error('Task not found');

    const checklistItem = task.checklist.find(item => item.id === itemId);
    if (!checklistItem) throw new Error('Checklist item not found');

    checklistItem.completed = completed;
    task.updatedAt = new Date().toISOString();
    return task;
  },

  // Update task status
  updateTaskStatus: async (
    id: string,
    status: Task['status']
  ): Promise<Task> => {
    await delay(500);
    const task = db.tasks.find(task => task.id === id);
    if (!task) throw new Error('Task not found');

    task.status = status;
    task.updatedAt = new Date().toISOString();
    return task;
  },

  // Update task progress
  updateTaskProgress: async (
    id: string,
    progress: number
  ): Promise<Task> => {
    await delay(500);
    const task = db.tasks.find(task => task.id === id);
    if (!task) throw new Error('Task not found');

    task.progress = progress;
    task.updatedAt = new Date().toISOString();
    return task;
  },
};
