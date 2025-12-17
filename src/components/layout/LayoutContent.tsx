'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

export default function LayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminPage && <Header />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdminPage && <WhatsAppIcon />}
            {!isAdminPage && <Footer />}
        </>
    );
}
