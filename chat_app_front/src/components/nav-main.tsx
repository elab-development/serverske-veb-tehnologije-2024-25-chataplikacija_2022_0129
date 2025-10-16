import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { UserAndConversation } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { Lock, ShieldUser } from 'lucide-react';
import { useAuth } from '../context/auth-provider';
import { Separator } from '@radix-ui/react-separator';
import clsx from 'clsx';
import AdminOptionsDropdown from './admin-options-dropdown';
import { useInitials } from '../hooks/use-initials';
import { useIsUserOnline } from '../context/is-user-online-provider';

export function NavMain({ items = [] }: { items: UserAndConversation[] }) {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const { addConversationForAdmin } = useConversations();
    const getInitials = useInitials();
    const { isUserOnline } = useIsUserOnline();

    const handleLinkClick = (item: UserAndConversation) => {
        toggleSidebar();
        if (!item.conversation) {
            addConversationForAdmin(item.user);
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
                                    <div className={`avatar avatar-${isUserOnline(item.user.id) ? 'online' : 'offline'} avatar-placeholder`}>
                                        <div className="rounded-full bg-neutral text-neutral-content w-8 dark:bg-neutral-300 dark:text-black">
                                            <span>{getInitials(item.user.name)}</span>
                                        </div>
                                    </div>
                                    <span className="font-small truncate dark:text-white">{item.conversation?.name ? item.conversation.name : item.user.name}</span>
                                    {item.user.is_admin ? <ShieldUser /> : null}
                                </button>
                            ) : (
                                <span onClick={toggleSidebar}>
                                    <div className={`avatar avatar-${isUserOnline(item.user.id) ? 'online' : 'offline'} avatar-placeholder`}>
                                        <div className="rounded-full bg-neutral text-neutral-content w-8 dark:bg-neutral-300 dark:text-black">
                                            <span>{getInitials(item.user.name)}</span>
                                        </div>
                                    </div>
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
