'use client';

import { useEffect } from 'react';
import { usePageHeader } from '@/contexts/PageHeaderContext';

/**
 * Hook to set the page title in the header
 * @param title - The main title to display
 * @param subtitle - Optional subtitle text
 */
export function useSetPageTitle(title: string, subtitle?: string) {
    const { setPageHeader } = usePageHeader();

    useEffect(() => {
        setPageHeader(title, subtitle);
    }, [title, subtitle, setPageHeader]);
}
