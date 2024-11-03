import type { ProjectProps } from '../sections/userProject/projectDetail/project-table-row';

export const _mockProjects: ProjectProps[] = [
  {
    id: '1',
    taskName: 'Design User Interface',
    assignee: {
      name: 'John Doe',
      avatar: '/assets/avatars/avatar_1.jpg',
    },
    dueDate: '2024-04-15',
    priority: 'High',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: '2',
    taskName: 'Backend API Development',
    assignee: {
      name: 'Jane Smith',
      avatar: '/assets/avatars/avatar_2.jpg',
    },
    dueDate: '2024-04-20',
    priority: 'Medium',
    status: 'Pending',
    progress: 30,
  },
  {
    id: '3',
    taskName: 'Database Optimization',
    assignee: {
      name: 'Mike Wilson',
      avatar: '/assets/avatars/avatar_3.jpg',
    },
    dueDate: '2024-04-10',
    priority: 'Low',
    status: 'Completed',
    progress: 100,
  },
  {
    id: '4',
    taskName: 'Testing and QA',
    assignee: {
      name: 'Sarah Johnson',
      avatar: '/assets/avatars/avatar_4.jpg',
    },
    dueDate: '2024-04-25',
    priority: 'High',
    status: 'In Progress',
    progress: 45,
  },
  {
    id: '5',
    taskName: 'Documentation',
    assignee: {
      name: 'Tom Brown',
      avatar: '/assets/avatars/avatar_5.jpg',
    },
    dueDate: '2024-04-30',
    priority: 'Medium',
    status: 'Pending',
    progress: 0,
  },
];
