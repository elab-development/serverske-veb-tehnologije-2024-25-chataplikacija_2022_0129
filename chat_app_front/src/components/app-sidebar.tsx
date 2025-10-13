import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar';
import { UserAndConversation, type Conversation, type NavItem } from '../types';
import { CircleUserRound, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useAuth } from '../context/auth-provider';

export function AppSidebar() {
    const { user } = useAuth();
    const { conversations, loading, error } = useConversations();
    const [localConversations, setLocalConversations] = useState<UserAndConversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<UserAndConversation[]>([]);
    
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        setSortedConversations(
            [...localConversations].sort((a, b) => {
                if (a.user.is_blocked !== b.user.is_blocked) {
                    return a.user.is_blocked ? 1 : -1;
                }

                if (!a.conversation && !b.conversation) {
                    return 0;
                } else if (!a.conversation) {
                    return 1;
                } else if (!b.conversation) {
                    return -1;
                }

                if (a.conversation.updated_at && b.conversation.updated_at) {
                    return b.conversation.updated_at.localeCompare(a.conversation.updated_at);
                } else if (a.conversation.updated_at) {
                    return -1;
                } else if (b.conversation.updated_at) {
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
            const filteredConversations = conversations.filter(
                (conv) => 
                    conv.conversation.name?.toLowerCase().includes(search.toLowerCase()) || 
                    conv.user.name.toLowerCase().includes(search.toLowerCase())
                );
            setLocalConversations(filteredConversations);
        } else {
            setLocalConversations(conversations);
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
                    {!user?.is_admin && <SquarePen/>}{ /*NAPRAVI OD OVOGA BUTTON ZA DODAVANJE NOVE KONVERZACIJE - dodati onClick za SquarePen koji poziva funkciju koja ce da otvori novu komponentu sa listom usera - u toj komponenti se bira user i za izabranog pokrece metoda addConversation iz conversations providera.tsx context-a, zatim zatvoriti tu komponentu (umesto komponente moze da se otvori i novi page preko navigate(/new-conversation) ali je elegantnije imati plutajucu komponentu za to) */}
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
