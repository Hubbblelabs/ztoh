'use client';

import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, Calendar, CalendarDays, BookOpen, Plus, X } from 'lucide-react';
import Loader from '@/components/ui/Loader';

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
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        subject: '',
        course: '',
        description: ''
    });

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/staff/teaching-hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    hours: '',
                    subject: '',
                    course: '',
                    description: ''
                });
                fetchData();
            }
        } catch (error) {
            console.error('Error submitting hours:', error);
        } finally {
            setSubmitting(false);
        }
    };

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Teaching Hours</h1>
                        <p className="text-slate-500">Track your teaching activity</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Log Hours
                </button>
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

            {/* Add Hours Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Log Teaching Hours</h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hours</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    required
                                    value={formData.hours}
                                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g. 2.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g. Mathematics"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g. Grade 10"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24"
                                    placeholder="Brief description of topics covered..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Saving...' : 'Save Hours'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
