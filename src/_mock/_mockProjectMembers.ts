export type ProjectMember = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  joinedDate: string;
  avatar?: string;
};

export const mockProjectMembers: ProjectMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    joinedDate: '2024-01-15',
    avatar: '/assets/avatars/avatar_1.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    joinedDate: '2024-02-01',
    avatar: '/assets/avatars/avatar_2.jpg',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'viewer',
    joinedDate: '2024-02-15',
    avatar: '/assets/avatars/avatar_3.jpg',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'member',
    joinedDate: '2024-03-01',
    avatar: '/assets/avatars/avatar_4.jpg',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'viewer',
    joinedDate: '2024-03-10',
    avatar: '/assets/avatars/avatar_5.jpg',
  },
];
