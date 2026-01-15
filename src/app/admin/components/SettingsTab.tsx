'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsTab() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        fromEmail: '',
        adminEmail: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                if (data.emailSettings) {
                    setSettings(data.emailSettings);
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailSettings: settings }),
            });

            if (res.ok) {
                setMessage({ text: 'Settings saved successfully', type: 'success' });
            } else {
                setMessage({ text: 'Failed to save settings', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'An error occurred', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-40 mb-1" />
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Email Configuration</h2>
                    <p className="text-sm text-muted-foreground">Manage email settings for notifications</p>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">From Email</label>
                        <p className="text-xs text-muted-foreground mb-2">The email address that appears as the sender for automated emails.</p>
                        <input
                            type="email"
                            required
                            value={settings.fromEmail}
                            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                            className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="noreply@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Admin Notification Email</label>
                        <p className="text-xs text-muted-foreground mb-2">The email address that receives notifications about new requests.</p>
                        <input
                            type="email"
                            required
                            value={settings.adminEmail}
                            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                            className="w-full px-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

