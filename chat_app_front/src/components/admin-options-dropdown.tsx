import React from 'react'
import { User } from '../types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { EllipsisVertical, Lock, LockOpen, Trash, User2 } from 'lucide-react'
import { useMobileNavigation } from '../hooks/use-mobile-navigation'
import api from '../api'
import { useConversations } from '../context/conversations-provider'

const AdminOptionsDropdown = ({ user }: { user: User }) => {
    const cleanup = useMobileNavigation();
    const { refetch } = useConversations();

    const handleDelete = async() => {
        cleanup();
        try {
            const response = await api.delete(`/users/${user.id}/delete`);
            console.log(response); //za sad ovako, posle dodati notification
            refetch();
        } catch (error: any) {
            console.error(error);
        }
    }

    const handleBlock = async() => {
        cleanup();
        try {
            const response = await api.put(`/users/${user.id}/block`);
            console.log(response);
            refetch();
        } catch (error: any) {
            console.error(error);
        }
    }
    const handleUnblock = async() => {
        cleanup();
        try {
            const response = await api.put(`/users/${user.id}/unblock`);
            console.log(response);
            refetch();
        } catch (error: any) {
            console.error(error);
        }
    }
    const handleMakeAdmin = async() => {
        cleanup();
        try {
            const response = await api.put(`/users/${user.id}/make-admin`);
            console.log(response);
            refetch();
        } catch (error: any) {
            console.error(error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer hover:text-sidebar-accent-foreground">
                <EllipsisVertical  />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className='bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden border p-2 shadow-md'
                align="end"
                side="bottom"
            >
                <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 block w-full">
                    {user.is_blocked ? (
                            <button className="flex w-full" onClick={handleUnblock}>
                                <LockOpen className='mr-2'/>
                                <span>Unblock</span>
                            </button>
                        ) : (
                            <button className="flex w-full" onClick={handleBlock}>
                                <Lock className='mr-2'/>
                                <span>Block</span>
                            </button>
                        )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-border -mx-1 my-1 h-px'/>
                <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 block w-full">
                    <button className="flex w-full" onClick={handleDelete}>
                        <Trash className='mr-2'/>
                        <span>Delete User</span>
                    </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-border -mx-1 my-1 h-px'/>
                <DropdownMenuItem asChild className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive-foreground data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/40 data-[variant=destructive]:focus:text-destructive-foreground data-[variant=destructive]:*:[svg]:!text-destructive-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 block w-full">
                    {!user.is_admin ? (
                        <button className="flex w-full" onClick={handleMakeAdmin}>
                            <User2 className='mr-2'/>
                            <span>Make Admin</span>
                        </button>
                    ): null}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AdminOptionsDropdown