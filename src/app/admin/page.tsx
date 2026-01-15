'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import {
    UserPlus,
    MessageSquare,
    Users,
    Clock,
    FileText,
    ArrowUpRight,
    TrendingUp,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
    joinRequests: number;
    contactRequests: number;
    totalStaff: number;
    totalHoursThisMonth: number;
    reportsGenerated: number;
}

export default function AdminDashboard() {
    useSetPageTitle('Dashboard', 'Welcome back! Here\'s an overview of your platform.');

    const [stats, setStats] = useState<DashboardStats>({
        joinRequests: 0,
        contactRequests: 0,
        totalStaff: 0,
        totalHoursThisMonth: 0,
        reportsGenerated: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch various stats
                const [requestsRes, staffRes] = await Promise.all([
                    fetch('/api/admin/requests'),
                    fetch('/api/admin/staff')
                ]);

                let joinCount = 0, contactCount = 0, staffCount = 0;

                if (requestsRes.ok) {
                    const data = await requestsRes.json();
                    joinCount = data.join?.length || 0;
                    contactCount = data.contact?.length || 0;
                }

                if (staffRes.ok) {
                    const data = await staffRes.json();
                    staffCount = data.staff?.length || 0;
                }

                setStats({
                    joinRequests: joinCount,
                    contactRequests: contactCount,
                    totalStaff: staffCount,
                    totalHoursThisMonth: 0,
                    reportsGenerated: 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Join Requests',
            value: stats.joinRequests,
            icon: UserPlus,
            href: '/admin/requests',
            color: 'text-sky-500',
            bgColor: 'bg-sky-100 dark:bg-sky-900/20',
            textColor: 'text-sky-600 dark:text-sky-400'
        },
        {
            title: 'Contact Requests',
            value: stats.contactRequests,
            icon: MessageSquare,
            href: '/admin/contacts',
            color: 'text-amber-500',
            bgColor: 'bg-amber-100 dark:bg-amber-900/20',
            textColor: 'text-amber-600 dark:text-amber-400'
        },
        {
            title: 'Staff Members',
            value: stats.totalStaff,
            icon: Users,
            href: '/admin/staff',
            color: 'text-slate-500',
            bgColor: 'bg-slate-100 dark:bg-slate-800',
            textColor: 'text-slate-700 dark:text-slate-300'
        },
        {
            title: 'Hours This Month',
            value: stats.totalHoursThisMonth,
            icon: Clock,
            href: '/admin/hours',
            color: 'text-orange-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/20',
            textColor: 'text-orange-600 dark:text-orange-400'
        }
    ];

    const quickLinks = [
        { title: 'View Join Requests', href: '/admin/requests', icon: UserPlus },
        { title: 'Manage Staff', href: '/admin/staff', icon: Users },
        { title: 'Teaching Hours', href: '/admin/hours', icon: Clock },
        { title: 'Monthly Reports', href: '/admin/reports', icon: FileText },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card rounded-md p-6 shadow-sm border border-border">
                            <div className="flex items-start justify-between mb-4">
                                <Skeleton className="h-12 w-12 rounded-md" />
                                <Skeleton className="h-5 w-5" />
                            </div>
                            <div>
                                <Skeleton className="h-9 w-16 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions & Overview Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                                    <Skeleton className="h-9 w-9 rounded-md" />
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-4 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-card rounded-md p-6 shadow-sm border border-border">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                                    <Skeleton className="h-12 w-12 rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group bg-card rounded-md p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-md ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">
                                {card.value}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Links */}
                {/* Quick Links */}
                <div className="bg-card rounded-md p-6 shadow-sm border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all group border border-transparent hover:border-border"
                            >
                                <div className="p-2 bg-background rounded-md shadow-sm border border-border group-hover:border-primary/20">
                                    <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 group-hover:text-primary transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                {/* Recent Activity */}
                <div className="bg-card rounded-md p-6 shadow-sm border border-border">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Platform Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-sky-50/50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <TrendingUp className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Staff Management</p>
                                <p className="text-sm text-muted-foreground">
                                    {stats.totalStaff} active staff members
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Monthly Reports</p>
                                <p className="text-sm text-muted-foreground">
                                    Automated at month end
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-violet-50/50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800/30">
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <MessageSquare className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">Pending Requests</p>
                                <p className="text-sm text-muted-foreground">
                                    {stats.joinRequests + stats.contactRequests} total requests
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
