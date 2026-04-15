import { http } from './index';
import { login } from './auth/login';
import { getProjectDemandContractTemplate } from './project-demand/get-contract-template';
import { getProjectDemandStampResource } from './project-demand/get-stamp-resource';
import { getProjectDemandWorkflowPreview } from './project-demand/get-workflow-preview';

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
}

export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

export const api = {
    auth: {
        login,
    },
    projectDemand: {
        getContractTemplate: getProjectDemandContractTemplate,
        getStampResource: getProjectDemandStampResource,
        getWorkflowPreview: getProjectDemandWorkflowPreview,
    },
    posts: {
        getAll: () => http.get<Post[]>('/posts'),
        getById: (id: number) => http.get<Post>(`/posts/${id}`),
        create: (data: Omit<Post, 'id'>) => http.post<Post>('/posts', data),
        update: (id: number, data: Partial<Post>) => http.put<Post>(`/posts/${id}`, data),
        delete: (id: number) => http.delete(`/posts/${id}`),
    },
    users: {
        getAll: () => http.get<User[]>('/users'),
        getById: (id: number) => http.get<User>(`/users/${id}`),
    },
    comments: {
        getByPostId: (postId: number) => http.get<Comment[]>(`/posts/${postId}/comments`),
    },
};
