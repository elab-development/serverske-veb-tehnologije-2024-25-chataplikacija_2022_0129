import React, { useRef, useState } from 'react'
import { Plus, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useConversations } from '../context/conversations-provider';
import api from '../api';
import { Message } from '../types';

const SendMessageForm = () => {
    const {selectedConversation, refetch} = useConversations();
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} je veći od 10MB`);
                return false;
            }
            return true;
        });
        
        setSelectedFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedConversation) {
            return;
        }
        
        if(!newMessage.trim()) {
            return;
        }

        try{
            setLoading(true);

            const formData = new FormData();
            formData.append('receiver_id', selectedConversation.user.id.toString());
            if(newMessage.trim()) {
                formData.append('content', newMessage);
            }

            selectedFiles.forEach((file) => {
                formData.append('attachments[]', file);
            });

            await api.post<Message>('/send-message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setNewMessage('');
            setSelectedFiles([]);

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
        <form onSubmit={sendMessage} className="flex items-center mt-4 flex-shrink-0 justify-between bg-base ">
            <details className="dropdown dropdown-top">
                <summary className="btn m-1 btn-info btn-circle btn-sm"> <Plus /> </summary>
                <div tabIndex={0} className="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
                    {selectedFiles.length > 0 && (
                        <div className="mb-2 space-y-1">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="p-2 rounded flex items-center justify-between">
                                    <span className="text-sm truncate">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="btn btn-sm btn-ghost"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="card-body">
                        <input type="file" className="file-input" onChange={handleFileSelect} multiple/>
                    </div>
                </div>
            </details>

            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="input input-ghost flex-grow" disabled={loading} required/>
            
            <button type="submit" className="btn btn-ghost" disabled={loading}> <Send /> </button>
        </form>
  )
}

export default SendMessageForm