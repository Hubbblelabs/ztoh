'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import {
    Clock,
    Calendar,
    CalendarDays,
    TrendingUp,
    BookOpen,
    FileText,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TeachingHoursData {
    records: any[];
    summary: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    subjectBreakdown: {
        subject: string;
        course: string | null;
        hours: number;
    }[];
    dateRanges: {
        today: { start: string; end: string };
        week: { start: string; end: string };
        month: { start: string; end: string };
    };
}

interface MonthlyReport {
    _id: string;
    month: number;
    year: number;
    totalHours: number;
    subjectBreakdown: {
        subject: string;
        course?: string;
        hours: number;
    }[];
    startDate: string;
    endDate: string;
    generatedAt: string;
    emailSentAt?: string;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function StaffDashboard() {
    useSetPageTitle('Dashboard', 'Overview of your teaching activity');

    const [teachingData, setTeachingData] = useState<TeachingHoursData | null>(null);
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch teaching hours
                const hoursRes = await fetch('/api/staff/teaching-hours');
                if (hoursRes.ok) {
                    const hoursData = await hoursRes.json();
                    setTeachingData(hoursData);
                }

                // Fetch monthly reports
                const reportsRes = await fetch('/api/staff/reports');
                if (reportsRes.ok) {
                    const reportsData = await reportsRes.json();
                    setReports(reportsData.reports || []);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="space-y-8">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border">
                            <div className="flex items-center gap-4">
                                <Skeleton className="p-3 h-12 w-12 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-7 w-20" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions & Latest Report Skeleton */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-5 w-5" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <Skeleton className="h-6 w-28 mb-4" />
                        <div className="bg-muted/50 rounded-md p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-36" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <div className="text-right space-y-1">
                                    <Skeleton className="h-8 w-16" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-6 w-20" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Today',
            value: `${teachingData?.summary.daily.toFixed(1) || '0'} hrs`,
            icon: Clock,
            color: 'blue',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            label: 'This Week',
            value: `${teachingData?.summary.weekly.toFixed(1) || '0'} hrs`,
            icon: Calendar,
            color: 'purple',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            iconColor: 'text-purple-600 dark:text-purple-400',
        },
        {
            label: 'This Month',
            value: `${teachingData?.summary.monthly.toFixed(1) || '0'} hrs`,
            icon: CalendarDays,
            color: 'emerald',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            label: 'Reports',
            value: reports.length.toString(),
            icon: FileText,
            color: 'amber',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            iconColor: 'text-amber-600 dark:text-amber-400',
        },
    ];

    const latestReport = reports[0];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-card rounded-lg p-6 shadow-sm border border-border">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${stat.bgColor} rounded-md`}>
                                <stat.icon className={stat.iconColor} size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Latest Report */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                {/* Quick Actions */}
                <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/staff/hours"
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover:bg-muted transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">View Teaching Hours</p>
                                    <p className="text-sm text-muted-foreground">See your complete hours log</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                        <Link
                            href="/staff/reports"
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-md hover:bg-muted transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Monthly Reports</p>
                                    <p className="text-sm text-muted-foreground">View your generated reports</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Latest Report */}
                {/* Latest Report */}
                <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Latest Report</h2>
                        {latestReport && (
                            <Link
                                href="/staff/reports"
                                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
                            >
                                View all <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>
                    {latestReport ? (
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-md p-5 border border-emerald-100 dark:border-emerald-800/50">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {MONTH_NAMES[latestReport.month - 1]} {latestReport.year}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(latestReport.startDate)} - {formatDate(latestReport.endDate)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {latestReport.totalHours.toFixed(1)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">hours</p>
                                </div>
                            </div>
                            {latestReport.subjectBreakdown && latestReport.subjectBreakdown.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {latestReport.subjectBreakdown.slice(0, 3).map((item, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 dark:bg-black/20 rounded-lg text-xs border border-emerald-200 dark:border-emerald-800/50"
                                        >
                                            <span className="text-foreground">{item.subject}</span>
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.hours.toFixed(1)}h</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-muted/50 rounded-md p-8 text-center">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No reports available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject Breakdown */}
            {teachingData?.subjectBreakdown && teachingData.subjectBreakdown.length > 0 && (
                <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">This Month by Subject</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.subjectBreakdown.map((item, index) => (
                                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                                        <td className="py-3 px-4 text-sm text-foreground">{item.subject}</td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">{item.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.hours.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Teaching Hours */}
            {/* Recent Teaching Hours */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Recent Teaching Hours</h2>
                    </div>
                    <Link
                        href="/staff/hours"
                        className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                {teachingData?.records && teachingData.records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.records.slice(0, 5).map((record) => (
                                    <tr key={record._id} className="border-b border-border hover:bg-muted/50">
                                        <td className="py-3 px-4 text-sm text-foreground">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-foreground">{record.subject}</td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">{record.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{record.hours.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No teaching hours recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
