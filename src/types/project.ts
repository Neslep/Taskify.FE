import { Gender, PlanType, PriorityLevel, ProjectRoles, ProjectStatus, TaskStatus } from './enum';

export interface ProjectType {
  id: string;
  projectName: string;
  description: string;
  projectStatus: ProjectStatus | string;
  ownerId?: number;
  owner?: UserType[];
  userProjects: UserProjectType[];
  tasks: TaskType[];
  kanbans: KanbanType[];
  todolists: TodolistType[];
}

export interface UserType {
  id: string;
  userName: string;
  gender: Gender | string;
  email: string;
  plans: PlanType | string;
}

export interface UserProjectType {
  id: string;
  avatar: string;
  userId: number;
  member: UserType[];
  projectId: string;
  roleInProject: ProjectRoles | string;

  // Add other properties as needed
}

export type TaskType = {
  assignedUser: UserType;
  id: string;
  taskName: string;
  dueDate: Date ;
  priority: string | PriorityLevel;
  status: string | TaskStatus;
  assignedUserId: number;
};

export interface KanbanType {
  id: string;
  name: string;
  // Add other properties as needed
}

export interface TodolistType {
  id: string;
  name: string;
  // Add other properties as needed
}

export type ProjectProps = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
};

export type ProjectTableRowProps = {
  row: ProjectProps;
  selected: boolean;
  onSelectRow: () => void;
};

export type TaskProps = {
  id: string;
  taskName: string;
  assignee: { userName: string , userId: string, gender: Gender | string, userEmail: string}[];
  dueDate: Date | string;
  priority: PriorityLevel;
  status: TaskStatus;
};
