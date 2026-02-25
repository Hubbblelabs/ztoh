'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import Chatbot from '@/components/Chatbot';
import BackToTop from '@/components/ui/BackToTop';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // Hide header/footer/WhatsApp icon/Chatbot for admin, staff, and login pages
    const isPortalPage =
        pathname?.startsWith('/admin') ||
        pathname?.startsWith('/staff') ||
        pathname?.startsWith('/student') ||
        pathname === '/login';

    return (
        <>
            {!isPortalPage && <ScrollProgressBar />}
            {!isPortalPage && <Header />}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
            >
                Skip to main content
            </a>
            <main id="main-content" className="grow">
                {children}
            </main>
            {!isPortalPage && <WhatsAppIcon />}
            {!isPortalPage && <Chatbot />}
            {!isPortalPage && <BackToTop />}
            {!isPortalPage && <Footer />}
        </>
    );
}
