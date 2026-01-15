'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '@/app/admin/auth-context'; // Reusing context
import { PageHeaderProvider, usePageHeader } from '@/contexts/PageHeaderContext';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    LayoutDashboard,
    Clock,
    FileText,
    LogOut,
    User,
} from 'lucide-react';
import Loader from '@/components/ui/Loader';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

const staffNavGroups = [
    {
        label: "Menu",
        items: [
            { href: '/staff', icon: LayoutDashboard, label: 'Dashboard', exact: true },
            { href: '/staff/hours', icon: Clock, label: 'My Hours' },
            { href: '/staff/groups', icon: User, label: 'Groups' },
            { href: '/staff/reports', icon: FileText, label: 'Reports' },
        ]
    }
];

function StaffLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const { title, subtitle } = usePageHeader();
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (!loading && session?.user?.role !== 'staff') {
            // Redirect if not staff. 
            // Note: AuthProvider handles unauthenticated. 
            // We handle role mismatch here.
            // If user is admin, maybe allowed? Usually strictly separated.
            if (session?.user) router.push('/login');
        }
    }, [loading, session, router]);

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!user || session?.user?.role !== 'staff') return null;



    return (
        <SidebarProvider>
            <AppSidebar navGroups={staffNavGroups} user={user} title="Staff Portal" />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {/* Page Title */}
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>

                    <div className="flex-1" />
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 outline-none hover:bg-accent hover:text-accent-foreground p-2 rounded-md transition-colors">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="" alt={user.name} />
                                    <AvatarFallback className="rounded-lg bg-sky-600 text-white font-bold">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight max-w-[100px] lg:max-w-none">
                                    <span className="truncate font-semibold">{user.name}</span>
                                    <span className="truncate text-xs text-muted-foreground">Staff</span>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 admin-theme border border-border" align="end" sideOffset={4}>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="" />
                                        <AvatarFallback className="rounded-lg bg-sky-600 text-white font-bold">
                                            {user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ChangePasswordDialog userEmail={user.email} apiEndpoint="/api/staff/change-password" />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <div className="flex-1 flex flex-col p-4">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" storageKey="dashboard-theme" enableSystem={true} disableTransitionOnChange>
            <div className="admin-theme min-h-screen bg-background text-foreground">
                <AuthProvider>
                    <PageHeaderProvider>
                        <StaffLayoutContent>{children}</StaffLayoutContent>
                    </PageHeaderProvider>
                </AuthProvider>
            </div>
        </ThemeProvider>
    );
}
