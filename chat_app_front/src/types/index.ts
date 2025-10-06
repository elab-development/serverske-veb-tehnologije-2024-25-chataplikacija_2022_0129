import { type LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
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

export interface PageProps {  //ovo isto koristi za inertia
  auth: {
    user: User
  }
  conversations: Conversation[];
  selectedConversation: Conversation | null;
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

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    is_admin: boolean;
    is_blocked: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    conversation_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Conversation {
    id: number;
    name: string;
    user_id1: number;
    user_id2: number;
    //messages: Message[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}