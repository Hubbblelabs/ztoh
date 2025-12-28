'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Clock, 
    FileText, 
    LogOut, 
    Menu, 
    X, 
    Key,
    ChevronRight,
    GraduationCap
} from 'lucide-react';

interface StaffData {
    _id: string;
    name: string;
    email: string;
    subjects: string[];
}

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [staff, setStaff] = useState<StaffData | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    // Check if user is staff
                    if (data.role === 'staff') {
                        setStaff(data.user);
                        setIsAuthenticated(true);
                    } else {
                        // User is admin, redirect to admin
                        router.push('/admin');
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const navItems = [
        { href: '/staff', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { href: '/staff/hours', icon: Clock, label: 'My Hours' },
        { href: '/staff/reports', icon: FileText, label: 'Reports' },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu size={20} className="text-slate-600" />
                        </button>
                        <span className="text-lg font-bold text-slate-900">Staff Portal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                            Staff
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-teal-700 via-teal-700 to-teal-800 shadow-xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold text-white">Zero to Hero</span>
                                        <span className="block text-teal-200 text-xs">Staff Portal</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>

                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                            isActive(item.href, item.exact)
                                                ? 'bg-white text-teal-700 shadow-lg'
                                                : 'text-teal-100 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive(item.href, item.exact) && (
                                            <ChevronRight size={16} className="ml-auto" />
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-teal-600/50">
                            <div className="mb-4">
                                <p className="text-white font-medium truncate">{staff?.name}</p>
                                <p className="text-teal-200 text-sm truncate">{staff?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href="/staff/password"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                                >
                                    <Key size={14} />
                                    Password
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                                >
                                    <LogOut size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex flex-col flex-grow bg-gradient-to-b from-teal-700 via-teal-700 to-teal-800 overflow-y-auto">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-teal-600/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">Zero to Hero</span>
                                <span className="block text-teal-200 text-xs">Staff Portal</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive(item.href, item.exact)
                                        ? 'bg-white text-teal-700 shadow-lg'
                                        : 'text-teal-100 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.label}</span>
                                {isActive(item.href, item.exact) && (
                                    <ChevronRight size={16} className="ml-auto" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-teal-600/50">
                        <div className="p-4 bg-white/10 rounded-xl mb-3">
                            <p className="text-white font-medium truncate">{staff?.name || 'Loading...'}</p>
                            <p className="text-teal-200 text-sm truncate">{staff?.email || ''}</p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href="/staff/password"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                            >
                                <Key size={14} />
                                Password
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top header for desktop */}
                <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 items-center justify-end px-8 sticky top-0 z-30">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                        Staff Member
                    </span>
                </header>
                <main className="p-4 sm:px-6 lg:px-8 pt-20 lg:pt-6">
                    {isAuthenticated ? children : (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
