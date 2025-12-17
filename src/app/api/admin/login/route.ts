import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // Check if any admin exists, if not create a default one (for initial setup)
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            await Admin.create({
                name: 'Admin',
                email: 'admin@ztoh.com',
                password: 'admin', // In real app, hash this!
            });
        }

        const admin = await Admin.findOne({ email });
        console.log('Login attempt for:', email);

        if (!admin) {
            console.log('Login failed: Admin not found');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            console.log('Login failed: Invalid password');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signToken({ id: admin._id.toString(), email: admin.email });

        const response = NextResponse.json({ success: true });
        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
