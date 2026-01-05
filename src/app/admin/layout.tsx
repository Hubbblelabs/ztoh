'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Users,
    UserPlus,
    MessageSquare,
    Clock,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Shield,
    Star
} from 'lucide-react';
import Loader from '@/components/ui/Loader';

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

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/requests', icon: UserPlus, label: 'Join Requests' },
    { href: '/admin/contacts', icon: MessageSquare, label: 'Contact Requests' },
    { href: '/admin/staff', icon: Users, label: 'Staff Management' },
    { href: '/admin/groups', icon: Users, label: 'Groups' },
    { href: '/admin/hours', icon: Clock, label: 'Teaching Hours' },
    { href: '/admin/reports', icon: FileText, label: 'Monthly Reports' },
    { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { href: '/admin/students', icon: GraduationCap, label: 'Students' },
    { href: '/admin/admins', icon: Shield, label: 'Admins' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const loading = status === 'loading';

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/login');
        }
    }, [status, session, router]);

    const logout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const user = session?.user ? {
        _id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || ''
    } : null;

    const isActive = (href: string, exact = false) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            <div className="min-h-screen bg-slate-100 flex">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50
                    w-64 bg-slate-900 text-slate-400 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Logo */}
                    <div className="flex items-center justify-between w-full px-3 mt-3 h-16">
                        <Link href="/admin" className="flex items-center w-full px-3 gap-2">
                            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-slate-100">Zero to Hero</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="w-full px-2 flex-1 overflow-y-auto sidebar-scrollbar">
                        <div className="flex flex-col items-center w-full mt-3 border-t border-slate-800">
                            {navItems.map((item) => {
                                const active = isActive(item.href, item.exact);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            flex items-center w-full h-12 px-3 mt-2 rounded transition-colors
                                            ${active
                                                ? 'bg-slate-800 text-sky-400'
                                                : 'hover:bg-slate-800 hover:text-slate-100'
                                            }
                                        `}
                                    >
                                        <item.icon className="w-6 h-6 stroke-current" />
                                        <span className="ml-2 text-sm font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* User section */}
                    <div className="mt-auto w-full bg-slate-950 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center justify-between w-full h-16 px-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-slate-200 truncate">{user?.name}</span>
                                    <span className="text-xs text-slate-500 truncate">Admin</span>
                                </div>
                            </div>
                            <button onClick={logout} className="text-slate-400 hover:text-white">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
                    {/* Top header */}
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-4 ml-auto">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                Administrator
                            </span>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </AuthContext.Provider>
    );
}
