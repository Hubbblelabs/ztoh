import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
};

// For interpolating user-supplied text into HTML (e.g. notification emails).
export function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

// Links to a homepage section. Off the homepage they must be root-relative to get there at
// all; on it they stay bare hashes so the browser just scrolls, instead of the router
// re-navigating to the route we are already on and replaying the page transition.
export function sectionHref(pathname: string | null, hash: string): string {
    return pathname === '/' ? hash : `/${hash}`;
}

// wa.me links need the full international number as digits only. Numbers entered without
// a country code are assumed to be Indian (+91).
export function toWhatsAppUrl(phone: string): string {
    let digits = phone.replace(/\D/g, '');
    if (!phone.trim().startsWith('+')) {
        if (digits.startsWith('00')) digits = digits.slice(2);
        else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
        if (digits.length === 10) digits = `91${digits}`;
    }
    return `https://wa.me/${digits}`;
}

export function generateTrackingId(_type: 'contact' | 'join' | 'feedback'): string {
    // Format: YYYYMMDD-XXXX (e.g., 20231201-1234)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit random number

    return `${year}${month}${day}-${random}`;
}
