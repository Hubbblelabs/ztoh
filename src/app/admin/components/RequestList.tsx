'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Eye, Trash2, X, Plus, Check } from 'lucide-react';
import { JoinRequest, ContactRequest } from './types';

interface RequestListProps {
    activeTab: 'join' | 'contact';
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function RequestList({ activeTab, showToast }: RequestListProps) {
    const [requests, setRequests] = useState<(JoinRequest | ContactRequest)[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | ContactRequest | null>(null);

    // Search, Sort, Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
    const [filterType, setFilterType] = useState<'all' | 'student' | 'teacher'>('all');

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Form States
    const [editData, setEditData] = useState<any>({});
    const [editStatus, setEditStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // New Features State
    const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
    const [sendingEmail, setSendingEmail] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [addingNote, setAddingNote] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [activeTab]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/requests?type=${activeTab}`);
            if (res.ok) {
                setRequests(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;
        setEditStatus('loading');

        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: activeTab, ...editData }),
            });

            if (res.ok) {
                setEditStatus('success');
                fetchRequests();
                setTimeout(() => {
                    setShowEditModal(false);
                    setEditStatus('idle');
                }, 1000);
            } else {
                setEditStatus('error');
            }
        } catch (error) {
            setEditStatus('error');
        }
    };

    const handleDeleteRequest = async () => {
        if (!selectedRequest) return;
        setDeleteStatus('loading');

        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest._id}?type=${activeTab}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDeleteStatus('success');
                fetchRequests();
                setTimeout(() => {
                    setShowDeleteModal(false);
                    setSelectedRequest(null);
                    setDeleteStatus('idle');
                }, 1000);
            } else {
                setDeleteStatus('error');
            }
        } catch (error) {
            setDeleteStatus('error');
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedRequest) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    status: newStatus,
                    history: [...(selectedRequest.history || []), {
                        action: 'Status Update',
                        details: `Status changed to ${newStatus}`,
                        performedBy: 'Admin',
                        timestamp: new Date()
                    }]
                }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedRequest(updated);
                fetchRequests();
                showToast(`Status updated to ${newStatus}`, 'success');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleUpdateTeleStatus = async (newStatus: string) => {
        if (!selectedRequest) return;
        setUpdatingStatus(true);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    teleCallingStatus: newStatus,
                    history: [...(selectedRequest.history || []), {
                        action: 'Tele-calling Update',
                        details: `Tele-calling status changed to ${newStatus}`,
                        performedBy: 'Admin',
                        timestamp: new Date()
                    }]
                }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedRequest(updated);
                fetchRequests();
                showToast(`Tele-calling status updated to ${newStatus}`, 'success');
            }
        } catch (error) {
            console.error('Failed to update tele-status', error);
            showToast('Failed to update tele-status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest || !noteContent.trim()) return;
        setAddingNote(true);
        try {
            const res = await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: activeTab,
                    notes: [...(selectedRequest.notes || []), {
                        content: noteContent,
                        createdAt: new Date()
                    }]
                }),
            });
            if (res.ok) {
                const updated = await res.json();
                setSelectedRequest(updated);
                setNoteContent('');
                fetchRequests();
                showToast('Note added successfully', 'success');
            }
        } catch (error) {
            console.error('Failed to add note', error);
            showToast('Failed to add note', 'error');
        } finally {
            setAddingNote(false);
        }
    };

    const openEmailModal = () => {
        if (!selectedRequest) return;
        setEmailData({
            to: selectedRequest.email,
            subject: `Regarding your ${activeTab === 'join' ? 'Application' : 'Enquiry'} at Zero To Hero`,
            body: `Dear ${selectedRequest.name},\n\n`
        });
        setShowEmailModal(true);
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingEmail(true);
        try {
            const res = await fetch('/api/admin/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: emailData.to,
                    subject: emailData.subject,
                    html: emailData.body.replace(/\n/g, '<br>')
                }),
            });

            if (res.ok) {
                setShowEmailModal(false);
                if (selectedRequest) {
                    await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: activeTab,
                            history: [...(selectedRequest.history || []), {
                                action: 'Email Sent',
                                details: `Subject: ${emailData.subject}`,
                                performedBy: 'Admin',
                                timestamp: new Date()
                            }]
                        }),
                    });
                    fetchRequests();
                }
                showToast('Email sent successfully!', 'success');
            } else {
                showToast('Failed to send email.', 'error');
            }
        } catch (error) {
            console.error('Failed to send email', error);
            showToast('An error occurred.', 'error');
        } finally {
            setSendingEmail(false);
        }
    };

    const openEditModal = (request: any) => {
        setSelectedRequest(request);
        setEditData({ ...request });
        setShowEditModal(true);
    };

    const openDeleteModal = (request: any) => {
        setSelectedRequest(request);
        setShowDeleteModal(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getFilteredAndSortedRequests = () => {
        let filtered = [...requests];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(req =>
                req.name?.toLowerCase().includes(lowerTerm) ||
                req.email?.toLowerCase().includes(lowerTerm) ||
                req.trackingId?.toLowerCase().includes(lowerTerm) ||
                ((req as any).mobile && (req as any).mobile.includes(lowerTerm))
            );
        }

        if (activeTab === 'join' && filterType !== 'all') {
            filtered = filtered.filter(req => (req as JoinRequest).type === filterType);
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(req => (req.status || 'pending') === statusFilter);
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    };

    const displayedRequests = getFilteredAndSortedRequests();

    // Custom Select Component
    const CustomSelect = ({ value, onChange, options, label, disabled }: any) => {
        const [isOpen, setIsOpen] = useState(false);
        const selectedOption = options.find((opt: any) => opt.value === value);

        return (
            <div className="relative min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">{label}</label>
                <button
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium flex justify-between items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}`}
                >
                    <span className="capitalize">{selectedOption?.label || value}</span>
                    <Filter size={14} className="text-slate-400" />
                </button>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-100 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
                            {options.map((option: any) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === option.value ? 'text-primary font-semibold bg-primary/5' : 'text-slate-700'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-64"
                        />
                    </div>

                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-white">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="py-2 text-sm bg-transparent border-none focus:ring-0 text-slate-700 cursor-pointer outline-none"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-white">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                            className="py-2 text-sm bg-transparent border-none focus:ring-0 text-slate-700 cursor-pointer outline-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {activeTab === 'join' && (
                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-white">
                            <span className="text-xs font-semibold text-slate-500 uppercase">Type:</span>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as 'all' | 'student' | 'teacher')}
                                className="py-2 text-sm bg-transparent border-none focus:ring-0 text-slate-700 cursor-pointer outline-none"
                            >
                                <option value="all">All</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary mb-2" size={32} />
                        <p className="text-slate-500">Loading requests...</p>
                    </div>
                ) : displayedRequests.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        No requests found matching your criteria.
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Tracking No.</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        {activeTab === 'join' && <th className="px-6 py-4">Type</th>}
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {displayedRequests.map((request) => (
                                        <tr key={request._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{request.trackingId || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">{request.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600">{request.email}</div>
                                                {(request as any).mobile && <div className="text-xs text-slate-400 mt-0.5">{(request as any).mobile}</div>}
                                            </td>
                                            {activeTab === 'join' && (
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${(request as JoinRequest).type === 'teacher'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {(request as JoinRequest).type}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                    request.status === 'declined' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {request.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(request.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedRequest(request)}
                                                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(request)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4">
                            {displayedRequests.map((request) => (
                                <div key={request._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{request.trackingId || '-'}</span>
                                                <h3 className="font-semibold text-slate-900">{request.name}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500">{request.email}</p>
                                            {(request as any).mobile && <p className="text-xs text-slate-400">{(request as any).mobile}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(request)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 items-center text-xs">
                                        {activeTab === 'join' && (
                                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${(request as JoinRequest).type === 'teacher'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {(request as JoinRequest).type}
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                            request.status === 'declined' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {request.status || 'pending'}
                                        </span>
                                        <span className="text-slate-400 ml-auto">
                                            {formatDate(request.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* View Details Modal */}
            {selectedRequest && !showEditModal && !showDeleteModal && !showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Request Details</h3>
                                <p className="text-sm text-slate-500">Manage status and track history</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Status Actions */}
                                {activeTab !== 'contact' && (
                                    <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <CustomSelect
                                            label="Status"
                                            value={selectedRequest.status || 'pending'}
                                            onChange={handleUpdateStatus}
                                            disabled={updatingStatus}
                                            options={[
                                                { value: 'pending', label: 'Pending' },
                                                { value: 'accepted', label: 'Accepted' },
                                                { value: 'declined', label: 'Declined' }
                                            ]}
                                        />
                                        <CustomSelect
                                            label="Tele-calling Status"
                                            value={selectedRequest.teleCallingStatus || 'pending'}
                                            onChange={handleUpdateTeleStatus}
                                            disabled={updatingStatus}
                                            options={[
                                                { value: 'pending', label: 'Pending' },
                                                { value: 'called', label: 'Called' },
                                                { value: 'no_answer', label: 'No Answer' },
                                                { value: 'follow_up_needed', label: 'Follow Up Needed' },
                                                { value: 'converted', label: 'Converted' },
                                                { value: 'not_interested', label: 'Not Interested' }
                                            ]}
                                        />
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={openEmailModal}
                                        className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                                    >
                                        Send Email
                                    </button>
                                </div>

                                {/* Data Fields */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-900">Information</h4>
                                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50 last:border-0">
                                        <span className="text-sm font-semibold text-slate-500 capitalize">Tracking Number</span>
                                        <span className="col-span-2 text-sm text-slate-900 break-words font-mono bg-slate-50 px-2 py-1 rounded w-fit">
                                            {selectedRequest.trackingId || 'N/A'}
                                        </span>
                                    </div>
                                    {Object.entries(selectedRequest).map(([key, value]) => {
                                        if (['_id', '__v', 'updatedAt', 'status', 'teleCallingStatus', 'notes', 'history', 'trackingId'].includes(key)) return null;
                                        return (
                                            <div key={key} className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-50 last:border-0">
                                                <span className="text-sm font-semibold text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <span className="col-span-2 text-sm text-slate-900 break-words font-medium">
                                                    {key === 'createdAt' ? formatDate(value as string) : String(value)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Column: Notes & History */}
                            <div className="space-y-8">
                                {/* Notes */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">Notes</h4>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-60 overflow-y-auto mb-4 space-y-3">
                                        {selectedRequest.notes?.length ? (
                                            selectedRequest.notes.map((note, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                                    <p className="text-sm text-slate-700 mb-1">{note.content}</p>
                                                    <p className="text-xs text-slate-400">{formatDate(note.createdAt)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 text-center py-4">No notes yet.</p>
                                        )}
                                    </div>
                                    <form onSubmit={handleAddNote} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Add a note..."
                                            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={addingNote || !noteContent.trim()}
                                            className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </form>
                                </div>

                                {/* History */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-4">History</h4>
                                    <div className="relative border-l-2 border-slate-100 ml-2 space-y-6">
                                        {selectedRequest.history?.slice().reverse().map((event, idx) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white"></div>
                                                <p className="text-sm font-semibold text-slate-900">{event.action}</p>
                                                <p className="text-xs text-slate-500 mb-1">{event.details}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                                    {formatDate(event.timestamp)} • {event.performedBy}
                                                </p>
                                            </div>
                                        ))}
                                        {!selectedRequest.history?.length && (
                                            <p className="text-sm text-slate-400 pl-6">No history available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Send Email</h3>
                            <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                                <input
                                    type="email"
                                    value={emailData.to}
                                    disabled
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea
                                    value={emailData.body}
                                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    {sendingEmail && <Loader2 className="animate-spin" size={16} />}
                                    Send Email
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Edit Request</h3>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleEditRequest} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editData.name || ''}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editData.email || ''}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            {/* Add more fields as needed, keeping it simple for now */}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editStatus === 'loading'}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    {editStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Request?</h3>
                        <p className="text-slate-500 mb-8">
                            Are you sure you want to delete this request from <span className="font-semibold text-slate-900">{selectedRequest.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteRequest}
                                disabled={deleteStatus === 'loading'}
                                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {deleteStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
