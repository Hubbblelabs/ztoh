'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    logout: async () => { }
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    // Derived state or just use session directly? 
    // The original code used useEffect to redirect.
    // We should keep the same logic.

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const logout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const user = session?.user ? {
        _id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || ''
    } : null;

    const loading = status === 'loading';

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
