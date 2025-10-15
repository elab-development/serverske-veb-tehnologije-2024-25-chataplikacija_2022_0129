import ChatLayout from '../layouts/ChatLayout';
import { useEffect, useState } from 'react';
import AppLayout from '../layouts/app-layout';
import { useConversations } from '../context/conversations-provider';
import { useParams } from 'react-router-dom';
import { useIsUserOnline } from '../context/is-user-online-provider';
import { useNotifications } from '../hooks/use-notifications';

export default function Home() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const { 
        selectConversation,
        selectConversationById,
        conversations
    } = useConversations();
    useIsUserOnline();
    useNotifications();

    useEffect(() => {
        if (conversationId) {
            selectConversationById(Number(conversationId));
        }
        else {
            selectConversation(null);
        }
    }, [conversationId, conversations]);

    return (
        <AppLayout>
            <ChatLayout></ChatLayout>
        </AppLayout>
    )
}
