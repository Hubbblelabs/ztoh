'use client';

import React, { useState, useEffect } from 'react';
import { Star, Check, X, Plus, Pencil, Trash2, Quote } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    isActive: boolean;
}

export default function TestimonialsPage() {
    useSetPageTitle('Testimonials', 'Manage student success stories');

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

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Button Skeleton */}
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <Skeleton key={j} className="h-4 w-4" />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                            <div className="mb-4 flex-grow space-y-2">
                                <Skeleton className="h-6 w-6" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="pt-4 border-t border-border space-y-2">
                                <Skeleton className="h-5 w-1/3" />
                                <Skeleton className="h-3 w-1/4" />
                                <Skeleton className="h-5 w-16 mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} />
                    Add Testimonial
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <div key={testimonial._id} className="bg-card p-6 rounded-lg shadow-sm border border-border flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(testimonial)}
                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
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
                            <p className="text-muted-foreground text-sm italic line-clamp-4">"{testimonial.content}"</p>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                            <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${testimonial.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
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
                    <div className="bg-card rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-border flex justify-between items-center">
                            <h2 className="text-xl font-bold text-foreground">
                                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Role / Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    placeholder="e.g. Student - CBSE 12"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-slate-900 h-32 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">Rating</label>
                                    <Select value={formData.rating.toString()} onValueChange={(value) => setFormData({ ...formData, rating: Number(value) })}>
                                        <SelectTrigger className="w-full h-10 rounded-md">
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <SelectItem key={r} value={r.toString()}>{r} Stars</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 rounded border-border text-foreground focus:ring-slate-900"
                                        />
                                        <span className="text-sm font-medium text-foreground">Active</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-muted text-foreground rounded-md font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
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

