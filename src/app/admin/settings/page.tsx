'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import SettingsTab from '../components/SettingsTab';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                    <Settings className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                    <p className="text-slate-500">Configure system settings</p>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <SettingsTab />
            </div>
        </div>
    );
}
