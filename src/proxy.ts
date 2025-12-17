import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Allow access to login page
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('adminToken')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect API admin routes
    if (pathname.startsWith('/api/admin')) {
        // Allow login endpoint
        if (pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('adminToken')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
