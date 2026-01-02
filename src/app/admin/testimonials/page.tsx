'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Plus, Pencil, Trash2, Quote } from 'lucide-react';
import Loader from '@/components/ui/Loader';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    isActive: boolean;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
        rating: 5,
        isActive: true
    });

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/admin/testimonials');
            if (response.ok) {
                const data = await response.json();
                setTestimonials(data);
            } else {
                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                const error = await response.json();
                showToast(error.error || 'Failed to fetch testimonials', 'error');
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            showToast('Failed to fetch testimonials', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingTestimonial 
                ? `/api/admin/testimonials/${editingTestimonial._id}`
                : '/api/admin/testimonials';
            
            const method = editingTestimonial ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showToast(editingTestimonial ? 'Testimonial updated' : 'Testimonial created', 'success');
                setIsModalOpen(false);
                fetchTestimonials();
                resetForm();
            } else {
                const error = await response.json();
                showToast(error.error || 'Operation failed', 'error');
            }
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const response = await fetch(`/api/admin/testimonials/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                showToast('Testimonial deleted', 'success');
                fetchTestimonials();
            } else {
                showToast('Failed to delete', 'error');
            }
        } catch (error) {
            showToast('Failed to delete', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: '',
            content: '',
            rating: 5,
            isActive: true
        });
        setEditingTestimonial(null);
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setFormData({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            rating: testimonial.rating,
            isActive: testimonial.isActive
        });
        setIsModalOpen(true);
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                        <Star className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
                        <p className="text-slate-500">Manage student success stories</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                    <Plus size={16} />
                    Add Testimonial
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(testimonial)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial._id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-4 flex-grow">
                            <Quote className="w-6 h-6 text-slate-200 mb-2" />
                            <p className="text-slate-600 text-sm italic line-clamp-4">"{testimonial.content}"</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                            <p className="text-xs text-slate-500">{testimonial.role}</p>
                            <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${testimonial.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {testimonial.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="e.g. Student - CBSE 12"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 h-32 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    >
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <option key={r} value={r}>{r} Stars</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                                >
                                    {editingTestimonial ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
