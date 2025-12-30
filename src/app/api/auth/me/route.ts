import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import Staff from '@/models/Staff';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        
        // Check for unified token first, then legacy tokens
        let token = cookieStore.get('authToken')?.value;
        
        // Fallback to legacy tokens
        if (!token) {
            token = cookieStore.get('adminToken')?.value;
        }
        if (!token) {
            token = cookieStore.get('staffToken')?.value;
        }

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const role = payload.role as string || 'admin'; // Default to admin for legacy tokens

        if (role === 'admin') {
            const admin = await Admin.findById(payload.id).select('-password');
            if (!admin) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
            return NextResponse.json({ 
                user: admin, 
                role: 'admin' 
            });
        } else if (role === 'staff') {
            const staff = await Staff.findById(payload.id).select('-password');
            if (!staff || !staff.isActive) {
                return NextResponse.json({ error: 'User not found or inactive' }, { status: 404 });
            }
            return NextResponse.json({ 
                user: staff, 
                role: 'staff' 
            });
        }

        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
