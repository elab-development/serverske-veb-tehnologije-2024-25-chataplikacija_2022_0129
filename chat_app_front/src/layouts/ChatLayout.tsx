import { useEffect, useRef, useState } from 'react';
import { Message, User, type Conversation } from '../types';
import { useConversations } from '../context/conversations-provider';
import api from '../api';
import { useAuth } from '../context/auth-provider';
import echo from '../echo';
import MessageComponent from '../components/message';
import SendMessageForm from '../components/send-message-form';

export default function ChatLayout() {
    const { user } = useAuth();
    const {selectedConversation, refetch} = useConversations();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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


    useEffect(() => {
        if (!selectedConversation) {
            setLoading(false);
            return;
        }

        const channel = echo.join(`conversation.${selectedConversation?.conversation.id}`);

        channel.listen('.message.sent', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
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
            await api.post<Message>('/send-message?receiver_id=' + selectedConversation.user.id + '&content=' + newMessage);

            setNewMessage('');
            await refetch();
        } catch (err: any) {
            console.error('Error sending message:', err);
            alert("Greska pri slanju poruke: " + err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-2">
            {loading && <div><span className="loading loading-dots loading-lg"></span></div>}
            {error && <div>{error}</div>}
            {messages.length === 0 && !loading && <div>No messages yet</div>}

            <div className="flex-1 overflow-y-auto min-h-0">
                {messages.map((message, index) => (
                    <MessageComponent key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <SendMessageForm newMessage={newMessage} setNewMessage={setNewMessage} onSendMessage={sendMessage} loading={loading} />
        </div>
    );
}
