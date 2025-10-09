import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { Conversation, User, UserAndConversation, type NavItem } from '../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { CircleUserRound, EllipsisVertical, Lock, ShieldUser } from 'lucide-react';
import { useAuth } from '../context/auth-provider';
import { Separator } from '@radix-ui/react-separator';
import clsx from 'clsx';
import AdminOptionsDropdown from './admin-options-dropdown';

export function NavMain({ items = [] }: { items: UserAndConversation[] }) {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const { addConversation } = useConversations();

    const handleLinkClick = (item: UserAndConversation) => {
        toggleSidebar();
        if (!item.conversation) {
            addConversation(item.user);
        }
        else{
            navigate(`/conversations/${item.conversation.id}`);
        }
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item, index) => (
                    <div key={index}>
                    <SidebarMenuItem style={{ display: 'flex', alignItems: 'center' }}>
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
                                <button onClick={() => handleLinkClick(item)} style={{ cursor: 'pointer'}}>
                                    <CircleUserRound />
                                    <span>{item.conversation?.name ? item.conversation.name : item.user.name}</span>
                                    {item.user.is_admin ? <ShieldUser /> : null}
                                </button>
                            ) : (
                                <span onClick={toggleSidebar}>
                                    <CircleUserRound />
                                    <span>{item.user.name}</span>
                                    {item.user.is_blocked ? <Lock /> : null}
                                </span>
                            )}
                            
                        </SidebarMenuButton>
                        {user?.is_admin ? (
                            <AdminOptionsDropdown user={item.user}/>
                        )
                        : null}
                    </SidebarMenuItem>
                    <Separator />
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
