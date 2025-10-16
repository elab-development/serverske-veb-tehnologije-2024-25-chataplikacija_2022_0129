import React, {createContext, useContext, useEffect, useState} from "react";
import api from "../api";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User , ForgotPasswordRequest, ResetPasswordRequest, ForgotPasswordResponse, ResetPasswordResponse} from "../types";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
    user: User | null;
    loading: boolean
    register: (creditentials: RegisterCredentials) => Promise<AuthResponse>;
    login: (creditentials: LoginCredentials, remember?: boolean) => Promise<AuthResponse>;
    logout: () => void;
    forgotPassword: (data: ForgotPasswordRequest) => Promise<ForgotPasswordResponse>;
    resetPassword: (data: ResetPasswordRequest) => Promise<ResetPasswordResponse>;
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async(): Promise<void> => {
        const token = localStorage.getItem('token');
        const tokenExpiresAt = localStorage.getItem('token_expires_at');
        const savedUser = localStorage.getItem('user');

        if(!token){
            setLoading(false);
            return;
        }

        if(tokenExpiresAt){
            const expirationDate = new Date(tokenExpiresAt);
            if(expirationDate <= new Date()){
                logout();
                setLoading(false);
                return;
            }
        }

        if(savedUser){
            try{
                setUser(JSON.parse(savedUser));
                setLoading(false);

                const response = await api.get<User>('/user');
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                console.error('Failed to refresh data: ', error);
                setLoading(false);
            }
        } else {
            try{
                const response = await api.get<User>('/user');
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            } catch (error) {
                logout();
            } finally {
                setLoading(false);
            }

        }
    };

    const register = async (creditentials: RegisterCredentials): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/register', creditentials);
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('token_expires_at', response.data.expires_at);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    const login = async (creditentials: LoginCredentials, remember = false): Promise<AuthResponse> => {
        try {
            const response = await api.post<AuthResponse>('/login', {
                ...creditentials,
                remember,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('token_expires_at', response.data.expires_at);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed: ', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('token_expires_at');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        }
    };

    const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
        try {
            const response = await api.post<ForgotPasswordResponse>('/forgot-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        try {
            const response = await api.post<ResetPasswordResponse>('/reset-password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextProps = {
        user,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextProps {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}