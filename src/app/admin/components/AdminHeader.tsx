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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl shadow-sm border border-border">
            <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground text-sm">Manage your requests and administrators</p>
            </div>
            <div className="flex flex-wrap gap-3">
                {/* Add Admin button removed as it's now internal to the AdminList component */}
                <button
                    onClick={onChangePassword}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
                >
                    <Key size={18} />
                    Change Password
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-colors dark:bg-destructive/20 dark:hover:bg-destructive/30"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
}

