import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        // Check authToken first (unified login), then legacy staffToken
        let token = cookieStore.get('authToken')?.value;
        if (!token) {
            token = cookieStore.get('staffToken')?.value;
        }

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload || payload.role !== 'staff') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const staff = await Staff.findById(payload.id).select('-password');

        if (!staff || !staff.isActive) {
            return NextResponse.json({ error: 'Staff not found or inactive' }, { status: 404 });
        }

        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
