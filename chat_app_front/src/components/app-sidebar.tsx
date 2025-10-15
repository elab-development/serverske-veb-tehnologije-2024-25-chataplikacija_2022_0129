import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar';
import { UserAndConversation, type Conversation, type NavItem } from '../types';
import { CircleUserRound, SquarePen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from './ui/dialog';

import { useAuth } from '../context/auth-provider';
import { IsUserOnlineProvider } from '../context/is-user-online-provider';
import api from '../api'


export function AppSidebar() {
    const { user } = useAuth();
    const { conversations, loading, error, addConversation } = useConversations();
    const [localConversations, setLocalConversations] = useState<UserAndConversation[]>(conversations);
    const [sortedConversations, setSortedConversations] = useState<UserAndConversation[]>([]);
    const [open, setOpen] = useState(false);
    const [targetEmail, setTargetEmail] = useState(''); //Email za novu konverzaciju
    const [search, setSearch] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

const handleCreateConversation = async () => {
    if (!targetEmail.trim()) return;
    setCreating(true);
    setCreateError('');

    try {
        await addConversation(targetEmail, user.id);  
        setTargetEmail('');
        setOpen(false);
        setSearch('');
    } catch (err) {
        setCreateError('Email is invalid');
    } finally {
        setCreating(false);
    }
};



    useEffect(() => {
        console.log("Conversation sorting:",  [...localConversations]);
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
                    {!user?.is_admin && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost" title="New conversation">
                                    <SquarePen className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Conversation</DialogTitle>
                                </DialogHeader>
                                <Input
                                    placeholder="Enter Email..."
                                    value={targetEmail}
                                    onChange={(e) => setTargetEmail(e.target.value)}
                                />
                                <DialogFooter>
                                    <Button onClick={handleCreateConversation}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}{createError && (
    <div className="bg-red-100 text-red-800 px-3 py-2 rounded flex justify-between items-center mt-2">
        <span>{createError}</span>
        <button onClick={() => setCreateError('')} className="ml-2 font-bold">&times;</button>
    </div>
)}

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
