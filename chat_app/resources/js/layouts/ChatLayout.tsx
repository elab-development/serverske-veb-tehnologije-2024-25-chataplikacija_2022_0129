import { dashboard } from '@/routes';
import { type NavItem, type User, type PageProps, type Conversation } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import echo from '../bootstrap';

interface ChatLayoutProps {
    children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    const page = usePage<PageProps>();
    const user: User = page.props.auth.user;
    const conversations: Conversation[] = page.props.conversations;
    const selectedConversation: Conversation | null = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const isUserOnline = (userId: number) => Boolean(onlineUsers[userId]);
    console.log('conversations', conversations);
    console.log('selectedConversation', selectedConversation);

    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
                if (a.updated_at && b.updated_at) {
                    return b.updated_at.localeCompare(a.updated_at);
                } else if (a.updated_at) {
                    return -1;
                } else if (b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            }),
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        const channel = echo
            .join('online')
            .here((users: User[]) => {
                const onlineUsersObj: Record<number, User> = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers(onlineUsersObj);
            })
            .joining((user: User) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user: User) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            })
            .error((error: any) => {
                console.error('error', error);
            });

        return () => {
            echo.leave('online');
        };
    }, []);
    const formattedConversations = localConversations.map((conv: Conversation) => ({
        name: conv.name || `Chat ${conv.id}`
    }));

    return (
        <AppShell variant="sidebar">
            <AppSidebar conversations={formattedConversations}/>
            <div className="flex w-full flex-col">{children}</div>
        </AppShell>
    );
}
