
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    Check,
    AlertCircle,
    Loader2,
    Phone,
    Mail,
    User
} from 'lucide-react';
import Loader from '@/components/ui/Loader';

interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminStudentsPage() {
    const { data: session } = useSession();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        isActive: true
    });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');
    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/admin/students');
            if (res.ok) {
                const data = await res.json();
                setStudents(data.students);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
            showToast('Failed to fetch students', 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            isActive: true
        });
        setEditingStudent(null);
        setError('');
        // setSuccess('');
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (student: Student) => {
        resetForm();
        setFormData({
            name: student.name,
            email: student.email,
            password: '', // Don't fill password
            phone: student.phone || '',
            isActive: student.isActive
        });
        setEditingStudent(student);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFormLoading(true);

        try {
            const url = editingStudent
                ? `/api/admin/students/${editingStudent._id}`
                : '/api/admin/students';

            const method = editingStudent ? 'PUT' : 'POST';

            // Filter out empty password if editing
            const body = { ...formData };
            if (editingStudent && !body.password) {
                delete (body as any).password;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                setShowModal(false);
                fetchStudents();
                const action = editingStudent ? 'updated' : 'created';
                showToast(`Student ${action} successfully`, 'success');
            } else {
                setError(data.error || 'Operation failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/students/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setShowDeleteConfirm(null);
                fetchStudents();
                showToast('Student deleted successfully', 'success');
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to delete student', 'error');
            }
        } catch (error) {
            showToast('An error occurred while deleting', 'error');
        }
    };

    // Filter students
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'} transition-all duration-300 transform translate-y-0 opacity-100`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
                    <p className="text-slate-500">Manage student accounts and access</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Add Student
                </button>
            </div>

            {/* Search and Stats */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search students by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="px-3 py-1 bg-slate-100 rounded-lg">
                        Total: <span className="font-semibold text-slate-900">{students.length}</span>
                    </div>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                        Active: <span className="font-semibold">{students.filter(s => s.isActive).length}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Name</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Contact Info</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">Joined</th>
                                <th className="text-right py-4 px-6 text-sm font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-900">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Mail size={14} />
                                                    {student.email}
                                                </div>
                                                {student.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                                        <Phone size={14} />
                                                        {student.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.isActive
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                {student.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {new Date(student.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(student)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                                                    title="Edit student"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(student._id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500 transition-colors"
                                                    title="Delete student"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">
                                {editingStudent ? 'Edit Student' : 'Add New Student'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {editingStudent ? 'Password (leave blank to keep current)' : 'Password *'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingStudent}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder={editingStudent ? "••••••••" : "Choose a secure password"}
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                                    Account is Active
                                </label>
                            </div>

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
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
                                >
                                    {formLoading && <Loader2 size={16} className="animate-spin" />}
                                    {editingStudent ? 'Save Changes' : 'Create Student'}
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
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Delete Student</h3>
                        <p className="text-slate-600 text-center mb-6">
                            Are you sure you want to delete this student? This action cannot be undone.
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
