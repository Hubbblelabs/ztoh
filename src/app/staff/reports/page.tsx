'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Mail, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

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
    useSetPageTitle('Monthly Reports', 'View your generated monthly teaching reports');

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
            <div className="space-y-6">
                {/* Reports Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-lg shadow-sm border border-border p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="h-12 w-12 rounded-md" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-36" />
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="space-y-1">
                                        <Skeleton className="h-10 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <Skeleton className="h-4 w-32 mb-3" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-16" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Reports */}
            {reports.length > 0 ? (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div key={report._id} className="bg-card rounded-lg shadow-sm border border-border p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-md">
                                        <Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">
                                            {MONTH_NAMES[report.month - 1]} {report.year}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {formatDate(report.startDate)} - {formatDate(report.endDate)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Generated: {formatDate(report.generatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-center lg:text-right">
                                        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                                            {report.totalHours.toFixed(1)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">total hours</p>
                                    </div>
                                </div>
                            </div>

                            {report.subjectBreakdown && report.subjectBreakdown.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-border">
                                    <h4 className="text-sm font-semibold text-muted-foreground mb-3">Subject Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {report.subjectBreakdown.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                                            >
                                                <div>
                                                    <p className="font-medium text-foreground">{item.subject}</p>
                                                    {item.course && (
                                                        <p className="text-xs text-muted-foreground">{item.course}</p>
                                                    )}
                                                </div>
                                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
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
                <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h3>
                    <p className="text-muted-foreground">
                        Monthly reports are generated automatically at the end of each month.
                    </p>
                </div>
            )}
        </div>
    );
}
