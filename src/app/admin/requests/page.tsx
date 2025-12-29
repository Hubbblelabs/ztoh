'use client';

import React, { useState } from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import RequestList from '../components/RequestList';

export default function RequestsPage() {
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

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-sky-100 rounded-xl">
                    <UserPlus className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Join Requests</h1>
                    <p className="text-slate-500">Manage student join requests</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <RequestList activeTab="join" showToast={showToast} />
            </div>
        </div>
    );
}
