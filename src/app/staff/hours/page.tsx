'use client';

import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, Calendar, CalendarDays, BookOpen } from 'lucide-react';

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

export default function StaffHoursPage() {
    const [teachingData, setTeachingData] = useState<TeachingHoursData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hoursRes = await fetch('/api/staff/teaching-hours');
                if (hoursRes.ok) {
                    const hoursData = await hoursRes.json();
                    setTeachingData(hoursData);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Teaching Hours</h1>
                    <p className="text-slate-500">Track your teaching activity</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Today</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.daily.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Calendar className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">This Week</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.weekly.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <CalendarDays className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">This Month</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.monthly.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
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

            {/* All Teaching Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">All Teaching Hours</h2>
                </div>
                {teachingData?.records && teachingData.records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Course</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Description</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.records.map((record) => (
                                    <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-sm text-slate-900">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-900">{record.subject}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{record.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500 max-w-xs truncate">
                                            {record.description || '-'}
                                        </td>
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
