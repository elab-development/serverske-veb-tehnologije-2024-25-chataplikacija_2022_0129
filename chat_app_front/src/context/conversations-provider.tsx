import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-provider';
import api from '../api';
import type { Conversation, User, UserAndConversation } from '../types';
import { useNavigate } from 'react-router-dom';

interface ConversationsContextType {
    conversations: UserAndConversation[];
    selectedConversation: UserAndConversation | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>; //za sad je ne koristim ali mislim da ce mi trebati kad budem sokete dodao
    addConversation: (user: User) => Promise<void>;
    updateConversation: (id: number, updates: Partial<Conversation>) => void;
    deleteConversation: (id: number) => void;
    getOtherUser: (conversation: UserAndConversation) => User | null;
    getConversationById: (id: number) => UserAndConversation | undefined;
    selectConversation: (conversation: UserAndConversation | null) => void;
    selectConversationById: (id: number) => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<UserAndConversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<UserAndConversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const fetchConversations = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await api.get<UserAndConversation[]>(
                `/users-with-conversations`
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

    const addConversation = async (user: User) => {
        let newConversation = null;
        try{
            const response = await api.post<Conversation>('/conversation?user_id=' + user.id);
            newConversation = response.data;
        } catch (err: any) {
            console.error('Error adding conversation:', err);
        }

        await fetchConversations();
        navigate(`/conversations/${newConversation?.id}`);
    };

    const updateConversation = (id: number, updates: Partial<Conversation>) => {
        /*setConversations(prev =>
            prev.map(conv => (conv.id === id ? { ...conv, ...updates } : conv))
        );

        if (selectedConversation?.id === id) {
            setSelectedConversation(prev => prev ? { ...prev, ...updates } : null);
        }*/
    };

    const deleteConversation = (id: number) => {
        /*setConversations(prev => prev.filter(conv => conv.id !== id));
        
        if (selectedConversation?.id === id) {
            setSelectedConversation(null);
        }*/
    };

    const getOtherUser = (conversation: UserAndConversation): User | null => {
        return conversation.user;
    };

    const getConversationById = (id: number): UserAndConversation | undefined => {
        return conversations.find(conv => conv.conversation.id === id);
    };

    const selectConversation = (conversation: UserAndConversation | null) => {
        setSelectedConversation(conversation);
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
        refetch: fetchConversations,
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
