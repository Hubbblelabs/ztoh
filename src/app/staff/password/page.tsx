'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, Check, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StaffPasswordPage() {
    useSetPageTitle('Change Password', 'Update your account password');
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/staff/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Password updated successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => router.push('/staff'), 2000);
            } else {
                setError(data.error || 'Failed to update password');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <div className="flex items-center">
                <Link
                    href="/staff"
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </Link>
            </div>

            {/* Form */}
            <div className="max-w-md">
                <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid w-full gap-3">
                            <Label htmlFor="currentPassword">
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="grid w-full gap-3">
                            <Label htmlFor="newPassword">
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="grid w-full gap-3">
                            <Label htmlFor="confirmPassword">
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                <X size={16} />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-md">
                                <Check size={16} />
                                {success}
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <Link
                                href="/staff"
                                className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md text-sm font-semibold hover:bg-muted/80 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-md text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
