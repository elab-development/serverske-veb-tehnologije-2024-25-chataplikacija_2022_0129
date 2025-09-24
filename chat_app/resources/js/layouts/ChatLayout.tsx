import { ReactNode, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { type User, type NavItem } from "@/types";

 
  
import AppSidebarLayout from "./app/app-sidebar-layout";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
 import echo from '../bootstrap';
 
 
interface ChatLayoutProps {
    children: ReactNode;
}
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        
    },
];
 // wherever your provider is defined

export default function ChatLayout({ children  }: ChatLayoutProps) {
    const page = usePage();
    const user: User = page.props.auth.user;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    console.log("conversations",conversations);
    console.log("selectedConversation",selectedConversation);

useEffect(()=>{
echo.join('online').here((users)=>{console.log('here',users)}).joining((user)=>{console.log('joining',user);}).leaving((user)=>{console.log('leaving',user);}).error((error)=>{console.error("error",error);})


},[])

      return (
           <AppShell variant="sidebar">
               <AppSidebar />
                {children}
           </AppShell>
       );
}