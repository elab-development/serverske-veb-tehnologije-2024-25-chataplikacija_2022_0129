import React, {createContext, useContext, useEffect, useState} from "react";
import { User } from "../types";
import echo from "../echo";

interface IsUserOnlineContextType {
    isUserOnline: (userId: number) => boolean;
}

const IsUserOnlineContext = createContext<IsUserOnlineContextType | null>(null);

export const IsUserOnlineProvider = ({ children }: { children: React.ReactNode }) => {
    const [onlineUsers, setOnlineUsers] = useState<Record<number, User>>({});
    const isUserOnline = (userId: number) => Boolean(onlineUsers[userId]);

    useEffect(() => {
        const channel = echo
            .join('online')
            .here((users: User[]) => {
                const onlineUsersObj: Record<number, User> = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers(onlineUsersObj);
            })
            .joining((user: User) => {
                setOnlineUsers((prev) => ({ ...prev, [user.id]: user }));
            })
            .leaving((user: User) => {
                setOnlineUsers((prev) => {
                    const updated = { ...prev };
                    delete updated[user.id];
                    return updated;
                });
            })
            .error((error: any) => {
                console.error('error', error);
            });

        return () => {
            echo.leave('online');
        };
    }, []);

    const value = {
        isUserOnline,
    };

    return (
        <IsUserOnlineContext.Provider value={value}>
            {children}
        </IsUserOnlineContext.Provider>
    );
};

export function useIsUserOnline() {
    const context = useContext(IsUserOnlineContext);
    if (!context) {
        throw new Error('useIsUserOnline must be used within a IsUserOnlineProvider');
    }
    return context;
}