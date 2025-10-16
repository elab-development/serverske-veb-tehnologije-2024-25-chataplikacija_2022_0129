import React from 'react'
import { type Message } from '../types'
import { useAuth } from '../context/auth-provider';
import clsx from 'clsx';

interface MessageProps {
    message: Message
}

const MessageComponent = (prop: MessageProps) => {
    const { user } = useAuth();

    

    // Add safety check
    if (!prop.message || !prop.message.sender || !user) {
        console.error('Missing data:', { message: prop.message, user });
        return null;
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const marginClass = prop.message.sender.id === user?.id ? 'ml-20' : 'mr-20';
    const positionClass = prop.message.sender.id === user?.id ? 'chat-end' : 'chat-start';

    return (
        <div className={clsx('chat', positionClass, marginClass)}>
            <div className="chat-header">
                {prop.message.sender.name}
                <time className="text-xs opacity-50">{formatTime(prop.message.created_at)}</time>
            </div>
            <div className="chat-bubble chat-bubble-info p-4 mb-2 max-w-150">
                {prop.message.content}
            </div>
        </div>
    )
}

export default MessageComponent