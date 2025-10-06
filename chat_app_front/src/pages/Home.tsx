import ChatLayout from '../layouts/ChatLayout';
import { type User, type Conversation } from '../types';
import { useEffect, useState } from 'react';
import echo from '../echo';
import api from '../api';
import { useAuth } from '../context/auth-provider';

export default function Home() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const isUserOnline = (userId: number) => Boolean(onlineUsers[userId]);

    useEffect(() => {
        const fetchData = async () => {
            if(!user) return;

            try{
                console.log(user.id);
                const conversationsResponse = await api.get<Conversation[]>('/conversations/by-user?user_id=' + user.id);
                setConversations(conversationsResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        console.log('user', user);
        console.log('conversations', conversations);
    }, []);

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

    /*useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);*/

    /*useEffect(() => {
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
    }, []);*/

    return <ChatLayout conversations={sortedConversations}></ChatLayout>;
}
