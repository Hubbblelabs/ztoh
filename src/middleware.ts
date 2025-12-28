import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Check for authToken (unified) or adminToken (legacy)
        const authToken = request.cookies.get('authToken')?.value;
        const adminToken = request.cookies.get('adminToken')?.value;
        const token = authToken || adminToken;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify the user is an admin
        if (payload.role && payload.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Protect API admin routes
    if (pathname.startsWith('/api/admin')) {
        // Allow login endpoint
        if (pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        const authToken = request.cookies.get('authToken')?.value;
        const adminToken = request.cookies.get('adminToken')?.value;
        const token = authToken || adminToken;

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
