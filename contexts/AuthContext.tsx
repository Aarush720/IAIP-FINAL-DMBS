import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { User } from '../types';

export type Role = 'Student' | 'Faculty' | 'Admin';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const userData = await api.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session check failed", error);
                    sessionStorage.removeItem('token');
                }
            }
            setIsLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { token, user: userData } = await api.login(email, password);
            sessionStorage.setItem('token', token);
            setUser(userData);
            navigate('/home');
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Let the login page handle the error display
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // We can call the API to invalidate the session on the server,
        // but we don't need to wait for it to complete to log the user out on the client.
        api.logout().catch(error => {
            console.error("Logout failed on server:", error);
        });

        // Perform client-side logout immediately for a snappy user experience.
        sessionStorage.removeItem('token');
        setUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};