export interface PermissionEntry {
    key: string;
    label: string;
    path: string;
}

export interface User {
    id: number | string;
    name: string;
    account: string;
    email: string;
    avatar?: string;
    role?: string;
}

export interface UserSessionPayload {
    token: string;
    user: User;
    permissions: PermissionEntry[];
}

export interface UserSessionState {
    token: string | null;
    currentUser: User | null;
    permissions: PermissionEntry[];
    initialized: boolean;
}
