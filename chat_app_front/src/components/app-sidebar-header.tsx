import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { User } from '../types';
import { useAuth } from '../context/auth-provider';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';

export function AppSidebarHeader() {
    const { isMobile } = useSidebar();
    const { selectedConversation, getOtherUser } = useConversations();
    const [otherUser, setOtherUser] = useState<User | null>(null);

    useEffect(() => {
        if (!selectedConversation) return;
        setOtherUser(getOtherUser(selectedConversation));
    }, [selectedConversation]);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger className="-ml-1" />}
                {selectedConversation?.name ? (
                    <h1 className="text-lg font-semibold">{selectedConversation.name}</h1>
                ) : (
                    <h1 className="text-lg font-semibold">{otherUser?.name}</h1>
                )}
            </div>
        </header>
    );
}
