import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { Conversation, UserAndConversation, type NavItem } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { CircleUserRound, EllipsisVertical, Lock } from 'lucide-react';
import { useAuth } from '../context/auth-provider';
import UserOptionsDropdown from './user-options-dropdown';
import { Separator } from '@radix-ui/react-separator';
import clsx from 'clsx';

export function NavMain({ items = [] }: { items: UserAndConversation[] }) {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const { getOtherUser } = useConversations();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item, index) => (
                    <>
                    <SidebarMenuItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <SidebarMenuButton
                            asChild
                            isActive={location.pathname.startsWith("/conversations/" + item.conversation?.id)}
                            tooltip={{ children: item.user.id }}
                            className={clsx({
                                'pointer-events-none opacity-50 cursor-not-allowed': item.user.is_blocked,
                                'opacity-50': !item.conversation
                                })}
                        >
                            {!item.user.is_blocked ? (
                                <Link to={`/conversations/${item.conversation?.id}`} onClick={toggleSidebar}>
                                    <CircleUserRound />
                                    <span>{item.conversation?.name ? item.conversation.name : item.user.name}</span>
                                </Link>
                            ) : (
                                <span onClick={toggleSidebar}>
                                    <CircleUserRound />
                                    <span>{item.user.name}</span>
                                    {item.user.is_blocked ? <Lock /> : null}
                                </span>
                            )}
                            
                        </SidebarMenuButton>
                        {user?.is_admin ? (
                            <UserOptionsDropdown user={item.user}/>
                        )
                        : null}
                    </SidebarMenuItem>
                    <Separator />
                    </>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
