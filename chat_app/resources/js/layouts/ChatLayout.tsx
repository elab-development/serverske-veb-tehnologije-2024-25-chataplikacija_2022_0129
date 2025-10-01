import { dashboard } from '@/routes';
import { type NavItem, type User } from '@/types';
import { usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import echo from '../bootstrap';

interface ChatLayoutProps {
    children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    const page = usePage();
    const user: User = page.props.auth.user;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState(conversations);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const isUserOnline = (userId) => onlineUsers[userId];
    console.log('conversations', conversations);
    console.log('selectedConversation', selectedConversation);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localCompare(a.last_message_date);
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
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
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers(onlineUsersObj);
            })
            .joining((user) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            })
            .error((error) => {
                console.error('error', error);
            });

        return () => {
            echo.leave('online');
        };
    }, []);
    const formattedConversations = localConversations.map((conv: any) => ({
        name: conv.name || `Chat ${conv.id}`,
        lastMessage: conv.last_message?.content || undefined,
    }));

    return (
        <AppShell variant="sidebar">
            <AppSidebar conversations={formattedConversations}/>
            <div className="flex w-full flex-col">{children}</div>
        </AppShell>
    );
}
