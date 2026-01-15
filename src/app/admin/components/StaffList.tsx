'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Eye, Clock, Mail, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from "@/components/ui/checkbox";

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
    const [searchTerm, setSearchTerm] = useState('');

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
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-3 border-b border-border">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3].map((j) => (
                                    <Skeleton key={j} className="h-5 w-16" />
                                ))}
                            </div>
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-4 w-24" />
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm rounded-md border border-border bg-background hover:bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors w-48"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <Checkbox
                            checked={includeInactive}
                            onCheckedChange={(checked: boolean | 'indeterminate') => setIncludeInactive(checked === true)}
                            className="rounded-sm"
                        />
                        Show inactive
                    </label>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    Add Staff
                </button>
            </div>

            {/* Filtered Staff List */}
            {staff.filter(member =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase())
            ).length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Subjects</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Joined</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.filter(member =>
                                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                member.email.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((member) => (
                                <tr key={member._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className="font-medium text-foreground">{member.name}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">{member.email}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {member.subjects.slice(0, 3).map((subject, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                                                    {subject}
                                                </span>
                                            ))}
                                            {member.subjects.length > 3 && (
                                                <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                                                    +{member.subjects.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {member.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-muted-foreground">
                                        {formatDate(member.createdAt)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} className="text-muted-foreground hover:text-foreground" />
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
                <div className="text-center py-12 text-muted-foreground">
                    <p>No staff members found matching your search.</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-md shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">
                                {editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-muted rounded-full transition-colors"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    {editingStaff ? 'New Password (leave blank to keep current)' : 'Password *'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingStaff}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">
                                    Subjects (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={subjects}
                                    onChange={(e) => setSubjects(e.target.value)}
                                    placeholder="Math, Physics, Chemistry"
                                    className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            {editingStaff && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={isActive}
                                        onCheckedChange={(checked: boolean | 'indeterminate') => setIsActive(checked === true)}
                                    />
                                    <label htmlFor="isActive" className="text-sm text-foreground cursor-pointer">
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
                                    className="px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
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
                    <div className="bg-card rounded-md shadow-2xl max-w-sm w-full p-6 border border-border">
                        <h3 className="text-lg font-bold text-foreground mb-2">Delete Staff Member</h3>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete this staff member? This will also delete all their teaching hours records.
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
