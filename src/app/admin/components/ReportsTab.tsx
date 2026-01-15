'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Mail, RefreshCw, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SubjectBreakdown {
    subject: string;
    course?: string;
    hours: number;
}

interface MonthlyReport {
    _id: string;
    staffId: {
        _id: string;
        name: string;
        email: string;
    };
    staffName: string;
    staffEmail: string;
    month: number;
    year: number;
    totalHours: number;
    subjectBreakdown: SubjectBreakdown[];
    startDate: string;
    endDate: string;
    generatedAt: string;
    emailSentAt?: string;
}

interface Staff {
    _id: string;
    name: string;
    email: string;
}

interface ReportsTabProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ReportsTab({ showToast }: ReportsTabProps) {
    const [reports, setReports] = useState<MonthlyReport[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    // Filters
    const [filterStaffId, setFilterStaffId] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [filterMonth, setFilterMonth] = useState('');

    // Generate modal
    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [generateMonth, setGenerateMonth] = useState(new Date().getMonth() || 12);
    const [generateYear, setGenerateYear] = useState(new Date().getFullYear());
    const [generateStaffId, setGenerateStaffId] = useState('');
    const [sendEmailsOnGenerate, setSendEmailsOnGenerate] = useState(true);

    const fetchReports = async () => {
        try {
            let url = `/api/admin/reports?page=${page}&limit=${limit}`;
            if (filterStaffId) url += `&staffId=${filterStaffId}`;
            if (filterYear) url += `&year=${filterYear}`;
            if (filterMonth) url += `&month=${filterMonth}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setReports(data.reports || []);
                setTotalPages(data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaff = async () => {
        try {
            const res = await fetch('/api/admin/staff');
            if (res.ok) {
                const data = await res.json();
                setStaff(data.staff || []);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        fetchReports();
    }, [page, filterStaffId, filterYear, filterMonth]);

    const handleGenerateReports = async () => {
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    month: generateMonth,
                    year: generateYear,
                    staffId: generateStaffId || undefined,
                    sendEmails: sendEmailsOnGenerate,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(data.message || 'Reports generated successfully', 'success');
                setShowGenerateModal(false);
                fetchReports();
            } else {
                showToast(data.error || 'Failed to generate reports', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleDeleteReport = async (reportId: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;

        try {
            const res = await fetch(`/api/admin/reports/${reportId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Report deleted successfully', 'success');
                fetchReports();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete report', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        setFilterStaffId('');
        setFilterYear('');
        setFilterMonth('');
        setPage(1);
    };

    // Generate year options (last 5 years)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <Skeleton className="h-10 flex-1 min-w-[150px]" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-36 ml-auto" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border-b border-border">
                            <Skeleton className="h-5 w-32" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-7 w-16" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Filters */}
            <div className="flex flex-wrap gap-4 items-end">
                <Select value={filterStaffId || 'all'} onValueChange={(value) => { setFilterStaffId(value === 'all' ? '' : value); setPage(1); }}>
                    <SelectTrigger className="w-[180px] h-9 rounded-md bg-card">
                        <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Staff:</span>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Staff</SelectItem>
                        {staff.map((s) => (
                            <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterYear || 'all'} onValueChange={(value) => { setFilterYear(value === 'all' ? '' : value); setPage(1); }}>
                    <SelectTrigger className="w-[160px] h-9 rounded-md bg-card">
                        <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Year:</span>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {yearOptions.map((y) => (
                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filterMonth || 'all'} onValueChange={(value) => { setFilterMonth(value === 'all' ? '' : value); setPage(1); }}>
                    <SelectTrigger className="w-[180px] h-9 rounded-md bg-card">
                        <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Month:</span>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {MONTH_NAMES.map((m, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {(filterStaffId || filterYear || filterMonth) && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Clear
                    </button>
                )}
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors ml-auto"
                >
                    <RefreshCw size={16} />
                    Generate Reports
                </button>
            </div>

            {/* Reports Table */}
            {reports.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Period</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Staff</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Total Hours</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Generated</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email Sent</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report._id} className="border-b border-border hover:bg-muted">
                                        <td className="py-3 px-4">
                                            <span className="font-medium text-foreground">
                                                {MONTH_NAMES[report.month - 1]} {report.year}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <span className="font-medium text-foreground">{report.staffName}</span>
                                                <p className="text-xs text-muted-foreground">{report.staffEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="font-bold text-lg text-primary">
                                                {report.totalHours.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">
                                            {formatDate(report.generatedAt)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {report.emailSentAt ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Mail size={12} />
                                                    {formatDate(report.emailSentAt)}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">Not sent</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteReport(report._id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No monthly reports found.</p>
                    <p className="text-sm mt-2">Click "Generate Reports" to create monthly reports for staff.</p>
                </div>
            )}

            {/* Generate Reports Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-border">
                            <h3 className="text-xl font-bold text-foreground">Generate Monthly Reports</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Generate teaching hours reports for the selected period.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Month</label>
                                    <Select value={generateMonth.toString()} onValueChange={(value) => setGenerateMonth(parseInt(value))}>
                                        <SelectTrigger className="w-full h-10 rounded-md">
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MONTH_NAMES.map((m, i) => (
                                                <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Year</label>
                                    <Select value={generateYear.toString()} onValueChange={(value) => setGenerateYear(parseInt(value))}>
                                        <SelectTrigger className="w-full h-10 rounded-md">
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearOptions.map((y) => (
                                                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Staff Member</label>
                                <Select value={generateStaffId || 'all'} onValueChange={(value) => setGenerateStaffId(value === 'all' ? '' : value)}>
                                    <SelectTrigger className="w-full h-10 rounded-md">
                                        <SelectValue placeholder="All Staff Members" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Staff Members</SelectItem>
                                        {staff.map((s) => (
                                            <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sendEmails"
                                    checked={sendEmailsOnGenerate}
                                    onChange={(e) => setSendEmailsOnGenerate(e.target.checked)}
                                    className="rounded border-border"
                                />
                                <label htmlFor="sendEmails" className="text-sm text-foreground">
                                    Send consolidated report to Admin
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateReports}
                                disabled={generating}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {generating ? (
                                    <>
                                        <RefreshCw size={16} className="animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={16} />
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

