import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, currentPassword, newPassword } = await request.json();

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin not found' },
                { status: 404 }
            );
        }

        const isMatch = await admin.comparePassword(currentPassword);

        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid current password' },
                { status: 401 }
            );
        }

        admin.password = newPassword;
        await admin.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error: any) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
