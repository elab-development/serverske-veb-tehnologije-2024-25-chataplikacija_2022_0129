import { type Conversation } from '../types';
import { AppShell } from '../components/app-shell';
import { AppSidebar } from '../components/app-sidebar';

export default function ChatLayout() {

    return (
        <AppShell variant="header">
            <AppSidebar/>
        </AppShell>
    );
}
