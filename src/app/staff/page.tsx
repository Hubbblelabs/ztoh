'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Today',
            value: `${teachingData?.summary.daily.toFixed(1) || '0'} hrs`,
            icon: Clock,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            label: 'This Week',
            value: `${teachingData?.summary.weekly.toFixed(1) || '0'} hrs`,
            icon: Calendar,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            label: 'This Month',
            value: `${teachingData?.summary.monthly.toFixed(1) || '0'} hrs`,
            icon: CalendarDays,
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            label: 'Reports',
            value: reports.length.toString(),
            icon: FileText,
            color: 'amber',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
        },
    ];

    const latestReport = reports[0];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of your teaching activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                                <stat.icon className={stat.iconColor} size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Latest Report */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/staff/hours"
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">View Teaching Hours</p>
                                    <p className="text-sm text-slate-500">See your complete hours log</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </Link>
                        <Link
                            href="/staff/reports"
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">Monthly Reports</p>
                                    <p className="text-sm text-slate-500">View your generated reports</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </Link>
                    </div>
                </div>

                {/* Latest Report */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Latest Report</h2>
                        {latestReport && (
                            <Link 
                                href="/staff/reports" 
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                            >
                                View all <ArrowRight size={14} />
                            </Link>
                        )}
                    </div>
                    {latestReport ? (
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {MONTH_NAMES[latestReport.month - 1]} {latestReport.year}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        {formatDate(latestReport.startDate)} - {formatDate(latestReport.endDate)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-emerald-600">
                                        {latestReport.totalHours.toFixed(1)}
                                    </p>
                                    <p className="text-xs text-slate-500">hours</p>
                                </div>
                            </div>
                            {latestReport.subjectBreakdown && latestReport.subjectBreakdown.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {latestReport.subjectBreakdown.slice(0, 3).map((item, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/70 rounded-lg text-xs border border-emerald-200"
                                        >
                                            <span className="text-slate-700">{item.subject}</span>
                                            <span className="font-semibold text-emerald-600">{item.hours.toFixed(1)}h</span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-8 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No reports available yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Subject Breakdown */}
            {teachingData?.subjectBreakdown && teachingData.subjectBreakdown.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-violet-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">This Month by Subject</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.subjectBreakdown.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-sm text-slate-900">{item.subject}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{item.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600">{item.hours.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Teaching Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Recent Teaching Hours</h2>
                    </div>
                    <Link 
                        href="/staff/hours" 
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                        View all <ArrowRight size={14} />
                    </Link>
                </div>
                {teachingData?.records && teachingData.records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.records.slice(0, 5).map((record) => (
                                    <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-sm text-slate-900">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-900">{record.subject}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{record.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600">{record.hours.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No teaching hours recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
