'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, MoreVertical, Loader2, X } from 'lucide-react';
import { AdminUser } from './types';

interface AdminListProps {
    triggerAddAdmin: boolean;
    onAddAdminClosed: () => void;
}

export default function AdminList({ triggerAddAdmin, onAddAdminClosed }: AdminListProps) {
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

    useEffect(() => {
        if (triggerAddAdmin) {
            setShowAddAdminModal(true);
        }
    }, [triggerAddAdmin]);

    // Sync modal close with parent
    useEffect(() => {
        if (!showAddAdminModal && triggerAddAdmin) {
            onAddAdminClosed();
        }
    }, [showAddAdminModal, triggerAddAdmin, onAddAdminClosed]);

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
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-2" size={32} />
                <p className="text-slate-500">Loading admins...</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Created At</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {admins.map((admin) => (
                            <tr key={admin._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-semibold text-slate-900">{admin.name}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{admin.email}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(admin.createdAt)}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 transition-opacity">
                                        <button
                                            onClick={() => openEditAdminModal(admin)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteAdminModal(admin)}
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
                {admins.map((admin) => (
                    <div key={admin._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-slate-900">{admin.name}</h3>
                                <p className="text-sm text-slate-600">{admin.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditAdminModal(admin)}
                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                <button
                                    onClick={() => openDeleteAdminModal(admin)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 text-right">
                            Created: {formatDate(admin.createdAt)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Admin Modal */}
            {showAddAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Add New Admin</h3>
                            <button onClick={() => setShowAddAdminModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newAdmin.name}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            {addAdminMessage && (
                                <div className={`text-sm text-center p-2 rounded-lg ${addAdminStatus === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {addAdminMessage}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddAdminModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addAdminStatus === 'loading'}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Edit Admin</h3>
                            <button onClick={() => setShowEditAdminModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleEditAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editAdminData.name}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editAdminData.email}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={editAdminData.password}
                                    onChange={(e) => setEditAdminData({ ...editAdminData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditAdminModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editAdminStatus === 'loading'}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Admin?</h3>
                        <p className="text-slate-500 mb-8">
                            Are you sure you want to delete admin <span className="font-semibold text-slate-900">{selectedAdmin.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setShowDeleteAdminModal(false)}
                                className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAdmin}
                                disabled={deleteAdminStatus === 'loading'}
                                className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                {deleteAdminStatus === 'loading' && <Loader2 className="animate-spin" size={16} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
