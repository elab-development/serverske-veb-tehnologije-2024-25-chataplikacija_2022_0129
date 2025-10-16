import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-provider';
import api from '../api';
import type { Conversation, User, UserAndConversation } from '../types';
import { useNavigate } from 'react-router-dom';
import echo from '../echo';

interface ConversationsContextType {
    conversations: UserAndConversation[];
    selectedConversation: UserAndConversation | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>; //za sad je ne koristim ali mislim da ce mi trebati kad budem sokete dodao
    addConversation: (targetEmail: string, creatorId: number) => Promise<void>;
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

    const addConversation = async (targetEmail: string, creatorId: number) => {
          
    if (!targetEmail.trim()) return;
    

    try {
        const response = await api.post('/conversation/create', {
            user_id1: creatorId,
            user_email: targetEmail
        });
        console.log("Conversation created:", response.data);

         const newConv: UserAndConversation = {
      user: response.data.other_user,
      conversation: response.data.conversation,
    };
fetchConversations();
    return newConv;
         
    } catch (err: any) {  
        console.error('Error adding conversation:', err);
            setError(err.message);
    }
};

    const updateConversation = async (id: number, updates: Partial<Conversation>) => {
    try {
        const response = await api.put<Conversation>(`/conversations/${id}`, updates);
        fetchConversations();
        return response.data; 
    } catch (error: any) {
        console.error('Failed to update conversation:', error);
        throw error;
    }
};

  const deleteConversation = async (id: number) => {
    try {
         
     const response =   await api.delete(`/conversations/${id}`);
           if (response.data?.error) {
            throw new Error(response.data.error);
        }
         
      //  setConversations(prev => prev.filter(conv => conv.conversation.id !== id));
fetchConversations();
        
        if (selectedConversation?.conversation.id === id) {
            setSelectedConversation(null);
        }
    } catch (error:any) {
        console.error('Failed to delete conversation:', error);
    }
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
