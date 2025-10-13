import ChatLayout from '../layouts/ChatLayout';
import { useEffect } from 'react';
import AppLayout from '../layouts/app-layout';
import { useConversations } from '../context/conversations-provider';
import { useParams } from 'react-router-dom';

export default function Home() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const { 
        selectConversation,
        selectConversationById,
        conversations
    } = useConversations();

    useEffect(() => {
        if (conversationId) {
            selectConversationById(Number(conversationId));
        }
        else {
            selectConversation(null);
        }
    }, [conversationId, conversations]);

    return (
        <>
            <AppLayout>
                <ChatLayout></ChatLayout>
            </AppLayout>
            
        </>
    )
}
