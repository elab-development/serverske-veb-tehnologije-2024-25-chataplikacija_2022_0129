import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from './ui/sidebar';
import { Conversation, User, UserAndConversation, type NavItem } from '../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useConversations } from '../context/conversations-provider';
import { CircleUserRound, EllipsisVertical, Lock, ShieldUser } from 'lucide-react';
import { useAuth } from '../context/auth-provider';
import { Separator } from '@radix-ui/react-separator';
import clsx from 'clsx';
import AdminOptionsDropdown from './admin-options-dropdown';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useInitials } from '../hooks/use-initials';
import { useEffect, useState } from 'react';
import echo from '../echo';

export function NavMain({ items = [] }: { items: UserAndConversation[] }) {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const { addConversation } = useConversations();
    const getInitials = useInitials();
    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const isUserOnline = (userId: number) => Boolean(onlineUsers[userId]);

    const handleLinkClick = (item: UserAndConversation) => {
        toggleSidebar();
        if (!item.conversation) {
            addConversation(item.user);
        }
        else{
            navigate(`/conversations/${item.conversation.id}`);
        }
    };

    useEffect(() => {
        const channel = echo
            .join('online')
            .here((users: User[]) => {
                const onlineUsersObj: Record<number, User> = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers(onlineUsersObj);
            })
            .joining((user: User) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user: User) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            })
            .error((error: any) => {
                console.error('error', error);
            });

        return () => {
            echo.leave('online');
        };
    }, []);

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
