'use client';

import React, { useState } from 'react';
import { MessageSquare, Check, X } from 'lucide-react';
import RequestList from '../components/RequestList';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

export default function ContactsPage() {
    useSetPageTitle('Contact Requests', 'Manage contact inquiries');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Content */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <RequestList activeTab="contact" showToast={showToast} />
            </div>
        </div>
    );
}
