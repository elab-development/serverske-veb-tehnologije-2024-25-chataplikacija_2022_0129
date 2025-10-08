import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { User } from '../types';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';

export function AppSidebarHeader() {
    const { isMobile } = useSidebar();
    const { selectedConversation } = useConversations();

    useEffect(() => {
        if (!selectedConversation) return;
    }, [selectedConversation]);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4" style={{ justifyContent: 'space-between'}}>
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger className="-ml-1" />}
                {selectedConversation?.conversation?.name ? (
                    <h1 className="text-lg font-semibold">{selectedConversation.conversation.name}</h1>
                ) : (
                    <h1 className="text-lg font-semibold">{selectedConversation?.user.name}</h1>
                )}
            </div>
            <EllipsisVertical></EllipsisVertical> {/* DROPDOWN MENI ZA IZMENU KONVERZACIJE*/}
        </header>
    );
}
