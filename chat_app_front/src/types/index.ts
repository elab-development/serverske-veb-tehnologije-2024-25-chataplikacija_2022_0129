import { type LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    //href: NonNullable<InertiaLinkProps['href']>;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData { //ovo isto koristi za inertia
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}




//novi tipovi - ne predefinisani
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_at: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}


export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
    is_online: boolean;
    [key: string]: unknown;
}

export interface Message {
    id: number;
    sender: User;
    receiver: User;
    conversation_id: number;
    content: string;
    attachments: Attachment[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Conversation {
    id: number;
    name: string | null;
    created_at: string;
    updated_at: string;
    user1: User;
    user2: User;
    [key: string]: unknown;
}

export interface Attachment {
    id: number;
    message_id: number;
    name: string;
    path: string;
    mime: string;
    size: number;
    url: string;
    type: 'image' | 'file' | 'video' | 'audio' | 'document' | 'other';
    is_giphy: boolean;
    created_at: string;
    [key: string]: unknown;
}

export interface UserAndConversation {
    user: User;
    conversation: Conversation;
    [key: string]: unknown;
}