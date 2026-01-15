import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/db';
import Student from '@/models/Student';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const student = await Student.findOne({ email: session.user.email });

        if (!student || !student.isActive) {
            return NextResponse.json({ error: 'Student not found or inactive' }, { status: 404 });
        }

        const isMatch = await student.comparePassword(currentPassword);

        if (!isMatch) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        student.password = newPassword;
        await student.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
