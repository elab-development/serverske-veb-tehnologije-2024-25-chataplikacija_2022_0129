import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar';
import { type Conversation, type NavItem } from '../types';
import { CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';

export function AppSidebar() {
    const { conversations, loading, error } = useConversations();
    const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);
    
    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
                if (a.updated_at && b.updated_at) {
                    return b.updated_at.localeCompare(a.updated_at);
                } else if (a.updated_at) {
                    return -1;
                } else if (b.updated_at) {
                    return 1;
                } else {
                    return 0;
                }
            }),
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to='/'>
                                <div>ChatApp</div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={sortedConversations} />
                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
            </SidebarContent>
            
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
