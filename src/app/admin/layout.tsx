'use client';

import React from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from './auth-context'; // Import from new file
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
    Users,
    UserPlus,
    MessageSquare,
    Clock,
    FileText,
    Settings,
    LogOut,
    GraduationCap,
    Shield,
    Star
} from 'lucide-react';

const adminNavGroups = [
    {
        label: "Overview",
        items: [
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        ]
    },
    {
        label: "Requests",
        items: [
            { href: '/admin/requests', icon: UserPlus, label: 'Join Requests' },
            { href: '/admin/contacts', icon: MessageSquare, label: 'Contact Requests' },
        ]
    },
    {
        label: "Management",
        items: [
            { href: '/admin/admins', icon: Shield, label: 'Admins' },
            { href: '/admin/staff', icon: Users, label: 'Staffs' },
            { href: '/admin/students', icon: GraduationCap, label: 'Students' },
            { href: '/admin/groups', icon: Users, label: 'Groups' },
        ]
    },
    {
        label: "Academic",
        items: [
            { href: '/admin/hours', icon: Clock, label: 'Teaching Hours' },
            { href: '/admin/reports', icon: FileText, label: 'Monthly Reports' },
        ]
    },
    {
        label: "System",
        items: [
            { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
            { href: '/admin/settings', icon: Settings, label: 'Settings' },
        ]
    }
];

import Loader from '@/components/ui/Loader';
import { ChangePasswordDialog } from '@/components/ChangePasswordDialog';

// Inner component to access useAuth context
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const { title, subtitle } = usePageHeader();

    if (loading) {
        return <Loader fullScreen />;
    }

    // Check if user exists to avoid flashing content before redirect? 
    // The AuthProvider handles redirect but we might want to return null if no user.
    if (!user) return null;

    return (
        <SidebarProvider>
            <AppSidebar navGroups={adminNavGroups} user={user} title="Zero to Hero" />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {/* Page Title */}
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                    </div>

                    {/* Spacer to push content to right */}
                    <div className="flex-1" />

                    {/* Theme Toggle */}
                    <ModeToggle />

                    {/* Profile Dropdown - Top Right */}
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
                                    <span className="truncate text-xs text-muted-foreground">Admin</span>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56 admin-theme border border-zinc-200 dark:border-zinc-700"
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="" alt={user.name} />
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
                            <ChangePasswordDialog userEmail={user.email} apiEndpoint="/api/admin/change-password" />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <div className="flex-1 flex flex-col p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min p-4">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="dashboard-theme"
            enableSystem={true}
            disableTransitionOnChange
        >
            <div className="admin-theme min-h-screen bg-background text-foreground">
                <AuthProvider>
                    <PageHeaderProvider>
                        <AdminLayoutContent>{children}</AdminLayoutContent>
                    </PageHeaderProvider>
                </AuthProvider>
            </div>
        </ThemeProvider>
    );
}
