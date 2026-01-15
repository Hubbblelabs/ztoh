'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Eye, Trash2, X, Plus, Check, Paperclip } from 'lucide-react';
import { JoinRequest, ContactRequest } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    const [emailAttachments, setEmailAttachments] = useState<{ name: string; content: string; type: string }[]>([]);
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
                    }],
                    history: [...(selectedRequest.history || []), {
                        action: 'Note Added',
                        details: 'Admin added a note',
                        performedBy: 'Admin',
                        timestamp: new Date()
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
        setEmailAttachments([]);
        setShowEmailModal(true);
    };

    const handleEmailFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newAttachments: { name: string; content: string; type: string }[] = [];
        const MAX_SIZE = 3 * 1024 * 1024; // 3MB

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > MAX_SIZE) {
                showToast(`File ${file.name} exceeds 3MB limit`, 'error');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise<void>((resolve) => {
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        newAttachments.push({
                            name: file.name,
                            content: reader.result as string,
                            type: file.type
                        });
                    }
                    resolve();
                };
            });
        }
        setEmailAttachments(prev => [...prev, ...newAttachments]);
    };

    const removeEmailAttachment = (index: number) => {
        setEmailAttachments(prev => prev.filter((_, i) => i !== index));
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
                    html: emailData.body.replace(/\n/g, '<br>'),
                    attachments: emailAttachments
                }),
            });

            if (res.ok) {
                setShowEmailModal(false);
                if (selectedRequest) {
                    const updateRes = await fetch(`/api/admin/requests/${selectedRequest._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            type: activeTab,
                            history: [...(selectedRequest.history || []), {
                                action: 'Email Sent',
                                details: JSON.stringify({
                                    subject: emailData.subject,
                                    body: emailData.body,
                                    attachments: emailAttachments.length
                                }),
                                performedBy: 'Admin',
                                timestamp: new Date()
                            }]
                        }),
                    });
                    if (updateRes.ok) {
                        const updatedData = await updateRes.json();
                        setSelectedRequest(updatedData);
                    }
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

    // Status Select Component using shadcn Select
    const StatusSelect = ({ value, onChange, options, label, disabled }: {
        value: string;
        onChange: (value: string) => void;
        options: { value: string; label: string }[];
        label: string;
        disabled?: boolean;
    }) => {
        return (
            <div className="min-w-[200px]">
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</label>
                <Select value={value} onValueChange={onChange} disabled={disabled}>
                    <SelectTrigger className="w-full h-10 rounded-md">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 w-full sm:w-64"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | 'pending' | 'accepted' | 'declined')}>
                        <SelectTrigger className="w-[160px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Status:</span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}>
                        <SelectTrigger className="w-[140px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Sort:</span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                        </SelectContent>
                    </Select>

                    {activeTab === 'join' && (
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as 'all' | 'student' | 'teacher')}>
                            <SelectTrigger className="w-[150px] h-9 rounded-md bg-card">
                                <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Type:</span>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
                                <Skeleton className="h-6 w-24" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-4 w-28" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedRequests.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        No requests found matching your criteria.
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block rounded-md border border-border overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <th className="px-6 py-4">Tracking No.</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        {activeTab === 'join' && <th className="px-6 py-4">Type</th>}
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {displayedRequests.map((request) => (
                                        <tr key={request._id} className="hover:bg-muted/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{request.trackingId || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold text-foreground">{request.name}</div>
                                                    {activeTab === 'join' && (request as JoinRequest).attachments && (request as JoinRequest).attachments!.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-semibold" title={`${(request as JoinRequest).attachments!.length} attachment(s)`}>
                                                            <Paperclip size={10} />
                                                            {(request as JoinRequest).attachments!.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-muted-foreground">{request.email}</div>
                                                {(request as any).mobile && <div className="text-xs text-muted-foreground mt-0.5">{(request as any).mobile}</div>}
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
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {formatDate(request.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedRequest(request)}
                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(request)}
                                                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                                <div key={request._id} className="bg-card p-4 rounded-md border border-border shadow-sm space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{request.trackingId || '-'}</span>
                                                <h3 className="font-semibold text-foreground">{request.name}</h3>
                                                {activeTab === 'join' && (request as JoinRequest).attachments && (request as JoinRequest).attachments!.length > 0 && (
                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[9px] font-semibold" title={`${(request as JoinRequest).attachments!.length} attachment(s)`}>
                                                        <Paperclip size={9} />
                                                        {(request as JoinRequest).attachments!.length}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{request.email}</p>
                                            {(request as any).mobile && <p className="text-xs text-muted-foreground">{(request as any).mobile}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(request)}
                                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                                        <span className="text-muted-foreground ml-auto">
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
                    <div className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Request Details</h3>
                                <p className="text-sm text-muted-foreground">Manage status and track history</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Status Actions */}
                                {activeTab !== 'contact' && (
                                    <div className="flex flex-wrap gap-3 p-4 bg-muted rounded-md border border-border">
                                        <StatusSelect
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
                                        <StatusSelect
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
                                        className="flex-1 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-semibold hover:bg-blue-100 transition-colors"
                                    >
                                        Send Email
                                    </button>
                                </div>

                                {/* Data Fields */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-foreground">Information</h4>
                                    <div className="grid grid-cols-3 gap-4 pb-4 border-b border-border last:border-0">
                                        <span className="text-sm font-semibold text-muted-foreground capitalize">Tracking Number</span>
                                        <span className="col-span-2 text-sm text-foreground break-words font-mono bg-muted px-2 py-1 rounded w-fit">
                                            {selectedRequest.trackingId || 'N/A'}
                                        </span>
                                    </div>
                                    {Object.entries(selectedRequest).map(([key, value]) => {
                                        if (['_id', '__v', 'updatedAt', 'status', 'teleCallingStatus', 'notes', 'history', 'trackingId', 'attachments'].includes(key)) return null;
                                        return (
                                            <div key={key} className="grid grid-cols-3 gap-4 pb-4 border-b border-border last:border-0">
                                                <span className="text-sm font-semibold text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                <span className="col-span-2 text-sm text-foreground break-words font-medium">
                                                    {key === 'createdAt' ? formatDate(value as string) : String(value)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Attachments */}
                                {activeTab === 'join' && (selectedRequest as JoinRequest).type === 'teacher' && (
                                    <div className="space-y-4 pt-4 border-t border-border">
                                        <h4 className="font-bold text-foreground">Attachments</h4>
                                        {(selectedRequest as JoinRequest).attachments && (selectedRequest as JoinRequest).attachments!.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {(selectedRequest as JoinRequest).attachments!.map((att, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={att.content}
                                                        download={att.name}
                                                        className="flex items-center gap-3 p-3 bg-muted border border-border rounded-md hover:bg-muted transition-colors group"
                                                    >
                                                        <div className="w-10 h-10 bg-card rounded-md flex items-center justify-center text-muted-foreground shadow-sm group-hover:text-primary group-hover:scale-110 transition-all">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">{att.name}</p>
                                                            <p className="text-xs text-muted-foreground">Click to download</p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No attachments uploaded</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Notes & History */}
                            <div className="space-y-8">
                                {/* Notes */}
                                <div>
                                    <h4 className="font-bold text-foreground mb-4">Notes</h4>
                                    <div className="bg-muted rounded-md p-4 border border-border max-h-60 overflow-y-auto mb-4 space-y-3">
                                        {selectedRequest.notes?.length ? (
                                            selectedRequest.notes.map((note, idx) => (
                                                <div key={idx} className="bg-card p-3 rounded-md border border-border shadow-sm">
                                                    <p className="text-sm text-foreground mb-1">{note.content}</p>
                                                    <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-4">No notes yet.</p>
                                        )}
                                    </div>
                                    <form onSubmit={handleAddNote} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Add a note..."
                                            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={addingNote || !noteContent.trim()}
                                            className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </form>
                                </div>

                                {/* History */}
                                <div>
                                    <h4 className="font-bold text-foreground mb-4">History</h4>
                                    <div className="relative border-l-2 border-border ml-2 space-y-6">
                                        {selectedRequest.history?.slice().reverse().map((event, idx) => {
                                            let isEmail = event.action === 'Email Sent';
                                            let emailDetails = null;
                                            if (isEmail) {
                                                try {
                                                    emailDetails = JSON.parse(event.details);
                                                } catch (e) {
                                                    isEmail = false;
                                                }
                                            }

                                            return (
                                                <div key={idx} className="relative pl-6">
                                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/50 ring-4 ring-card"></div>
                                                    <p className="text-sm font-semibold text-foreground">{event.action}</p>
                                                    {isEmail && emailDetails ? (
                                                        <div className="mb-1">
                                                            <p className="text-xs text-muted-foreground">Subject: {emailDetails.subject}</p>
                                                            <button
                                                                onClick={() => {
                                                                    const win = window.open('', '_blank');
                                                                    if (win) {
                                                                        win.document.write('<pre style="white-space: pre-wrap; font-family: sans-serif;">' + emailDetails.body + '</pre>');
                                                                    }
                                                                }}
                                                                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                                                            >
                                                                View Content
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground mb-1">{event.details}</p>
                                                    )}
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                        {formatDate(event.timestamp)} • {event.performedBy}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                        {!selectedRequest.history?.length && (
                                            <p className="text-sm text-muted-foreground pl-6">No history available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-muted border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
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
                    <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Send Email</h3>
                            <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleSendEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">To</label>
                                <input
                                    type="email"
                                    value={emailData.to}
                                    disabled
                                    className="w-full px-4 py-2 rounded-md border border-border bg-muted text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Message</label>
                                <textarea
                                    value={emailData.body}
                                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Attachments</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleEmailFileChange}
                                        className="hidden"
                                        id="email-file-upload"
                                        multiple
                                    />
                                    <label
                                        htmlFor="email-file-upload"
                                        className="flex items-center justify-center w-full p-3 border border-dashed border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
                                    >
                                        <span className="text-sm text-muted-foreground">Click to attach files</span>
                                    </label>
                                </div>
                                {emailAttachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {emailAttachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md border border-border">
                                                <span className="text-xs text-muted-foreground truncate max-w-[200px]">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeEmailAttachment(index)}
                                                    className="text-red-500 hover:text-red-600 p-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEmailModal(false)}
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
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
                    <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Edit Request</h3>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleEditRequest} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editData.name || ''}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editData.email || ''}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 outline-none"
                                />
                            </div>
                            {/* Add more fields as needed, keeping it simple for now */}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editStatus === 'loading'}
                                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
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
                    <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Delete Request?</h3>
                        <p className="text-muted-foreground mb-8">
                            Are you sure you want to delete this request from <span className="font-semibold text-foreground">{selectedRequest.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedRequest(null);
                                }}
                                className="px-6 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteRequest}
                                disabled={deleteStatus === 'loading'}
                                className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
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

