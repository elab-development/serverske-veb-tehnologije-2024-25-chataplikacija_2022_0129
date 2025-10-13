import { useEffect, useRef, useState } from 'react';
import { Message, User, type Conversation } from '../types';
import { useConversations } from '../context/conversations-provider';
import api from '../api';
import { useAuth } from '../context/auth-provider';
import echo from '../echo';

export default function ChatLayout() {
    const { user } = useAuth();
    const {selectedConversation, getOtherUser} = useConversations();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
            scrollToBottom();
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


    useEffect(() => {
        if (!selectedConversation) {
            setLoading(false);
            return;
        }

        console.log(selectedConversation?.conversation.id);
        const channel = echo.join(`conversation.${selectedConversation?.conversation.id}`);

        channel.listen('.message.sent', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            echo.leave(`conversation.${selectedConversation?.conversation.id}`);
        };
    }, [selectedConversation]);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedConversation) {
            return;
        }
        
        if(!newMessage.trim()) {
            return;
        }

        setLoading(true);

        try{
            const response = await api.post<Message>('/send-message?receiver_id=' + selectedConversation.user.id + '&content=' + newMessage);

            setMessages((prevMessages) => [...prevMessages, response.data]);
            setNewMessage('');
            scrollToBottom();
        } catch (err: any) {
            console.error('Error sending message:', err);
            alert("Greska pri slanju poruke: " + err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('sr-RS', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <div className="flex flex-col flex-1 overflow-hidden p-2">
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {messages.length === 0 && !loading && <div>No messages yet</div>}
            {messages.map((message, index) => (
                <div key={index} className={`chat chat-${message.sender.id === user?.id ? 'end' : 'start'}`}>
                    <div className="chat-header">
                        {message.sender.name}
                        <time className="text-xs opacity-50">{formatTime(message.created_at)}</time>
                    </div>
                    <div className="chat-bubble chat-bubble-info p-4 mb-2 max-w-150">
                        {message.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
