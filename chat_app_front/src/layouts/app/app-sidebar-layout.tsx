import { AppContent } from '../../components/app-content';
import { AppShell } from '../../components/app-shell';
import { AppSidebar } from '../../components/app-sidebar';
import { AppSidebarHeader } from '../../components/app-sidebar-header';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children }: PropsWithChildren) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar/>
            <AppContent variant="sidebar" className="overflow-x-hidden h-screen flex flex-col">
                <AppSidebarHeader />
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
