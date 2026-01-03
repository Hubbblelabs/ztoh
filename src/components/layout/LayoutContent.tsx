'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import Chatbot from "@/components/Chatbot";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Hide header/footer/WhatsApp icon/Chatbot for admin, staff, and login pages
    const isPortalPage = pathname?.startsWith('/admin') || pathname?.startsWith('/staff') || pathname?.startsWith('/student') || pathname === '/login';

    return (
        <>
            {!isPortalPage && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isPortalPage && <WhatsAppIcon />}
            {!isPortalPage && <Chatbot />}
            {!isPortalPage && <Footer />}
        </>
    );
}
