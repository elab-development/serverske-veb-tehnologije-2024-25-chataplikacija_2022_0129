import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../components/ui/dropdown-menu';
import { UserInfo } from '../components/user-info';
import { useMobileNavigation } from '../hooks/use-mobile-navigation';

//import { edit } from '@/routes/profile';
import { type User } from '../types';
import { LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/auth-provider';
import { Link, useNavigate } from 'react-router-dom';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async() => {
        cleanup();
        try {
            await logout();
            navigate('/login');
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link className="block w-full" to="/settings" onClick={cleanup}> {/* ovde je bila neka edit ruta, skapiraj sta je to */}
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <div className="block w-full" onClick={handleLogout} data-test="logout-button">
                    <LogOut className="mr-2" />
                    Log out
                </div>
            </DropdownMenuItem>
        </>
    );
}
