import { useEffect } from 'react';
import echo from '../echo';
import { useAuth } from '../context/auth-provider';
import toast from 'react-hot-toast';
import { useConversations } from '../context/conversations-provider';

export function useNotifications() {
    const { user } = useAuth();
    const userId = user?.id;
    const {refetch} = useConversations();

    useEffect(() => {
        if (!userId) return;

        const channel = echo.private(`user.${userId}`);

        channel.listen('.message.sent', (e: any) => {
        
        toast.custom((t) => (
            <div className="toast toast-top toast-center">
                <div className="alert alert-info">
                    <span>New mail from {e.sender.name}.</span>
                </div>
            </div>
        ), {duration: 4000});
        
        refetch();
        });

        return () => {
            echo.leave(`user.${userId}`);
        };
    }, [userId]);
}
