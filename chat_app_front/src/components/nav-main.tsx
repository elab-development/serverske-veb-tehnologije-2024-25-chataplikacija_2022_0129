import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Conversation, type NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { CircleUserRound } from 'lucide-react';

export function NavMain({ items = [] }: { items: Conversation[] }) {
    const location = useLocation();
    const { getOtherUser } = useConversations();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Conversations</SidebarGroupLabel>
            {/*OVDE DODATI TEXT BOX ZA PRETRAGU*/}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                            asChild
                            isActive={location.pathname.startsWith("/conversations/" + item.id)}
                            tooltip={{ children: item.id }}
                        >
                            <Link to={`/conversations/${item.id}`} >
                                <CircleUserRound />
                                <span>{item.name ? item.name : getOtherUser(item)?.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
