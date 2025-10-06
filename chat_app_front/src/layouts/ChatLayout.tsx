import { type Conversation } from '../types';
import { AppShell } from '../components/app-shell';
import { AppSidebar } from '../components/app-sidebar';

export default function ChatLayout({ conversations = [] }: { conversations: Conversation[] }) {
    

    return (
        <AppShell variant="sidebar">
            <AppSidebar conversations={conversations}/>
            <div className="flex w-full flex-col"></div>
        </AppShell>
    );
}
