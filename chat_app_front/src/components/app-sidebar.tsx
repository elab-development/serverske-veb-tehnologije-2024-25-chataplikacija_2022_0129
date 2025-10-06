import { NavFooter } from '../components/nav-footer';
import { NavMain } from '../components/nav-main';
import { NavUser } from '../components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar';
import { type Conversation, type NavItem } from '../types';
import { CircleUserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerNavItems: NavItem[] = [
     
];

export function AppSidebar({ conversations = [] }: { conversations: Conversation[] }) {
    const mainNavItems: NavItem[] = conversations.map((conversation) => ({
        title: conversation.name,
        href: `/conversations/${conversation.id}`,
        icon: CircleUserRound
    }))
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to='/home'>
                                <div>ChatApp</div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
