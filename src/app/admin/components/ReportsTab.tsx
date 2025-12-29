'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Mail, RefreshCw, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '@/components/ui/Loader';

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
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);

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

    const handleResendEmail = async (reportId: string) => {
        setSendingEmail(reportId);
        try {
            const res = await fetch(`/api/admin/reports/${reportId}`, {
                method: 'POST',
            });

            const data = await res.json();

            if (res.ok) {
                showToast('Email sent successfully', 'success');
                fetchReports();
            } else {
                showToast(data.error || 'Failed to send email', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        } finally {
            setSendingEmail(null);
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
            <div className="flex items-center justify-center py-12">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Filters */}
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Staff</label>
                    <select
                        value={filterStaffId}
                        onChange={(e) => { setFilterStaffId(e.target.value); setPage(1); }}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                        <option value="">All Staff</option>
                        {staff.map((s) => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[120px]">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                    <select
                        value={filterYear}
                        onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                        <option value="">All Years</option>
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
                <div className="min-w-[140px]">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                    <select
                        value={filterMonth}
                        onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                        <option value="">All Months</option>
                        {MONTH_NAMES.map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>
                </div>
                {(filterStaffId || filterYear || filterMonth) && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Clear
                    </button>
                )}
                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors ml-auto"
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
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Period</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Staff</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Total Hours</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Generated</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email Sent</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4">
                                            <span className="font-medium text-slate-900">
                                                {MONTH_NAMES[report.month - 1]} {report.year}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                <span className="font-medium text-slate-900">{report.staffName}</span>
                                                <p className="text-xs text-slate-500">{report.staffEmail}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="font-bold text-lg text-primary">
                                                {report.totalHours.toFixed(1)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-600">
                                            {formatDate(report.generatedAt)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {report.emailSentAt ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Mail size={12} />
                                                    {formatDate(report.emailSentAt)}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Not sent</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleResendEmail(report._id)}
                                                    disabled={sendingEmail === report._id}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                                                    title={report.emailSentAt ? 'Resend Email' : 'Send Email'}
                                                >
                                                    {sendingEmail === report._id ? (
                                                        <RefreshCw size={14} className="animate-spin" />
                                                    ) : (
                                                        <Send size={14} />
                                                    )}
                                                    {report.emailSentAt ? 'Resend' : 'Send'}
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
                                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-sm text-slate-600">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No monthly reports found.</p>
                    <p className="text-sm mt-2">Click "Generate Reports" to create monthly reports for staff.</p>
                </div>
            )}

            {/* Generate Reports Modal */}
            {showGenerateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-900">Generate Monthly Reports</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Generate teaching hours reports for the selected period.
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                                    <select
                                        value={generateMonth}
                                        onChange={(e) => setGenerateMonth(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        {MONTH_NAMES.map((m, i) => (
                                            <option key={i} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                                    <select
                                        value={generateYear}
                                        onChange={(e) => setGenerateYear(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        {yearOptions.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Staff Member</label>
                                <select
                                    value={generateStaffId}
                                    onChange={(e) => setGenerateStaffId(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                >
                                    <option value="">All Staff Members</option>
                                    {staff.map((s) => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sendEmails"
                                    checked={sendEmailsOnGenerate}
                                    onChange={(e) => setSendEmailsOnGenerate(e.target.checked)}
                                    className="rounded border-slate-300"
                                />
                                <label htmlFor="sendEmails" className="text-sm text-slate-700">
                                    Send email reports to staff members
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateReports}
                                disabled={generating}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
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
