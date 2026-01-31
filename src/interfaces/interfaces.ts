// ============================================
// User & Authentication Interfaces
// ============================================

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

// ============================================
// Admin & Role Management Interfaces
// ============================================

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

// ============================================
// Post Interfaces
// ============================================

export interface Post {
    id: number;
    title: string;
    content: string;
}

export interface PostsProps {
    data?: Post[];
    isLoading?: boolean;
    error?: Error | null;
}

export interface CreatePostsProps {
    onSuccess?: () => void;
    initialValues?: { id: number; title: string; content: string };
    mode?: 'create' | 'edit';
}

// ============================================
// Route Interfaces
// ============================================

export interface IPublicRoute {
    children: React.ReactNode;
}

export interface IPrivateRoute {
    children: React.ReactNode;
}

// ============================================
// Query & Cache Interfaces
// ============================================

export interface CacheEntry<T> {
    data: T;
    timestamp: number;
    updatedAt: (timestamp: number) => void;
}

export interface BaseOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
}

export interface QueryOptions<T> extends BaseOptions {
    method: 'GET';
    enabled?: boolean;
}

export interface MutationOptions<T, V> extends BaseOptions {
    method: 'POST' | 'PUT' | 'DELETE';
}

export interface QueryResult<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export interface MutationResult<T, V> {
    mutate: (variables: V) => void;
    isLoading: boolean;
    error: Error | null;
}
