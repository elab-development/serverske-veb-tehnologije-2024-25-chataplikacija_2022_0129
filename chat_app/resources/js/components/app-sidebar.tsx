import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { CircleUserRound } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Pera & Zika',
        href: dashboard(), //iz index.ts -> ruta ka dashboard
        icon: CircleUserRound,
    },
];
//ovde pravi sta sve ide u sidebar

const footerNavItems: NavItem[] = [
     
];

export function AppSidebar({ conversations = [] }: { conversations: any[] }) {
    const conversationsForSidebar: NavItem[] = conversations.map((conversation) => ({
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
                            <Link href={dashboard()} prefetch>
                                <div>ChatApp</div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={conversationsForSidebar} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
