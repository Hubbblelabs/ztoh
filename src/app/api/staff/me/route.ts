import { NextResponse } from 'next/server';
import { verifyStaffAuth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';

export async function GET(request: Request) {
    try {
        const payload = await verifyStaffAuth();

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
