import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
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

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const staff = await Staff.findById(payload.id);

        if (!staff || !staff.isActive) {
            return NextResponse.json({ error: 'Staff not found or inactive' }, { status: 404 });
        }

        const isMatch = await staff.comparePassword(currentPassword);

        if (!isMatch) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        staff.password = await bcrypt.hash(newPassword, salt);
        await staff.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
