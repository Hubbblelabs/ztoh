'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Settings } from 'lucide-react';
import AdminHeader from './components/AdminHeader';
import AdminList from './components/AdminList';
import RequestList from './components/RequestList';
import SettingsTab from './components/SettingsTab';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'join' | 'contact' | 'admins' | 'settings'>('join');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [triggerAddAdmin, setTriggerAddAdmin] = useState(false);

    // Global Toast
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Global Modals
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
    };

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch('/api/admin/me');
                if (res.ok) {
                    const data = await res.json();
                    setAdminEmail(data.email);
                    setIsAuthenticated(true);
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                router.push('/admin/login');
            }
        };
        fetchMe();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: adminEmail, currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordSuccess('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setShowPasswordModal(false), 2000);
            } else {
                setPasswordError(data.error || 'Failed to update password');
            }
        } catch (error) {
            setPasswordError('An error occurred');
        }
    };

    const handleAddAdminClick = () => {
        setActiveTab('admins');
        setTriggerAddAdmin(true);
    };

    // Toast Component
    const Toast = () => {
        if (!toast) return null;
        return (
            <div className={`fixed bottom-4 right-4 z-[60] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-50 text-white'}`}>
                {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                <span className="font-medium text-sm">{toast.message}</span>
            </div>
        );
    };

    if (!isAuthenticated) return null;

    return (
        <div className="space-y-8 relative">
            <Toast />

            <AdminHeader
                onAddAdmin={handleAddAdminClick}
                onChangePassword={() => setShowPasswordModal(true)}
                onLogout={handleLogout}
            />

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Tabs */}
                <div className="p-6 border-b border-slate-100">
                    <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl self-start sm:inline-flex">
                        <button
                            onClick={() => setActiveTab('join')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'join'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Join Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('contact')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'contact'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Contact Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'admins'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Admins
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'settings'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Settings size={16} />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'join' && <RequestList activeTab="join" showToast={showToast} />}
                    {activeTab === 'contact' && <RequestList activeTab="contact" showToast={showToast} />}
                    {activeTab === 'admins' && (
                        <AdminList
                            triggerAddAdmin={triggerAddAdmin}
                            onAddAdminClosed={() => setTriggerAddAdmin(false)}
                        />
                    )}
                    {activeTab === 'settings' && <SettingsTab />}
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            {passwordError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg text-center">{passwordError}</div>}
                            {passwordSuccess && <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg text-center">{passwordSuccess}</div>}

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
