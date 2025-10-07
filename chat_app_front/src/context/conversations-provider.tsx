import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-provider';
import api from '../api';
import type { Conversation, User } from '../types';

interface ConversationsContextType {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    loading: boolean;
    error: string | null;
    //refetch: () => Promise<void>; za sad je ne koristim ali mislim da ce mi trebati kad budem sokete dodao
    addConversation: (conversation: Conversation) => void;
    updateConversation: (id: number, updates: Partial<Conversation>) => void;
    deleteConversation: (id: number) => void;
    getOtherUser: (conversation: Conversation) => User | null;
    getConversationById: (id: number) => Conversation | undefined;
    selectConversation: (conversation: Conversation | null) => void;
    selectConversationById: (id: number) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get<Conversation[]>(
                `/conversations/by-user?user_id=${user.id}`
            );

            setConversations(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching conversations:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, [user?.id]);

    const addConversation = (conversation: Conversation) => {
        setConversations(prev => [conversation, ...prev]);
    };

    const updateConversation = (id: number, updates: Partial<Conversation>) => {
        setConversations(prev =>
            prev.map(conv => (conv.id === id ? { ...conv, ...updates } : conv))
        );

        if (selectedConversation?.id === id) {
            setSelectedConversation(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const deleteConversation = (id: number) => {
        setConversations(prev => prev.filter(conv => conv.id !== id));
        
        if (selectedConversation?.id === id) {
            setSelectedConversation(null);
        }
    };

    const getOtherUser = (conversation: Conversation): User | null => {
        if(!user?.id) {
            return null;
        }

        if (conversation.user_id1 === user.id) {
            return conversation.user2 || null;
        } else if (conversation.user_id2 === user.id) {
            return conversation.user1 || null;
        }

        return null;
    };

    const getConversationById = (id: number): Conversation | undefined => {
        return conversations.find(conv => conv.id === id);
    };

    const selectConversation = (conversation: Conversation | null) => {
        setSelectedConversation(conversation);
        console.log('Selected conversation:', conversation);
    };

    const selectConversationById = (id: number) => {
        const conversation = getConversationById(id);
        setSelectedConversation(conversation || null);
    };

    const value = {
        conversations,
        selectedConversation,
        loading,
        error,
        //refetch: fetchConversations,
        addConversation,
        updateConversation,
        deleteConversation,
        getOtherUser,
        getConversationById,
        selectConversation,
        selectConversationById,
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
}

export function useConversations() {
    const context = useContext(ConversationsContext);
    
    if (context === undefined) {
        throw new Error('useConversations must be used within ConversationsProvider');
    }
    
    return context;
}
