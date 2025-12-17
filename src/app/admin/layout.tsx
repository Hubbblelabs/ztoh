'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <nav className="bg-white shadow-sm border-b border-slate-200 fixed w-full z-10 top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <span className="text-xl font-bold font-heading text-slate-900">Zero to Hero</span>
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow pt-24 pb-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
