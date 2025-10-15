import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { User } from '../types';
import { useConversations } from '../context/conversations-provider';
import { useEffect, useState } from 'react';
import { EllipsisVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
  

export function AppSidebarHeader() {
    const { isMobile } = useSidebar();
    const { selectedConversation, deleteConversation, updateConversation  } = useConversations();
     const [isRenameOpen, setIsRenameOpen] = useState(false);
     const [newName, setNewName] = useState(''); //new name for convo
    const handleRename = () =>{}
    useEffect(() => {
        if (!selectedConversation) return;
    }, [selectedConversation]);

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4" style={{ justifyContent: 'space-between'}}>
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger className="-ml-1" />}
                {selectedConversation?.conversation?.name ? (
                    <h1 className="text-lg font-semibold">{selectedConversation.conversation.name}</h1>
                ) : (
                    <h1 className="text-lg font-semibold">{selectedConversation?.user.name}</h1>
                )}
            </div>
<<<<<<< HEAD
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-muted rounded-full transition">
                        <EllipsisVertical className="h-5 w-5" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={()=>deleteConversation((selectedConversation)? selectedConversation.conversation.id:-1)}
                        className="text-red-500 focus:text-red-500"
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Conversation</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Enter new name..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRenameOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
    if (!selectedConversation) return;
    updateConversation(selectedConversation.conversation.id, { name: newName });
    setIsRenameOpen(false);
}}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
=======
            <EllipsisVertical></EllipsisVertical> {/* DROPDOWN MENI ZA IZMENU KONVERZACIJE - slicno kao i za dodavanje konverzacije - da se otvori komponenta( ovde mozda moze da se iskoristi DropdownMenu iz @radix-ui - pogledati admin-options-dropdown da vidite kako se pravi - samo ce DropdownMenuTrigger biti ove tri tacke, a u DropdownMenuContent ce DropdownMenuItem biti neki input i dugme) na kojoj ima polje za upis imena konverzacije i dugme za potvrdu - kada se dugme pritisne poziva se metoda updateConversation iz conversations-provider.tsx context-a koju treba napisati (ona treba da poziva rutu api.put('/conversations/{conversationId}') i da ponovo fetchuje konverzacije - pogledati funkciju addConversation)*/}
>>>>>>> noviBranch
        </header>
    );
}
