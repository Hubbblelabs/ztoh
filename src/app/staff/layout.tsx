'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Clock,
    FileText,
    LogOut,
    Key,
    GraduationCap,
    User,
    ChevronDown
} from 'lucide-react';
import Loader from '@/components/ui/Loader';

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
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const loading = status === 'loading';
    const isAuthenticated = status === 'authenticated';

    const staff = session?.user ? {
        _id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        subjects: []
    } : null;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'staff') {
            router.push('/admin');
        }
    }, [status, session, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (dropdownOpen && !target.closest('.user-dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    if (loading) {
        return <Loader fullScreen />;
    }

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const navItems = [
        { href: '/staff', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { href: '/staff/hours', icon: Clock, label: 'My Hours' },
        { href: '/staff/groups', icon: User, label: 'Groups' },
        { href: '/staff/reports', icon: FileText, label: 'Reports' },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">Zero to Hero</span>
                                <span className="hidden sm:block text-slate-400 text-xs">Staff Portal</span>
                            </div>
                        </div>

                        {/* Navigation Links - Desktop */}
                        <nav className="hidden md:flex items-center gap-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive(item.href, item.exact)
                                            ? 'bg-slate-800 text-sky-400 shadow-md'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* User Menu */}
                        <div className="relative user-dropdown">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-white text-sm font-medium truncate max-w-32">
                                        {staff?.name || 'Staff'}
                                    </p>
                                </div>
                                <ChevronDown size={16} className={`text-white transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-slate-900 font-medium truncate">{staff?.name}</p>
                                        <p className="text-slate-500 text-sm truncate">{staff?.email}</p>
                                        <span className="inline-block mt-2 px-2 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded">
                                            Staff Member
                                        </span>
                                    </div>

                                    {/* Mobile Navigation */}
                                    <div className="md:hidden border-b border-slate-100">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setDropdownOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${isActive(item.href, item.exact) ? 'bg-sky-50 text-sky-700' : 'text-slate-700'
                                                    }`}
                                            >
                                                <item.icon size={18} />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="p-2">
                                        <Link
                                            href="/staff/password"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                        >
                                            <Key size={18} />
                                            <span className="font-medium">Change Password</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
                {isAuthenticated ? children : (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
                    </div>
                )}
            </main>
        </div>
    );
}
