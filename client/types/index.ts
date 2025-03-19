export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date | null;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}