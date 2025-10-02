import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PageProps {
  auth: {
    user: User
  }
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  [key: string]: unknown;
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