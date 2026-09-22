'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth-context';

interface FeedbackCountContextType {
    newCount: number;
    setNewCount: (count: number) => void;
}

const FeedbackCountContext = createContext<FeedbackCountContextType>({
    newCount: 0,
    setNewCount: () => {},
});

export const useFeedbackCount = () => useContext(FeedbackCountContext);

// Number of feedback entries still marked "new", shown in the sidebar and on the dashboard.
// Refreshed on every admin navigation; the feedback page pushes changes directly.
export function FeedbackCountProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const [newCount, setNewCount] = useState(0);
    const isLoggedIn = !!user;

    useEffect(() => {
        if (!isLoggedIn) return;

        const controller = new AbortController();
        fetch('/api/admin/feedback/count', { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (typeof data?.newCount === 'number') setNewCount(data.newCount);
            })
            .catch(() => {
                // The badge is non-essential; keep the last known count
            });

        return () => controller.abort();
    }, [isLoggedIn, pathname]);

    return (
        <FeedbackCountContext.Provider value={{ newCount, setNewCount }}>
            {children}
        </FeedbackCountContext.Provider>
    );
}
