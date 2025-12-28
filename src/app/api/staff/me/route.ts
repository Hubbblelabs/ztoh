import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET(request: Request) {
    try {
        const cookies = request.headers.get('cookie') || '';
        // Check authToken first (unified login), then legacy staffToken
        let token = cookies.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
        if (!token) {
            token = cookies.split('; ').find(row => row.startsWith('staffToken='))?.split('=')[1];
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
