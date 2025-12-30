import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Staff from '@/models/Staff';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        const staff = await Staff.findOne({ email, isActive: true });
        console.log('Staff login attempt for:', email);

        if (!staff) {
            console.log('Login failed: Staff not found or inactive');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await staff.comparePassword(password);

        if (!isMatch) {
            console.log('Login failed: Invalid password');
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = await signToken({ 
            id: staff._id.toString(), 
            email: staff.email,
            role: 'staff'
        });

        const response = NextResponse.json({ success: true });
        response.cookies.set('staffToken', token, {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;

    } catch (error: any) {
        console.error('Staff login error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
