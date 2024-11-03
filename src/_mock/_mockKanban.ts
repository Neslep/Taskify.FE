// src/_mock/_mockKanban.ts
export interface KanbanTaskData {
  id: string;
  name: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  attachments?: number;
  comments?: number;
  assignee?: {
    avatar: string;
    name: string;
  };
}

export type KanbanColumnData = {
  id: string;
  name: string;
  taskIds: string[];
};

export const mockTasks: Record<string, KanbanTaskData> = {
  'task-1': {
    id: 'task-1',
    name: 'Create Firebase Database',
    description: 'Setup Firebase Realtime Database',
    priority: 'high',
  },
  'task-2': {
    id: 'task-2',
    name: 'Design System',
    description: 'Create design system for project',
    priority: 'medium',
  },
  'task-3': {
    id: 'task-3',
    name: 'User Authentication',
    description: 'Implement login/register',
    priority: 'high',
  },
};

export const mockColumns: KanbanColumnData[] = [
  {
    id: 'col-1',
    name: 'To Do',
    taskIds: ['task-1', 'task-2'],
  },
  {
    id: 'col-2',
    name: 'In Progress',
    taskIds: ['task-3'],
  },
  {
    id: 'col-3',
    name: 'Done',
    taskIds: [],
  },
];
