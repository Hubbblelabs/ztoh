'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    UserPlus,
    MessageSquare,
    Users,
    Clock,
    FileText,
    ArrowUpRight,
    TrendingUp,
    Calendar
} from 'lucide-react';

interface DashboardStats {
    joinRequests: number;
    contactRequests: number;
    totalStaff: number;
    totalHoursThisMonth: number;
    reportsGenerated: number;
}

export default function AdminDashboard() {
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
            color: 'from-sky-500 to-sky-600',
            bgColor: 'bg-sky-50',
            textColor: 'text-sky-600'
        },
        {
            title: 'Contact Requests',
            value: stats.contactRequests,
            icon: MessageSquare,
            href: '/admin/contacts',
            color: 'from-amber-500 to-amber-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        },
        {
            title: 'Staff Members',
            value: stats.totalStaff,
            icon: Users,
            href: '/admin/staff',
            color: 'from-slate-700 to-slate-800',
            bgColor: 'bg-slate-100',
            textColor: 'text-slate-700'
        },
        {
            title: 'Hours This Month',
            value: stats.totalHoursThisMonth,
            icon: Clock,
            href: '/admin/hours',
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        }
    ];

    const quickLinks = [
        { title: 'View Join Requests', href: '/admin/requests', icon: UserPlus },
        { title: 'Manage Staff', href: '/admin/staff', icon: Users },
        { title: 'Teaching Hours', href: '/admin/hours', icon: Clock },
        { title: 'Monthly Reports', href: '/admin/reports', icon: FileText },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Welcome back! Here&apos;s an overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900">
                                {loading ? (
                                    <span className="inline-block w-12 h-8 bg-slate-200 rounded animate-pulse" />
                                ) : (
                                    card.value
                                )}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">{card.title}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Links */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {quickLinks.map((link) => (
                            <Link
                                key={link.title}
                                href={link.href}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <link.icon className="w-5 h-5 text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-700 group-hover:text-slate-900">{link.title}</span>
                                <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Overview</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <TrendingUp className="w-6 h-6 text-sky-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Staff Management</p>
                                <p className="text-sm text-slate-500">
                                    {stats.totalStaff} active staff members
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Monthly Reports</p>
                                <p className="text-sm text-slate-500">
                                    Automated at month end
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <MessageSquare className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">Pending Requests</p>
                                <p className="text-sm text-slate-500">
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
