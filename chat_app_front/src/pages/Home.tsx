import ChatLayout from '../layouts/ChatLayout';
import { type User, type Conversation, Message } from '../types';
import { useEffect, useState } from 'react';
import echo from '../echo';
import api from '../api';
import { useAuth } from '../context/auth-provider';
import AppLayout from '../layouts/app-layout';
import { useConversations } from '../context/conversations-provider';
import { useParams } from 'react-router-dom';

export default function Home() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const { 
        selectConversation,
        selectConversationById, 
        selectedConversation,
        conversations
    } = useConversations();

    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const isUserOnline = (userId: number) => Boolean(onlineUsers[userId]);

    useEffect(() => {
        if (conversationId) {
            selectConversationById(Number(conversationId));
        }
        else {
            selectConversation(null);
        }
    }, [conversationId, conversations]);

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

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = async () => {
        if (!selectedConversation) {
            setLoading(false);
            return;
        }

        try{
            setLoading(true);
            const response = await api.get<Message[]>('/messages/by-conversation?conversation_id=' + selectedConversation.conversation.id);
            
            setMessages(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching messages:', err);
            setError(err.message);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedConversation]);

    return (
        <>
            <AppLayout>
                {/*<ChatLayout conversations={sortedConversations}></ChatLayout>*/}
                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {messages.map((message) => (
                    <div key={message.id}>
                        <div>{message.sender.name}: {message.content}</div>
                    </div>
                ))}
            </AppLayout>
            
        </>
    )
}
