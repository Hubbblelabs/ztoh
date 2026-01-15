'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface TeachingHour {
    _id: string;
    staffId: {
        _id: string;
        name: string;
        email: string;
    } | null;
    date: string;
    hours: number;
    subject: string;
    course?: string;
    description?: string;
}

interface Staff {
    _id: string;
    name: string;
    email: string;
}

interface TeachingHoursTabProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function TeachingHoursTab({ showToast }: TeachingHoursTabProps) {
    const [records, setRecords] = useState<TeachingHour[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState<TeachingHour | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 20;

    // Filters
    const [filterStaffId, setFilterStaffId] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Derived filter values
    const filterStartDate = dateRange?.from ? dateRange.from.toISOString().split('T')[0] : '';
    const filterEndDate = dateRange?.to ? dateRange.to.toISOString().split('T')[0] : filterStartDate;

    // Form fields
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [date, setDate] = useState('');
    const [hours, setHours] = useState('');
    const [subject, setSubject] = useState('');
    const [course, setCourse] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState('');

    const fetchRecords = async () => {
        try {
            let url = `/api/admin/teaching-hours?page=${page}&limit=${limit}`;
            if (filterStaffId) url += `&staffId=${filterStaffId}`;
            if (filterStartDate) url += `&startDate=${filterStartDate}`;
            if (filterEndDate) url += `&endDate=${filterEndDate}`;

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setRecords(data.records || []);
                setTotalPages(data.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching teaching hours:', error);
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
        fetchRecords();
    }, [page, filterStaffId, dateRange]);

    const openAddModal = () => {
        setEditingRecord(null);
        setSelectedStaffId('');
        setDate(new Date().toISOString().split('T')[0]);
        setHours('');
        setSubject('');
        setCourse('');
        setDescription('');
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (record: TeachingHour) => {
        setEditingRecord(record);
        setSelectedStaffId(record.staffId?._id || '');
        setDate(new Date(record.date).toISOString().split('T')[0]);
        setHours(record.hours.toString());
        setSubject(record.subject);
        setCourse(record.course || '');
        setDescription(record.description || '');
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!selectedStaffId && !editingRecord) {
            setFormError('Please select a staff member');
            return;
        }

        try {
            const url = editingRecord
                ? `/api/admin/teaching-hours/${editingRecord._id}`
                : '/api/admin/teaching-hours';

            const body: any = {
                date,
                hours: parseFloat(hours),
                subject,
                course,
                description,
            };

            if (!editingRecord) {
                body.staffId = selectedStaffId;
            }

            const res = await fetch(url, {
                method: editingRecord ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(
                    editingRecord ? 'Record updated successfully' : 'Teaching hours added successfully',
                    'success'
                );
                setShowModal(false);
                fetchRecords();
            } else {
                setFormError(data.error || 'An error occurred');
            }
        } catch (error) {
            setFormError('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/teaching-hours/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                showToast('Record deleted successfully', 'success');
                setShowDeleteConfirm(null);
                fetchRecords();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete record', 'error');
            }
        } catch (error) {
            showToast('An error occurred', 'error');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        setFilterStaffId('');
        setDateRange(undefined);
        setPage(1);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <Skeleton className="h-10 flex-1 min-w-[200px]" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-10 w-28 ml-auto" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border-b border-border">
                            <Skeleton className="h-4 w-28" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-5 w-12" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                <Select value={filterStaffId || 'all'} onValueChange={(value) => { setFilterStaffId(value === 'all' ? '' : value); setPage(1); }}>
                    <SelectTrigger className="w-full sm:w-[200px] h-9 rounded-md bg-card">
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
                <div className="w-full sm:w-auto">
                    <DateRangePicker
                        date={dateRange}
                        setDate={(range) => {
                            setDateRange(range);
                            setPage(1);
                        }}
                        align="start"
                    />
                </div>
                {(filterStaffId || dateRange) && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors sm:ml-auto"
                >
                    <Plus size={16} />
                    Add Hours
                </button>
            </div>

            {/* Records Table */}
            {records.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Staff</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Hours</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((record) => (
                                    <tr key={record._id} className="border-b border-border hover:bg-muted">
                                        <td className="py-3 px-4 text-sm text-foreground">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div>
                                                {record.staffId ? (
                                                    <>
                                                        <span className="font-medium text-foreground">{record.staffId.name}</span>
                                                        <p className="text-xs text-muted-foreground">{record.staffId.email}</p>
                                                    </>
                                                ) : (
                                                    <span className="font-medium text-muted-foreground italic">Unknown / Deleted Staff</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-foreground">{record.subject}</td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">{record.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-foreground text-right font-medium">
                                            {record.hours.toFixed(1)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(record)}
                                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} className="text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(record._id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
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
                    <p>No teaching hours records found.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">
                                {editingRecord ? 'Edit Teaching Hours' : 'Add Teaching Hours'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {!editingRecord && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Staff Member *</label>
                                    <Select value={selectedStaffId} onValueChange={setSelectedStaffId} required>
                                        <SelectTrigger className="w-full h-10 rounded-md">
                                            <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {staff.map((s) => (
                                                <SelectItem key={s._id} value={s._id}>{s.name} ({s.email})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Hours *</label>
                                <input
                                    type="number"
                                    required
                                    step="0.5"
                                    min="0"
                                    max="24"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g., 2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Subject *</label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g., Mathematics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Course</label>
                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="e.g., Grade 10 Advanced"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Optional notes about the session"
                                />
                            </div>

                            {formError && (
                                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center">
                                    {formError}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    {editingRecord ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Record</h3>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete this teaching hours record?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

