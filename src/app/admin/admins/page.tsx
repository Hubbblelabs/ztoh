'use client';

import React, { useState } from 'react';
import { Shield, Check, X, UserPlus } from 'lucide-react';
import AdminList from '../components/AdminList';

export default function AdminsPage() {
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [triggerAddAdmin, setTriggerAddAdmin] = useState(false);

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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl">
                        <Shield className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Management</h1>
                        <p className="text-slate-500">Manage administrator accounts</p>
                    </div>
                </div>
                <button
                    onClick={() => setTriggerAddAdmin(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                    <UserPlus size={16} />
                    Add Admin
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <AdminList triggerAddAdmin={triggerAddAdmin} onAddAdminClosed={() => setTriggerAddAdmin(false)} />
            </div>
        </div>
    );
}
