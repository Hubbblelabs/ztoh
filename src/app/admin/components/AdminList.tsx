'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, MoreVertical, Loader2, X, Plus } from 'lucide-react';
import { AdminUser } from './types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminList() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

    // Modals
    const [showEditAdminModal, setShowEditAdminModal] = useState(false);
    const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);

    // Form States
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [addAdminStatus, setAddAdminStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [addAdminMessage, setAddAdminMessage] = useState('');

    const [editAdminData, setEditAdminData] = useState({ name: '', email: '', password: '' });
    const [editAdminStatus, setEditAdminStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const [deleteAdminStatus, setDeleteAdminStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                setAdmins(await res.json());
            }
        } catch (error) {
            console.error('Failed to fetch admins', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddAdminStatus('loading');
        setAddAdminMessage('');

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAdmin),
            });

            const data = await res.json();

            if (res.ok) {
                setAddAdminStatus('success');
                setAddAdminMessage('Admin added successfully');
                setNewAdmin({ name: '', email: '', password: '' });
                setTimeout(() => {
                    setShowAddAdminModal(false);
                    setAddAdminStatus('idle');
                    setAddAdminMessage('');
                    fetchAdmins();
                }, 2000);
            } else {
                setAddAdminStatus('error');
                setAddAdminMessage(data.error || 'Failed to add admin');
            }
        } catch (error) {
            setAddAdminStatus('error');
            setAddAdminMessage('An error occurred');
        }
    };

    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAdmin) return;
        setEditAdminStatus('loading');

        try {
            const res = await fetch(`/api/admin/users/${selectedAdmin._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editAdminData),
            });

            if (res.ok) {
                setEditAdminStatus('success');
                fetchAdmins();
                setTimeout(() => {
                    setShowEditAdminModal(false);
                    setEditAdminStatus('idle');
                }, 1000);
            } else {
                setEditAdminStatus('error');
            }
        } catch (error) {
            setEditAdminStatus('error');
        }
    };

    const handleDeleteAdmin = async () => {
        if (!selectedAdmin) return;
        setDeleteAdminStatus('loading');

        try {
            const res = await fetch(`/api/admin/users/${selectedAdmin._id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setDeleteAdminStatus('success');
                fetchAdmins();
                setTimeout(() => {
                    setShowDeleteAdminModal(false);
                    setSelectedAdmin(null);
                    setDeleteAdminStatus('idle');
                }, 1000);
            } else {
                setDeleteAdminStatus('error');
            }
        } catch (error) {
            setDeleteAdminStatus('error');
        }
    };

    const openEditAdminModal = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setEditAdminData({ name: admin.name, email: admin.email, password: '' });
        setShowEditAdminModal(true);
    };

    const openDeleteAdminModal = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        setShowDeleteAdminModal(true);
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

    if (loading) {
        return (
            <div className="space-y-4">
                {/* Desktop Skeleton */}
                <div className="hidden md:block">
                    <div className="border-b border-border py-4 px-6 bg-muted">
                        <div className="flex gap-8">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16 ml-auto" />
                        </div>
                    </div>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-8 px-6 py-4 border-b border-border">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-36" />
                            <div className="flex gap-2 ml-auto">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Mobile Skeleton */}
                <div className="md:hidden space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card p-4 rounded-md border border-border shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                            <Skeleton className="h-3 w-40 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-end">
                <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    Add Admin
                </button>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {admins.map((admin) => (
                            <tr key={admin._id} className="hover:bg-muted/50 transition-colors group">
                                <td className="px-6 py-4 font-semibold text-foreground">{admin.name}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{admin.email}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(admin.createdAt)}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 transition-opacity">
                                        <button
                                            onClick={() => openEditAdminModal(admin)}
                                            className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteAdminModal(admin)}
                                            className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
                {admins.map((admin) => (
                    <div key={admin._id} className="bg-card p-4 rounded-md border border-border shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-foreground">{admin.name}</h3>
                                <p className="text-sm text-muted-foreground">{admin.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditAdminModal(admin)}
                                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                <button
                                    onClick={() => openDeleteAdminModal(admin)}
                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                            Created: {formatDate(admin.createdAt)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Admin Modal */}
            {showAddAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-lg shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Add New Admin</h3>
                            <button onClick={() => setShowAddAdminModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            {addAdminMessage && (
                                <div className={`text-sm text-center p-2 rounded-lg ${addAdminStatus === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                                    {addAdminMessage}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAdminModal(false)}
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addAdminStatus === 'loading'}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    {addAdminStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                    Add Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Admin Modal */}
            {showEditAdminModal && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-lg shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Edit Admin</h3>
                            <button onClick={() => setShowEditAdminModal(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleEditAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editAdminData.name}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editAdminData.email}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">New Password (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={editAdminData.password}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditAdminModal(false)}
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editAdminStatus === 'loading'}
                                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    {editAdminStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Admin Modal */}
            {showDeleteAdminModal && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-lg shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Delete Admin?</h3>
                        <p className="text-muted-foreground mb-8">
                            Are you sure you want to delete admin <span className="font-semibold text-foreground">{selectedAdmin.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowDeleteAdminModal(false)}
                                className="px-6 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAdmin}
                                disabled={deleteAdminStatus === 'loading'}
                                className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {deleteAdminStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

