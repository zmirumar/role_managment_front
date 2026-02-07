
export interface User {
    id: number;
    username: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface Permissions {
    [key: string]: boolean;
}

export interface AuthState {
    token: string | null;
    isLogged: boolean;
    user: User | null;
    permissions: Permissions;
    login: (token: string, user: User, permissions: Permissions) => void;
    logout: () => void;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
}

export interface AdminUser {
    id: number;
    username: string;
    role: Role;
    created_at: string;
    updated_at: string;
}


export interface Post {
    id: number;
    title: string;
    content: string;
}

export interface CreatePostsProps {
    onSuccess?: () => void;
    initialValues?: { id: number; title: string; content: string };
    mode?: 'create' | 'edit';
}

export interface IPublicRoute {
    children: React.ReactNode;
}

export interface IPrivateRoute {
    children: React.ReactNode;
}
