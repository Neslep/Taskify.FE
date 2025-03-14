import type { Gender, PlanType, ProjectRoles, ProjectStatus } from './enum';

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
    memberEmails?: string[];
}

export interface UserType {
    id: number;
    name: string;
    avatar: string;
    gender: Gender | string;
    email: string;
    plans: PlanType | string;
}

export interface UserProjectType {
    id: number;
    userId: number;
    projectId: string;
    roleInProject: ProjectRoles | string;

    // Add other properties as needed
}

export interface TaskType {
    id: string;
    name: string;
    // Add other properties as needed
}

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
    status: ProjectStatus; // Now it's of type ProjectStatus
};

export type ProjectTableRowProps = {
    row: ProjectProps;
    selected: boolean;
    onSelectRow: () => void;
};