import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar';
import { type Conversation, type NavItem } from '../types';
import { CircleUserRound, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';

export function AppSidebar() {
    const { conversations, loading, error, getOtherUser } = useConversations();
    const [localConversations, setLocalConversations] = useState<Conversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<Conversation[]>([]);
    
    const [search, setSearch] = useState('');
    
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


    useEffect(() => {
        if (search) {
            const filteredConversations = conversations.filter((conv) => conv.name.toLowerCase().includes(search.toLowerCase()) || getOtherUser(conv)?.name.toLowerCase().includes(search.toLowerCase()));
            setSortedConversations(filteredConversations);
        } else {
            setSortedConversations(conversations);
        }
    }, [search, conversations]);

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
                <SidebarGroupLabel style={{ justifyContent: "space-between"}}>
                    Conversations
                    <SquarePen/> { /*NAPRAVI OD OVOGA BUTTON ZA DODAVANJE NOVE KONVERZACIJE*/}
                </SidebarGroupLabel>
                <Input
                    id="search"
                    type="search"
                    name="search"
                    tabIndex={1}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
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
