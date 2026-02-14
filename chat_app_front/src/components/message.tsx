import React, { useState } from 'react'
import { Attachment, type Message } from '../types'
import { useAuth } from '../context/auth-provider';
import clsx from 'clsx';
import api from '../api';
import AttachmentComponent from './attachment';

interface MessageProps {
    message: Message
}

const MessageComponent = (prop: MessageProps) => {
    const { user } = useAuth();
    const [attachments, setAttachments] = useState<Attachment[]>(prop.message.attachments);
    const [translating, setTranslating] = useState(false);
    const [displayText, setDisplayText] = useState(prop.message.content);
    const [isTranslated, setIsTranslated] = useState(false);
    const [translation, setTranslation] = useState<string | null>(null);

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const handleTranslate = async () => {
        if (isTranslated) {
            setDisplayText(prop.message.content);
            setIsTranslated(false);
            return;
        }

        if (translation) {
            setDisplayText(translation);
            setIsTranslated(true);
            return;
        }

        try {
            setTranslating(true);
            const response = await api.post('/messages/translate', { text: prop.message.content });
            setDisplayText(response.data.translated);
            setIsTranslated(true);
            setTranslation(response.data.translated);
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            setTranslating(false);
        }
    };

    const marginClass = prop.message.sender.id === user?.id ? 'ml-20' : 'mr-20';
    const positionClass = prop.message.sender.id === user?.id ? 'chat-end' : 'chat-start';

    return (
        <div className={clsx('chat', positionClass, marginClass)}>
            <div className="chat-header">
                {prop.message.sender.name}
                <time className="text-xs opacity-50">{formatTime(prop.message.created_at)}</time>
            </div>
            <div className="chat-bubble chat-bubble-info p-4 max-w-150">

                {prop.message.attachments && (
                    <ul className="list bg-base-200 rounded-box shadow-md">
                        {attachments.map((attachment) => {
                            if (attachment.is_giphy) {
                                console.log(attachment);
                                return(
                                    <li className="list-row">
                                        <img src={attachment.path} alt={attachment.name} />
                                    </li>
                                )
                            }
                            else {
                                return <AttachmentComponent key={attachment.id} attachment={attachment} />
                            }
                        })}
                    </ul>
                )}
                {translating ? 'Translating...' : displayText}

            </div>
            <div className="chat-footer opacity-50">
                <span onClick={handleTranslate} className="cursor-pointer">{isTranslated ? 'Original' : 'Translate'}</span>
            </div>
        </div>
    )
}

export default MessageComponent