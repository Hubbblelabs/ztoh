'use client';

import React, { useState } from 'react';
import { Shield, Check, X, UserPlus } from 'lucide-react';
import AdminList from '../components/AdminList';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

export default function AdminsPage() {
    useSetPageTitle('Admin Management', 'Manage administrator accounts');
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
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Content */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                <AdminList />
            </div>
        </div>
    );
}
