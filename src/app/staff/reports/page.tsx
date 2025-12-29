'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Mail, Calendar } from 'lucide-react';
import Loader from '@/components/ui/Loader';

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

export default function StaffReportsPage() {
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
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
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Monthly Reports</h1>
                    <p className="text-slate-500">View your generated monthly teaching reports</p>
                </div>
            </div>

            {/* Reports */}
            {reports.length > 0 ? (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                                        <Calendar className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            {MONTH_NAMES[report.month - 1]} {report.year}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {formatDate(report.startDate)} - {formatDate(report.endDate)}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Generated: {formatDate(report.generatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center lg:text-right">
                                        <p className="text-4xl font-bold text-emerald-600">
                                            {report.totalHours.toFixed(1)}
                                        </p>
                                        <p className="text-sm text-slate-500">total hours</p>
                                    </div>
                                    {report.emailSentAt && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-green-700">Email sent</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {report.subjectBreakdown && report.subjectBreakdown.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <h4 className="text-sm font-semibold text-slate-600 mb-3">Subject Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {report.subjectBreakdown.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{item.subject}</p>
                                                    {item.course && (
                                                        <p className="text-xs text-slate-500">{item.course}</p>
                                                    )}
                                                </div>
                                                <span className="text-lg font-bold text-emerald-600">
                                                    {item.hours.toFixed(1)}h
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Reports Yet</h3>
                    <p className="text-slate-500">
                        Monthly reports are generated automatically at the end of each month.
                    </p>
                </div>
            )}
        </div>
    );
}
