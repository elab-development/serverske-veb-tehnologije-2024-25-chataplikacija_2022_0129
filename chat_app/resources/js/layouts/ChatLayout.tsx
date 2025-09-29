import { ReactNode, useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { dashboard } from "@/routes";
import { type User, type NavItem } from "@/types";

 
 

import AppSidebarLayout from "./app/app-sidebar-layout";
import { AppShell } from "@/components/app-shell";
import { AppSidebar } from "@/components/app-sidebar";
 import echo from '../bootstrap';
import Echo from "laravel-echo";
 
 
interface ChatLayoutProps {
    children: ReactNode;
}
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        
    },
];
  

export default function ChatLayout({ children  }: ChatLayoutProps) {
    const page = usePage();
    const user: User = page.props.auth.user;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState(conversations);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers,setOnlineUsers] = useState({});
    const isUserOnline = (userId) => onlineUsers[userId];
    console.log("conversations",conversations);
    console.log("selectedConversation",selectedConversation);

useEffect(()=>{setSortedConversations(
localConversations.sort((a,b)=>{if(a.last_message_date && b.last_message_date){return b.last_message_date.localCompare(a.last_message_date);}else if (a.last_message_date){return -1;}else if (b.last_message_date){return 1;}else{return 0;}})
);
},[localConversations]);

    useEffect(()=>{setLocalConversations(conversations);},[conversations]);

useEffect(() => {
  const channel = echo.join("online")
    .here((users) => {
      const onlineUsersObj = Object.fromEntries(
        users.map((user) => [user.id, user])
      );
      setOnlineUsers(onlineUsersObj);
    })
    .joining((user) => {
      setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
    })
    .leaving((user) => {
      setOnlineUsers((prev) => {
        const updated = { ...prev };
        delete updated[user.id];
        return updated;
      });
    })
    .error((error) => {
      console.error("error", error);
    });

  return () => {
    echo.leave("online");
  };
}, []);
const formattedConversations = localConversations.map((conv: any) => ({
  name: conv.name || `Chat ${conv.id}`, // fallback if no name
  lastMessage: conv.last_message?.content || undefined,
}));

      return (
           <AppShell variant="sidebar">
               <AppSidebar />
                <div className="flex flex-col w-full">
    
     

     
    {children}
  </div>
           </AppShell>
       );
}