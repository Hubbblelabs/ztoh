'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Eye, Clock, Mail } from 'lucide-react';
import Loader from '@/components/ui/Loader';

interface Staff {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subjects: string[];
    isActive: boolean;
    createdAt: string;
}

interface StaffListProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

export default function StaffList({ showToast }: StaffListProps) {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [includeInactive, setIncludeInactive] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [subjects, setSubjects] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [formError, setFormError] = useState('');

    const fetchStaff = async () => {
        try {
            const res = await fetch(`/api/admin/staff?includeInactive=${includeInactive}`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setStaff(data.staff || []);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, [includeInactive]);

    const openAddModal = () => {
        setEditingStaff(null);
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setSubjects('');
        setIsActive(true);
        setFormError('');
        setShowModal(true);
    };

    const openEditModal = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setName(staffMember.name);
        setEmail(staffMember.email);
        setPassword('');
        setPhone(staffMember.phone || '');
        setSubjects(staffMember.subjects.join(', '));
        setIsActive(staffMember.isActive);
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        const subjectsArray = subjects.split(',').map(s => s.trim()).filter(s => s);

        try {
            const url = editingStaff
                ? `/api/admin/staff/${editingStaff._id}`
                : '/api/admin/staff';
            
            const body: any = {
                name,
                email,
                phone,
                subjects: subjectsArray,
                isActive,
            };

            if (password) {
                body.password = password;
            } else if (!editingStaff) {
                setFormError('Password is required for new staff members');
                return;
            }

            const res = await fetch(url, {
                method: editingStaff ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                showToast(
                    editingStaff ? 'Staff member updated successfully' : 'Staff member created successfully',
                    'success'
                );
                setShowModal(false);
                fetchStaff();
            } else {
                setFormError(data.error || 'An error occurred');
            }
        } catch (error) {
            setFormError('An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/staff/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                showToast('Staff member deleted successfully', 'success');
                setShowDeleteConfirm(null);
                fetchStaff();
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete staff member', 'error');
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-900">Staff Members</h2>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={includeInactive}
                            onChange={(e) => setIncludeInactive(e.target.checked)}
                            className="rounded border-slate-300"
                        />
                        Show inactive
                    </label>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    Add Staff
                </button>
            </div>

            {staff.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subjects</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Joined</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((member) => (
                                <tr key={member._id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-slate-900">{member.name}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{member.email}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {member.subjects.slice(0, 3).map((subject, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                                    {subject}
                                                </span>
                                            ))}
                                            {member.subjects.length > 3 && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                                    +{member.subjects.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            member.isActive 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-600">
                                        {formatDate(member.createdAt)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} className="text-slate-500" />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteConfirm(member._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <p>No staff members found.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">
                                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {editingStaff ? 'New Password (leave blank to keep current)' : 'Password *'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingStaff}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Subjects (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={subjects}
                                    onChange={(e) => setSubjects(e.target.value)}
                                    placeholder="Math, Physics, Chemistry"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            {editingStaff && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="rounded border-slate-300"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-slate-700">
                                        Active
                                    </label>
                                </div>
                            )}

                            {formError && (
                                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center">
                                    {formError}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    {editingStaff ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Staff Member</h3>
                        <p className="text-slate-600 mb-6">
                            Are you sure you want to delete this staff member? This will also delete all their teaching hours records.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
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
