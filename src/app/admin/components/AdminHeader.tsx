'use client';

import React from 'react';
import { UserPlus, Key, LogOut } from 'lucide-react';

interface AdminHeaderProps {
    onAddAdmin: () => void;
    onChangePassword: () => void;
    onLogout: () => void;
}

export default function AdminHeader({ onAddAdmin, onChangePassword, onLogout }: AdminHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div>
                <h1 className="text-2xl font-bold font-heading text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm">Manage your requests and administrators</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={onAddAdmin}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
                >
                    <UserPlus size={18} />
                    Add Admin
                </button>
                <button
                    onClick={onChangePassword}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                    <Key size={18} />
                    Change Password
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}
