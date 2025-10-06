import { SidebarProvider } from './ui/sidebar';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    const getInitialState = () => {
        const saved = localStorage.getItem('sidebar_open');
        return saved !== null ? JSON.parse(saved) : true;
    }

    return (
        <SidebarProvider
            defaultOpen={getInitialState()}
            onOpenChange={(open) => {
                localStorage.setItem('sidebar_open', JSON.stringify(open));
            }}
        >
            {children}
        </SidebarProvider>
    ) 
}