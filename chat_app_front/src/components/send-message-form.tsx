import React, { useRef, useState } from 'react'
import { ImageIcon, Plus, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { useConversations } from '../context/conversations-provider';
import api from '../api';
import { Message } from '../types';
import { GiphyGif } from '../services/giphy-service';
import { Button } from './ui/button';
import GiphyPicker from './giphy-picker';

const SendMessageForm = () => {
    const {selectedConversation, refetch} = useConversations();
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    //const [selectedGif, setSelectedGif] = useState<GiphyGif | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showGiphyPicker, setShowGiphyPicker] = useState(false);

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

    const handleGifSelect = async (gif: GiphyGif) => {
        if (!selectedConversation) {
            return;
        }

        setShowGiphyPicker(false);

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('receiver_id', selectedConversation.user.id.toString());
            formData.append('gif_url', gif.images.original.url);

            await api.post<Message>('/send-message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            await refetch();
        } catch (err: any) {
            console.error('Error sending GIF:', err);
            toast.error("Greška pri slanju GIF-a: " + err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedConversation) {
            return;
        }
        
        if(!newMessage.trim() && selectedFiles.length === 0) {
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
    <>
        <form onSubmit={sendMessage} className="flex items-center mt-4 flex-shrink-0 justify-between bg-base ">
            <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowGiphyPicker(true)}
                    disabled={loading}
                    title='Send GIF'
                >
                <ImageIcon className="h-4 w-4" />
            </Button>
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

            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." className="input input-ghost flex-grow" disabled={loading}/>
            
            <button type="submit" className="btn btn-ghost" disabled={loading}> <Send /> </button>
        </form>
        <GiphyPicker
            open={showGiphyPicker}
            onClose={() => setShowGiphyPicker(false)}
            onSelect={handleGifSelect}
            sending={loading}
        />
    </>
  )
}

export default SendMessageForm