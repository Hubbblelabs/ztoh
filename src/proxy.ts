import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define paths to ignore (public assets, auth routes, login page)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/static') ||
        pathname === '/login' ||
        pathname === '/favicon.ico' ||
        pathname === '/globals.css'
    ) {
        return NextResponse.next();
    }

    // 2. Get the token
    // This works because we are using the 'jwt' session strategy in NextAuth
    const token = await getToken({ req: request });

    // 3. Protect /admin routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }

        if (token.role !== 'admin') {
            // User is logged in but not an admin
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 4. Protect /staff routes
    if (pathname.startsWith('/staff')) {
        if (!token) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }

        // Allow both staff and admin to access staff routes? 
        // Or strictly staff? The previous logic allowed staff. 
        // Usually admins might want to see staff view, but let's enforce role check.
        if (token.role !== 'staff' && token.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 5. Protect /api/admin routes (Double security alongside route handlers)
    if (pathname.startsWith('/api/admin')) {
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (token.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // 6. Protect /api/staff routes
    if (pathname.startsWith('/api/staff')) {
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (token.role !== 'staff' && token.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    return NextResponse.next();
}
