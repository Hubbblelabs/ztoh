'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import SettingsTab from '../components/SettingsTab';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

export default function SettingsPage() {
    useSetPageTitle('Settings', 'Configure system settings');
    return (
        <div className="space-y-6">
            {/* Content */}
            <div className="bg-card rounded-md shadow-sm border border-border p-6">
                <SettingsTab />
            </div>
        </div>
    );
}
