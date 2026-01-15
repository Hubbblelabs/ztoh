'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PageHeaderContextType {
    title: string;
    subtitle?: string;
    setPageHeader: (title: string, subtitle?: string) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType | undefined>(undefined);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState('Dashboard');
    const [subtitle, setSubtitle] = useState<string | undefined>();

    const setPageHeader = (newTitle: string, newSubtitle?: string) => {
        setTitle(newTitle);
        setSubtitle(newSubtitle);
    };

    return (
        <PageHeaderContext.Provider value={{ title, subtitle, setPageHeader }}>
            {children}
        </PageHeaderContext.Provider>
    );
}

export function usePageHeader() {
    const context = useContext(PageHeaderContext);
    if (context === undefined) {
        throw new Error('usePageHeader must be used within a PageHeaderProvider');
    }
    return context;
}
